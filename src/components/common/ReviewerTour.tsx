import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScenarioStore } from '../../state/scenarioStore';
import { useSettingsStore } from '../../state/settingsStore';
import { calculateUptake } from '../../engine/uptake';
import { formatPercent } from '../../utils/format';
import { Button } from './Button';
import { ProgressIndicator } from './ProgressIndicator';
const steps=[
  'TAYA-STEPS translates planned preference evidence into service-planning scenarios for uptake, reach, cost, workforce and equity.',
  'The tour starts with Rapid flexible early support, the central prototype preset.',
  'This step shows live youth and parent predicted uptake from the synthetic coefficient sets.',
  'Waiting time is now changed from 1 to 3 weeks so the modelled effect can be seen directly.',
  'Regional and lower-resource modifiers illustrate how transparent prototype heterogeneity can be explored without fabricating protected-characteristic effects.',
  'The capacity view compares required service hours and FTE with editable available workforce.',
  'Saved scenarios can be compared side by side on uptake, reach, cost, capacity and equity.',
  'The Optimiser enumerates feasible configurations and identifies non-dominated options rather than declaring one best policy.',
  'The Evidence page exposes source grades, active assumptions, links and model integrity checks.',
  'The Reports page generates an executive brief, service-planning report, technical report and methods report.'
];
export function ReviewerTour({onClose}: {onClose:()=>void}){const [i,setI]=useState(0);const navigate=useNavigate();const load=useScenarioStore(s=>s.loadPreset);const update=useScenarioStore(s=>s.updateScenario);const scenario=useScenarioStore(s=>s.scenario);const complete=useSettingsStore(s=>s.setTourCompleted);const u=calculateUptake(scenario);const apply=(next:number)=>{setI(next);if(next===1)load('rapid-flexible');if(next===3)update({waitWeeks:3});if(next===4)update({subgroups:['regional','lower-resources'],heterogeneityEnabled:true});if(next===5)navigate('/results?tab=capacity');if(next===6)navigate('/compare');if(next===7)navigate('/optimiser');if(next===8)navigate('/evidence');if(next===9)navigate('/reports');};const close=(done=false)=>{if(done)complete(true);onClose();};return <div className="tour" role="dialog" aria-modal="true" aria-label="Reviewer tour"><ProgressIndicator current={i+1} total={steps.length}/><h2 style={{marginTop:0}}>Reviewer tour</h2><p>{steps[i]}</p>{i===2&&<p><strong>Youth {formatPercent(u.youth)} | Parent/carer {formatPercent(u.parent)}</strong></p>}<div className="action-row"><Button onClick={()=>close(false)}>Exit tour</Button>{i>0&&<Button onClick={()=>apply(i-1)}>Previous</Button>}{i<steps.length-1?<Button className="primary" onClick={()=>apply(i+1)}>Next</Button>:<Button className="primary" onClick={()=>close(true)}>Finish tour</Button>}<Button onClick={()=>close(true)}>Skip tour</Button></div></div>;}
