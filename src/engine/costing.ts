import { unitCosts } from '../data/unitCosts';
import type { Scenario } from '../types/scenario';
import type { ReachResult, CostResult } from '../types/model';

export interface ResourceUse { clinicianMinutes:number; adminMinutes:number; navigatorMinutes:number; youthMentalMinutes:number; primaryStaff:string; }
export function resourceUsePerStarter(s:Scenario):ResourceUse {
  const ru=s.resourceUseOverrides??{assessment:25,admin:15,briefContact:30,followUp:10,review:20};
  const follow=s.followUp==='both'?ru.followUp*2:s.followUp==='requested'?0:ru.followUp;
  let clinician=ru.assessment, navigator=0, youthMental=0;
  if(s.professionalSupport==='three') clinician+=ru.briefContact*3;
  if(s.professionalSupport==='six') clinician+=ru.briefContact*6;
  if(s.professionalSupport==='stepped') clinician+=ru.briefContact*3+ru.briefContact*3*0.25+ru.review;
  clinician+=follow;
  if(s.setting==='online') { navigator=ru.assessment+ru.admin; youthMental=Math.max(0,clinician-ru.assessment); clinician=0; }
  return {clinicianMinutes:clinician,adminMinutes:ru.admin,navigatorMinutes:navigator,youthMentalMinutes:youthMental,primaryStaff:s.setting};
}
function rate(s:Scenario,key:keyof typeof unitCosts){return s.unitCostOverrides?.[key]??unitCosts[key].central;}
function staffRate(s:Scenario):number {
  if(s.setting==='school') return rate(s,'school');
  if(s.setting==='gp') return s.professionalSupport==='navigation'?rate(s,'gp'):rate(s,'generalPsych');
  if(s.setting==='youth-service') return rate(s,'youthMental');
  return rate(s,'navigator');
}
function staffLabel(s:Scenario):string {
  if(s.setting==='school') return unitCosts.school.label;
  if(s.setting==='gp') return s.professionalSupport==='navigation'?unitCosts.gp.label:unitCosts.generalPsych.label;
  if(s.setting==='youth-service') return unitCosts.youthMental.label;
  return unitCosts.navigator.label;
}
export function calculateCosts(s:Scenario,reach:ReachResult):CostResult {
  const r=resourceUsePerStarter(s); const starters=reach.starters;
  const byStaff:Record<string,number>={};
  let clinicianHours=0;
  if(s.setting==='online') {
    const navHours=r.navigatorMinutes/60*starters; const ymHours=r.youthMentalMinutes/60*starters;
    byStaff[unitCosts.navigator.label]=navHours*rate(s,'navigator');
    byStaff[unitCosts.youthMental.label]=ymHours*rate(s,'youthMental');
    clinicianHours=navHours+ymHours;
  } else {
    clinicianHours=r.clinicianMinutes/60*starters; byStaff[staffLabel(s)]=clinicianHours*staffRate(s);
  }
  const adminHours=r.adminMinutes/60*starters; byStaff[unitCosts.admin.label]=adminHours*rate(s,'admin');
  const annualVariableCost=Object.values(byStaff).reduce((a,b)=>a+b,0); const annualFixedCost=s.maintenanceCost+s.setupCost;
  const annualTotalCost=annualVariableCost+annualFixedCost;
  return {annualVariableCost,annualFixedCost,annualTotalCost,costPerOffered:reach.offered?annualTotalCost/reach.offered:0,costPerStarter:starters?annualTotalCost/starters:0,costPerCompleter:reach.completed?annualTotalCost/reach.completed:0,byStaff,clinicianHours,adminHours};
}
