import * as XLSX from 'xlsx';
import { evidenceRegistry } from '../data/evidenceRegistry';
import { getActiveCoefficients } from '../data/prototypeCoefficients';
import { unitCosts } from '../data/unitCosts';
import type { Scenario } from '../types/scenario';
import { getReportData } from './reportData';
function ws(rows:any[]){return XLSX.utils.json_to_sheet(rows);}
export function buildExcelWorkbook(s:Scenario){const d=getReportData(s);const wb=XLSX.utils.book_new();const add=(name:string,rows:any[])=>XLSX.utils.book_append_sheet(wb,ws(rows),name);
 add('Summary',[{Scenario:s.name,'Youth uptake':d.uptake.youth,'Parent uptake':d.uptake.parent,'Family uptake':d.uptake.family,'Annual cost':d.costs.annualTotalCost,'FTE required':d.capacity.fteRequired,'Equity gap':d.equity.maxGap,'Net benefit':d.economic.netBenefit,BCR:d.economic.bcr}]);
 add('Scenario Inputs',[s]);
 add('Uptake',[{Perspective:'Youth',Uptake:d.uptake.youth,Utility:d.uptake.youthUtility.total},{Perspective:'Parent/carer',Uptake:d.uptake.parent,Utility:d.uptake.parentUtility.total},{Perspective:'Family-compatible',Uptake:d.uptake.family}]);
 const coefs:any[]=[];const activeCoefs=getActiveCoefficients();for(const group of ['youth','parent'] as const){const g=activeCoefs[group];coefs.push({Group:group,Parameter:'ASC',Mean:g.asc.mean,SE:g.asc.se},{Group:group,Parameter:'Wait per week',Mean:g.waitPerWeek.mean,SE:g.waitPerWeek.se},{Group:group,Parameter:'Cost per AUD 10',Mean:g.costPer10.mean,SE:g.costPer10.se});for(const [domain,obj] of Object.entries({Setting:g.setting,Delivery:g.delivery,'Parent involvement':g.parentInvolvement,'Professional support':g.professionalSupport,'Follow-up':g.followUp}))for(const [level,v] of Object.entries(obj))coefs.push({Group:group,Parameter:`${domain}: ${level}`,Mean:v.mean,SE:v.se});} add('Preference Coefficients',coefs);
 add('Population and Reach',[d.reach]);add('Unit Costs',Object.entries(unitCosts).map(([k,v])=>({Key:k,...v})));add('Budget Impact',d.budget);add('Capacity',[d.capacity]);add('Equity',d.equity.rows);add('Economic Value',[d.economic]);add('Sensitivity',d.sensitivity);add('Evidence Register',evidenceRegistry);return wb;}
export function workbookToArrayBuffer(s:Scenario){return XLSX.write(buildExcelWorkbook(s),{type:'array',bookType:'xlsx'}) as ArrayBuffer;}
