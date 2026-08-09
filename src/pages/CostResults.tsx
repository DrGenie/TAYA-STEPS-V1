import type { Scenario } from '../types/scenario';
import { calculateUptake } from '../engine/uptake';
import { calculateReach } from '../engine/reach';
import { calculateCosts } from '../engine/costing';
import { calculateBudgetImpact } from '../engine/budgetImpact';
import { CostBreakdownChart } from '../components/charts/CostBreakdownChart';
import { BudgetImpactChart } from '../components/charts/BudgetImpactChart';
import { formatCurrency } from '../utils/currency';
import { mbsReferences } from '../data/unitCosts';
import { DataTable } from '../components/common/DataTable';
import { Details } from '../components/common/Details';

export function CostResults({scenario}: {scenario:Scenario}){
  const u=calculateUptake(scenario),r=calculateReach(scenario,u.family),c=calculateCosts(scenario,r),budget=calculateBudgetImpact(scenario,c);
  return <section>
    <h2>Service cost</h2>
    <p className="result-lead"><strong>{formatCurrency(c.annualTotalCost)} annual service-provider resource cost</strong>, or {formatCurrency(c.costPerStarter)} per starter.</p>
    <div className="mini-metrics"><div><span>Annual service cost</span><strong>{formatCurrency(c.annualTotalCost)}</strong></div><div><span>Cost per starter</span><strong>{formatCurrency(c.costPerStarter)}</strong></div><div><span>Family cost in scenario</span><strong>{formatCurrency(scenario.familyCost)}</strong></div></div>
    <CostBreakdownChart byStaff={c.byStaff}/>
    <Details summary="Budget impact over time"><BudgetImpactChart rows={budget}/></Details>
    <Details summary="Medicare reference values">
      <p className="small">MBS schedule fees and benefits are shown only as Australian Government payer reference values. They are not combined with the service-provider resource cost and are not treated as economic opportunity costs.</p>
      <DataTable caption="Medicare reference values" rows={mbsReferences} columns={[{key:'i',header:'Item',render:x=>x.item},{key:'l',header:'Service',render:x=>x.label},{key:'s',header:'Schedule fee',render:x=>formatCurrency(x.scheduleFee,2)},{key:'b',header:'Benefit',render:x=>formatCurrency(x.benefit,2)}]}/>
    </Details>
  </section>;
}
