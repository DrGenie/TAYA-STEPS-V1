import type { Scenario } from '../types/scenario';
import type { ReachResult } from '../types/model';
export function calculateReach(scenario:Scenario,uptake:number):ReachResult {
  const target=scenario.population; const offered=target*scenario.offerRate; const starters=offered*uptake; const completed=starters*scenario.completionRate; const referred=starters*scenario.referralRate; const referralCompleted=referred*scenario.referralCompletion;
  return {target,offered,uptake,starters,completed,referred,referralCompleted};
}
