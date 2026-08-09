import type { Scenario } from '../types/scenario';
import type { CostResult } from '../types/model';
export interface BudgetYear {year:number;variable:number;fixed:number;total:number;cumulative:number;}
export function calculateBudgetImpact(s:Scenario,cost:CostResult):BudgetYear[]{
  let cumulative=0; const rows:BudgetYear[]=[];
  for(let y=1;y<=s.budgetHorizon;y++){
    const variable=cost.annualVariableCost*Math.pow(1+s.inflation,y-1); const fixed=s.maintenanceCost+(y===1?s.setupCost:0); const total=variable+fixed; cumulative+=total; rows.push({year:y,variable,fixed,total,cumulative});
  }
  return rows;
}
