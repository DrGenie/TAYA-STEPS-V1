import type { Scenario } from '../types/scenario';
import { scenarioSchema } from '../types/scenario';
import { scenarioPresets } from '../data/scenarioPresets';
import { evidenceRegistry } from '../data/evidenceRegistry';
import { calculateUptake, multiAlternativeProbabilities } from './uptake';
import { calculateReach } from './reach';
import { calculateCosts } from './costing';
import { calculateCapacity } from './capacity';
import { calculateEconomic } from './economic';
export interface IntegrityCheck {name:string;passed:boolean;detail:string;}
export function runIntegrityChecks(s:Scenario):IntegrityCheck[]{
  const u=calculateUptake(s);const r=calculateReach(s,u.family);const c=calculateCosts(s,r);const cap=calculateCapacity(s,r);const e=calculateEconomic(s,r,c);const moreWait=calculateUptake({...s,waitWeeks:s.waitWeeks+1});const moreCost=calculateUptake({...s,familyCost:s.familyCost+10});const probs=multiAlternativeProbabilities([u.youthUtility.total,u.parentUtility.total]);
  const checks:IntegrityCheck[]=[
    {name:'Probabilities bounded',passed:[u.youth,u.parent,u.family,...probs].every(p=>p>=0&&p<=1),detail:'All calculated probabilities are between 0 and 1.'},
    {name:'Choice probabilities sum to 1',passed:Math.abs(probs.reduce((a,b)=>a+b,0)-1)<1e-10,detail:'Multi-alternative probabilities reconcile.'},
    {name:'Waiting time direction',passed:moreWait.youth<=u.youth&&moreWait.parent<=u.parent,detail:'Increasing waiting time does not increase modelled uptake.'},
    {name:'Cost direction',passed:moreCost.youth<=u.youth&&moreCost.parent<=u.parent,detail:'Increasing family cost does not increase modelled uptake.'},
    {name:'Population flow',passed:r.starters<=r.offered&&r.completed<=r.starters&&r.referred<=r.starters&&r.referralCompleted<=r.referred,detail:'Reach stages are monotonic and bounded.'},
    {name:'Non-negative resources',passed:c.annualTotalCost>=0&&cap.requiredHours>=0&&cap.fteRequired>=0,detail:'Costs and resource use are non-negative.'},
    {name:'Finite outputs',passed:[...Object.values(u).filter(v=>typeof v==='number'),r.starters,c.annualTotalCost,cap.fteRequired,e.netBenefit,e.bcr].every(v=>Number.isFinite(v as number)),detail:'No NaN or infinite primary outputs.'},
    {name:'Evidence metadata',passed:evidenceRegistry.every(x=>x.id&&x.label&&x.sourceGrade&&x.sourceTitle&&x.sourceOrganisationOrAuthors&&x.lastReviewed&&x.url),detail:'Every evidence record has required provenance metadata.'},
    {name:'Preset schema validation',passed:scenarioPresets.every(x=>scenarioSchema.safeParse(x).success),detail:'All five scenario presets pass schema validation.'}
  ];return checks;
}
