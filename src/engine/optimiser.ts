import type { Scenario, Setting, Delivery } from '../types/scenario';
import { calculateUptake } from './uptake';
import { calculateReach } from './reach';
import { calculateCosts } from './costing';
import { calculateCapacity } from './capacity';
import { calculateEquity } from './equity';
import { calculateEconomic } from './economic';

export interface OptimiserConstraints {maxBudget:number;maxFte:number;maxWait:number;maxFamilyCost:number;minYouth:number;minParent:number;minFamily:number;maxEquityGap:number;requiredDeliveries:Delivery[];allowedSettings:Setting[];}
export interface OptimiserResult {scenario:Scenario;youth:number;parent:number;family:number;reach:number;completion:number;annualCost:number;costPerStarter:number;fte:number;utilisation:number;equityGap:number;netBenefit:number;bcr:number;pareto:boolean;}
export const defaultOptimiserConstraints:OptimiserConstraints={maxBudget:3000000,maxFte:12,maxWait:6,maxFamilyCost:120,minYouth:0,minParent:0,minFamily:0,maxEquityGap:1,requiredDeliveries:[],allowedSettings:['school','gp','youth-service','online']};
const settings:Setting[]=['school','gp','youth-service','online'];const waits=[3/7,1,3,6];const deliveries:Delivery[]=['face-to-face','video','online-checkins','choice'];const parents= ['youth-choice','first-contact','progress-summaries','scheduled-contacts'] as const;const supports=['navigation','three','six','stepped'] as const;const followUps=['requested','one-week','one-month','both'] as const;const costs=[0,30,60,120];
function dominates(a:OptimiserResult,b:OptimiserResult){const noWorse=a.family>=b.family&&a.annualCost<=b.annualCost&&a.fte<=b.fte&&a.equityGap<=b.equityGap;const better=a.family>b.family||a.annualCost<b.annualCost||a.fte<b.fte||a.equityGap<b.equityGap;return noWorse&&better;}
export function optimise(base:Scenario,constraints:OptimiserConstraints=defaultOptimiserConstraints):OptimiserResult[]{
  const out:OptimiserResult[]=[];let idx=0;
  for(const setting of settings)for(const waitWeeks of waits)for(const delivery of deliveries)for(const parentInvolvement of parents)for(const professionalSupport of supports)for(const followUp of followUps)for(const familyCost of costs){
    if(!constraints.allowedSettings.includes(setting)||waitWeeks>constraints.maxWait||familyCost>constraints.maxFamilyCost||(constraints.requiredDeliveries.length&&!constraints.requiredDeliveries.includes(delivery)))continue;
    const scenario={...base,id:`opt-${idx++}`,name:`Option ${idx}`,setting,waitWeeks,delivery,parentInvolvement,professionalSupport,followUp,familyCost,modifiedAt:new Date().toISOString()};const u=calculateUptake(scenario);if(u.youth<constraints.minYouth||u.parent<constraints.minParent||u.family<constraints.minFamily)continue;const reach=calculateReach(scenario,u.family);const cost=calculateCosts(scenario,reach);const capacity=calculateCapacity(scenario,reach);if(cost.annualTotalCost>constraints.maxBudget||capacity.fteRequired>constraints.maxFte)continue;const equity=calculateEquity(scenario);if(equity.maxGap>constraints.maxEquityGap)continue;const econ=calculateEconomic(scenario,reach,cost);out.push({scenario,youth:u.youth,parent:u.parent,family:u.family,reach:reach.starters,completion:reach.completed,annualCost:cost.annualTotalCost,costPerStarter:cost.costPerStarter,fte:capacity.fteRequired,utilisation:capacity.utilisation,equityGap:equity.maxGap,netBenefit:econ.netBenefit,bcr:econ.bcr,pareto:false});
  }
  const shortlist=out.sort((a,b)=>b.family-a.family).slice(0,300);
  shortlist.forEach((r,i)=>{r.pareto=!shortlist.some((other,j)=>i!==j&&dominates(other,r));}); return shortlist;
}
