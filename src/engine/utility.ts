import { getActiveCoefficients, type CoefficientSet, type Group } from '../data/prototypeCoefficients';
import { prototypeInteractions } from '../data/prototypeInteractions';
import { prototypeSegments } from '../data/prototypeSegments';
import type { Scenario } from '../types/scenario';
import type { UtilityBreakdown } from '../types/model';

export function logistic(value:number):number {
  if (value >= 0) { const z=Math.exp(-value); return 1/(1+z); }
  const z=Math.exp(value); return z/(1+z);
}
export function softmax(values:number[]):number[] {
  const max=Math.max(...values); const e=values.map(v=>Math.exp(v-max)); const sum=e.reduce((a,b)=>a+b,0); return e.map(v=>v/sum);
}

function modifiers(scenario:Scenario, group:Group) {
  let asc=0, online=0, wait=1, cost=1;
  if (scenario.heterogeneityEnabled) for (const subgroup of scenario.subgroups) {
    if (subgroup==='elevated-anxiety') asc += group==='youth' ? prototypeInteractions[subgroup].youthAsc : prototypeInteractions[subgroup].parentAsc;
    if (subgroup==='previous-service') asc += group==='youth' ? prototypeInteractions[subgroup].youthAsc : prototypeInteractions[subgroup].parentAsc;
    if (subgroup==='regional') { online += group==='youth' ? prototypeInteractions[subgroup].youthOnline : prototypeInteractions[subgroup].parentOnline; wait*=prototypeInteractions[subgroup].waitMultiplier; }
    if (subgroup==='lower-resources') cost*=prototypeInteractions[subgroup].costMultiplier;
    if (subgroup==='higher-resources') cost*=prototypeInteractions[subgroup].costMultiplier;
  }
  return {asc,online,wait,cost};
}

function oneUtility(scenario:Scenario, group:Group, coefficients:CoefficientSet, segment?:typeof prototypeSegments[number]):UtilityBreakdown {
  const c=coefficients[group]; const m=modifiers(scenario,group); const sm=segment?.modifiers;
  const asc=c.asc.mean+m.asc;
  const setting=c.setting[scenario.setting].mean*(sm?.setting ?? 1);
  const waitingTime=c.waitPerWeek.mean*scenario.waitWeeks*m.wait*(sm?.wait ?? 1);
  const delivery=(c.delivery[scenario.delivery].mean + (scenario.setting==='online'?m.online:0))*(sm?.delivery ?? 1);
  const parentInvolvement=c.parentInvolvement[scenario.parentInvolvement].mean*(sm?.parent ?? 1);
  const professionalSupport=c.professionalSupport[scenario.professionalSupport].mean*(sm?.professional ?? 1);
  const followUp=c.followUp[scenario.followUp].mean*(sm?.followUp ?? 1);
  const cost=c.costPer10.mean*(scenario.familyCost/10)*m.cost*(sm?.cost ?? 1);
  const interactions=m.asc+m.online;
  const total=asc+setting+waitingTime+delivery+parentInvolvement+professionalSupport+followUp+cost;
  return {asc,setting,waitingTime,delivery,parentInvolvement,professionalSupport,followUp,cost,interactions,total};
}

export function utilityBreakdown(scenario:Scenario, group:Group, coefficients:CoefficientSet=getActiveCoefficients()):UtilityBreakdown {
  if (!scenario.segmentsEnabled) return oneUtility(scenario,group,coefficients);
  const weighted=prototypeSegments.map(seg=>({u:oneUtility(scenario,group,coefficients,seg),share:seg.share}));
  const keys=['asc','setting','waitingTime','delivery','parentInvolvement','professionalSupport','followUp','cost','interactions','total'] as const;
  return Object.fromEntries(keys.map(k=>[k,weighted.reduce((sum,x)=>sum+x.u[k]*x.share,0)])) as unknown as UtilityBreakdown;
}
