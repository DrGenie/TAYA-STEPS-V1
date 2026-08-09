import type { Scenario } from '../types/scenario';
import type { CoefficientSet } from '../data/prototypeCoefficients';
import { getActiveCoefficients } from '../data/prototypeCoefficients';
import type { UptakeResult } from '../types/model';
import { logistic, utilityBreakdown } from './utility';
import { familyUptake } from './familyDecision';
export function calculateUptake(scenario:Scenario,coefficients:CoefficientSet=getActiveCoefficients()):UptakeResult {
  const youthUtility=utilityBreakdown(scenario,'youth',coefficients); const parentUtility=utilityBreakdown(scenario,'parent',coefficients);
  const youth=logistic(youthUtility.total); const parent=logistic(parentUtility.total);
  return {youthUtility,parentUtility,youth,parent,family:familyUptake(scenario.familyMode,youthUtility.total,parentUtility.total,youth,parent)};
}
export function multiAlternativeProbabilities(utilities:number[]):number[]{
  const max=Math.max(0,...utilities); const exp=utilities.map(v=>Math.exp(v-max)); const neither=Math.exp(-max); const denom=neither+exp.reduce((a,b)=>a+b,0); return [...exp.map(v=>v/denom),neither/denom];
}
