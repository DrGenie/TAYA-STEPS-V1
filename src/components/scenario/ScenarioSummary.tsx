import { Link } from 'react-router-dom';
import { useScenarioStore } from '../../state/scenarioStore';
import { calculateUptake } from '../../engine/uptake';
import { calculateReach } from '../../engine/reach';
import { calculateCosts } from '../../engine/costing';
import { calculateCapacity } from '../../engine/capacity';
import { formatPercent, formatNumber } from '../../utils/format';
import { formatCurrency } from '../../utils/currency';

export function ScenarioSummary(){
  const s=useScenarioStore(x=>x.scenario);
  const u=calculateUptake(s),r=calculateReach(s,u.family),c=calculateCosts(s,r),cap=calculateCapacity(s,r);
  return <aside className="summary-card sticky-summary" aria-label="Live scenario results">
    <span className="eyebrow">Live prototype estimate</span>
    <h2>{s.name}</h2>
    <dl className="summary-metrics">
      <div><dt>Family uptake</dt><dd>{formatPercent(u.family)}</dd></div>
      <div><dt>Expected starters</dt><dd>{formatNumber(r.starters)}</dd></div>
      <div><dt>Annual cost</dt><dd>{formatCurrency(c.annualTotalCost)}</dd></div>
      <div><dt>Workforce</dt><dd>{cap.fteRequired.toFixed(2)} FTE</dd></div>
    </dl>
    <details className="summary-details"><summary>Youth and parent estimates</summary><dl><dt>Youth uptake</dt><dd>{formatPercent(u.youth)}</dd><dt>Parent/carer uptake</dt><dd>{formatPercent(u.parent)}</dd></dl></details>
    <Link className="button summary-link" to="/results">View full results</Link>
    <p className="small muted">Illustrative estimates, not TAYA study results.</p>
  </aside>;
}
