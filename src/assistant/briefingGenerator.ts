import type { Scenario } from '../types/scenario';
import { calculateUptake } from '../engine/uptake';
import { calculateReach } from '../engine/reach';
import { calculateCosts } from '../engine/costing';
import { calculateCapacity } from '../engine/capacity';
import { calculateEconomic } from '../engine/economic';
import { formatCurrency } from '../utils/currency';
import { formatPercent, formatNumber } from '../utils/format';
export type BriefType='ministerial'|'commissioning'|'economic'|'research'|'plain';
export function generateBriefing(s:Scenario,type:BriefType='ministerial'){
  const u=calculateUptake(s),r=calculateReach(s,u.family),c=calculateCosts(s,r),cap=calculateCapacity(s,r),e=calculateEconomic(s,r,c);
  const prefix='The following information comes from TAYA-STEPS, an illustrative research prototype. Preference coefficients and selected economic inputs are literature-informed prototype assumptions, not empirical TAYA study findings. Preserve that distinction in your analysis.';
  const context=`Scenario: ${s.name}. Youth uptake ${formatPercent(u.youth)}, parent/carer uptake ${formatPercent(u.parent)}, family-compatible uptake ${formatPercent(u.family)}. Planning population ${formatNumber(s.population)}, offer rate ${formatPercent(s.offerRate)}, modelled starters ${formatNumber(r.starters)}, completers ${formatNumber(r.completed)}. Annual service-provider resource cost ${formatCurrency(c.annualTotalCost)}. Workforce requirement ${cap.fteRequired.toFixed(2)} FTE with status ${cap.status}. Exploratory net benefit ${formatCurrency(e.netBenefit)} and benefit-cost ratio ${e.bcr.toFixed(2)}, if the economic assumptions are used.`;
  const asks:Record<BriefType,string>={ministerial:'Prepare a concise policy briefing with implications, constraints, caveats and decisions that require judgement.',commissioning:'Prepare a service commissioning analysis focused on reach, workforce, cost, implementation constraints and options.',economic:'Interpret the health-economic scenario, clearly separating budget impact, economic value assumptions and preference-based monetary equivalents.',research:'Prepare a research summary explaining the model, evidence provenance, limitations and which empirical uncertainties TAYA should reduce.',plain:'Prepare a plain-language summary suitable for consumers and community representatives without overstating the prototype evidence.'};
  return `${prefix}\n\n${context}\n\n${asks[type]}`;
}
export function generateLocalPolicyBrief(s:Scenario){const u=calculateUptake(s),r=calculateReach(s,u.family),c=calculateCosts(s,r),cap=calculateCapacity(s,r);return `Under the current prototype assumptions, ${s.name} is estimated to have a family-compatible uptake of ${formatPercent(u.family,0)}. For a planning population of ${formatNumber(s.population)} adolescents with ${formatPercent(s.offerRate,0)} offered the pathway, this corresponds to approximately ${formatNumber(r.starters)} starters and ${formatNumber(r.completed)} completers. The estimated service requirement is ${cap.fteRequired.toFixed(1)} FTE and the annual delivery cost is approximately ${formatCurrency(c.annualTotalCost)}. These results are illustrative and use literature-informed preference and costing parameters pending empirical estimates from the TAYA study.`;}
