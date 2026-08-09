import type { Scenario } from '../types/scenario';
import { calculateEquity } from '../engine/equity';
import { EquityDotPlot } from '../components/charts/EquityDotPlot';
import { DataTable } from '../components/common/DataTable';
import { formatCurrency } from '../utils/currency';
import { formatNumber, formatPercent } from '../utils/format';
export function EquityResults({scenario}: {scenario:Scenario}){const e=calculateEquity(scenario);return <section><h2>Equity</h2><p><strong>Headline result:</strong> maximum absolute modelled uptake gap across the specified prototype groups is {formatPercent(e.maxGap)}.</p><EquityDotPlot rows={e.rows}/><DataTable caption="Equity scenario results" rows={e.rows} columns={[{key:'g',header:'Group',render:r=>r.group},{key:'u',header:'Predicted uptake',render:r=>formatPercent(r.uptake)},{key:'d',header:'Difference vs overall',render:r=>formatPercent(r.difference)},{key:'r',header:'Expected reach',render:r=>formatNumber(r.reach)},{key:'c',header:'Completion',render:r=>formatNumber(r.completion)},{key:'cost',header:'Cost per starter',render:r=>formatCurrency(r.costPerStarter)},{key:'n',header:'Evidence note',render:r=>r.note}]}/><p className="small">No synthetic differentials are imposed by gender, sexual orientation, cultural background or First Nations status. Future empirical TAYA estimates can replace neutral values.</p></section>;}
