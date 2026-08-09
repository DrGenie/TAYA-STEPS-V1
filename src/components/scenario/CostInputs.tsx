import { useScenarioStore } from '../../state/scenarioStore';
import { unitCosts } from '../../data/unitCosts';
import { Field } from '../common/Field';
export function CostInputs(){const s=useScenarioStore(x=>x.scenario),update=useScenarioStore(x=>x.updateScenario);const values=s.unitCostOverrides??{};return <div className="grid cols-2">{Object.entries(unitCosts).map(([key,v])=><Field key={key} label={`${v.label} loaded cost (AUD/hour)`} hint={`Prototype range ${v.low} to ${v.high}. Grade ${v.grade}.`} evidenceId={`cost-${key}`}><input type="number" min="0" step="1" value={values[key]??v.central} onChange={e=>update({unitCostOverrides:{...values,[key]:Number(e.target.value)}})}/></Field>)}</div>;}
