import { defaultCapacity } from '../data/defaultCapacity';
import { resourceUsePerStarter } from './costing';
import type { Scenario } from '../types/scenario';
import type { ReachResult, CapacityResult } from '../types/model';
function fte(s:Scenario,key:string,def:number){return s.capacityFteOverrides?.[key]??def;}
function availableFte(s:Scenario):number {
  if(s.setting==='school') return fte(s,'school',defaultCapacity.fte.school);
  if(s.setting==='gp') return s.professionalSupport==='navigation'?fte(s,'gp',defaultCapacity.fte.gp):fte(s,'generalPsych',defaultCapacity.fte.generalPsych);
  if(s.setting==='youth-service') return fte(s,'youthMental',defaultCapacity.fte.youthMental);
  return fte(s,'navigator',defaultCapacity.fte.navigator)+fte(s,'youthMental',defaultCapacity.fte.youthMental);
}
export function calculateCapacity(s:Scenario,reach:ReachResult):CapacityResult {
  const r=resourceUsePerStarter(s); const hoursPerStarter=(r.clinicianMinutes+r.navigatorMinutes+r.youthMentalMinutes)/60;
  const requiredHours=hoursPerStarter*reach.starters; const fteAvailable=availableFte(s); const availableHours=fteAvailable*s.annualHours; const utilisation=availableHours?requiredHours/availableHours:Infinity; const fteRequired=requiredHours/s.annualHours; const fteGap=fteRequired-fteAvailable; const maximumAnnualStarters=hoursPerStarter?availableHours/hoursPerStarter:Infinity;
  const status=utilisation<0.8?'Available capacity':utilisation<=1?'Tight capacity':'Capacity exceeded';
  return {requiredHours,availableHours,utilisation,fteRequired,fteAvailable,fteGap,maximumAnnualStarters,monthlyDemand:reach.starters/12,referralDemand:reach.referred,status};
}
