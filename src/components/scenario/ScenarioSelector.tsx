import { scenarioPresets } from '../../data/scenarioPresets';
import { useScenarioStore } from '../../state/scenarioStore';
export function ScenarioSelector(){const id=useScenarioStore(s=>s.scenario.id);const load=useScenarioStore(s=>s.loadPreset);return <div className="field"><label htmlFor="scenario-preset">Scenario preset</label><select id="scenario-preset" value={scenarioPresets.some(p=>p.id===id)?id:''} onChange={e=>load(e.target.value)}><option value="" disabled>Custom scenario</option>{scenarioPresets.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>;}
