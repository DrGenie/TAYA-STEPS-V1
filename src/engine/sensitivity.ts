import type { Scenario } from '../types/scenario';
import { calculateUptake } from './uptake';
import { calculateReach } from './reach';
import { calculateCosts } from './costing';
import { calculateEconomic } from './economic';
export interface SensitivityRow {parameter:string;lowLabel:string;highLabel:string;low:number;base:number;high:number;metric:string;}
function metric(s:Scenario,key:'uptake'|'cost'|'netBenefit'){const u=calculateUptake(s);const r=calculateReach(s,u.family);const c=calculateCosts(s,r);if(key==='uptake')return u.family;if(key==='cost')return c.annualTotalCost;return calculateEconomic(s,r,c).netBenefit;}
export function oneWaySensitivity(s:Scenario,key:'uptake'|'cost'|'netBenefit'='netBenefit'):SensitivityRow[]{
  const base=metric(s,key); const specs=[
    ['Waiting time','waitWeeks',Math.max(0,s.waitWeeks-1),Math.min(12,s.waitWeeks+3),'weeks'],
    ['Family cost','familyCost',0,Math.max(120,s.familyCost),'AUD'],
    ['Completion','completionRate',0.60,0.90,'proportion'],
    ['Improvement probability','improvementProbability',0.05,0.35,'proportion'],
    ['QALY gain','qalyGain',0.015,0.08,'QALY'],
    ['Value per QALY','qalyValue',30000,75000,'AUD']
  ] as const;
  return specs.map(([name,field,low,high,unit])=>({parameter:name,lowLabel:`${low} ${unit}`,highLabel:`${high} ${unit}`,low:metric({...s,[field]:low},key),base,high:metric({...s,[field]:high},key),metric:key}));
}
export function thresholdForBcrOne(s:Scenario):{qalyGain:number;improvementProbability:number}{
  const u=calculateUptake(s),r=calculateReach(s,u.family),c=calculateCosts(s,r),e=calculateEconomic(s,r,c); return {qalyGain:e.breakEvenQalyGain,improvementProbability:e.breakEvenImprovementProbability};
}
