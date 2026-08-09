import { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Details } from '../components/common/Details';
import { useScenarioStore } from '../state/scenarioStore';
import { Button } from '../components/common/Button';
import { downloadBlob, downloadText } from '../utils/download';
import { format } from 'date-fns';
import { slugify } from '../utils/format';
import { exportScenarioJson } from '../reports/jsonExport';
import { generateLocalPolicyBrief, generateBriefing, type BriefType } from '../assistant/briefingGenerator';
import { Modal } from '../components/common/Modal';
import { copyAndOpen, type ExternalProvider } from '../assistant/externalAI';
import { calculateUptake } from '../engine/uptake';
import { calculateReach } from '../engine/reach';
import { calculateCosts } from '../engine/costing';
import { calculateCapacity } from '../engine/capacity';
import { calculateEquity } from '../engine/equity';

export function ReportsPage(){
  const s=useScenarioStore(x=>x.scenario);
  const [brief,setBrief]=useState(generateLocalPolicyBrief(s)),[external,setExternal]=useState<ExternalProvider|null>(null),[briefType,setBriefType]=useState<BriefType>('ministerial');
  const base=`TAYA-STEPS_${slugify(s.name)}_${format(new Date(),'yyyy-MM-dd')}`;
  const pdfReport=async(type:'executive'|'service'|'technical'|'methods')=>{const [{pdf},{TayaReportDocument}]=await Promise.all([import('@react-pdf/renderer'),import('../reports/FullTechnicalReport')]);const blob=await pdf(<TayaReportDocument scenario={s} type={type}/>).toBlob();downloadBlob(blob,`${base}_${type}.pdf`);};
  const excel=async()=>{const {workbookToArrayBuffer}=await import('../reports/excelExport');downloadBlob(new Blob([workbookToArrayBuffer(s)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),`${base}.xlsx`);};
  const csv=()=>{const u=calculateUptake(s),r=calculateReach(s,u.family),c=calculateCosts(s,r),cap=calculateCapacity(s,r),eq=calculateEquity(s);downloadText(['measure,value',`youth uptake,${u.youth}`,`parent uptake,${u.parent}`,`family uptake,${u.family}`,`starters,${r.starters}`,`completers,${r.completed}`,`annual cost,${c.annualTotalCost}`,`fte required,${cap.fteRequired}`,`equity gap,${eq.maxGap}`].join('\n'),`${base}_results.csv`,'text/csv');};
  const externalText=generateBriefing(s,briefType);
  return <div className="page container">
    <PageHeader title="Reports and exports" lead="Take the current prototype scenario into a short policy brief or reproducible data export."/>
    <div className="report-primary-grid">
      <section className="panel featured-panel"><span className="eyebrow">Recommended for reviewers</span><h2>Executive policy brief</h2><p>A concise PDF with the scenario, core outcomes, caveats and methods note.</p><Button className="primary" onClick={()=>pdfReport('executive')}>Generate executive brief</Button></section>
      <section className="panel"><h2>Excel workbook</h2><p>Detailed scenario inputs and model outputs in separate worksheets for checking or further analysis.</p><Button onClick={excel}>Export Excel workbook</Button></section>
    </div>
    <Details summary="Other report and data formats"><div className="action-row"><Button onClick={()=>pdfReport('service')}>Service planning PDF</Button><Button onClick={()=>pdfReport('technical')}>Full technical PDF</Button><Button onClick={()=>pdfReport('methods')}>Methods PDF</Button><Button onClick={()=>downloadText(exportScenarioJson(s),`${base}.json`,'application/json')}>Scenario JSON</Button><Button onClick={csv}>Results CSV</Button></div></Details>
    <Details summary="Generate editable policy text"><p>Generated locally from the current scenario without an external language model.</p><textarea aria-label="Generated policy brief" rows={8} value={brief} onChange={e=>setBrief(e.target.value)}/><div className="action-row"><Button onClick={()=>setBrief(generateLocalPolicyBrief(s))}>Regenerate</Button><Button onClick={()=>navigator.clipboard.writeText(brief)}>Copy text</Button></div></Details>
    <Details summary="Optional external AI briefing"><p>No scenario information is transmitted automatically. The exact briefing is shown before an external service opens.</p><label className="field">Briefing type<select value={briefType} onChange={e=>setBriefType(e.target.value as BriefType)}><option value="ministerial">Ministerial/policy briefing</option><option value="commissioning">Service commissioning analysis</option><option value="economic">Health-economic interpretation</option><option value="research">Grant/research summary</option><option value="plain">Plain-language summary</option></select></label><div className="action-row">{(['ChatGPT','Gemini','Copilot'] as ExternalProvider[]).map(p=><Button key={p} onClick={()=>setExternal(p)}>Open in {p}</Button>)}</div></Details>
    {external&&<Modal title={`Review briefing before opening ${external}`} onClose={()=>setExternal(null)}><p><strong>No personal, patient or confidential data should be included.</strong> The text below has not been sent anywhere.</p><textarea aria-label="AI briefing text" rows={15} readOnly value={externalText}/><div className="action-row"><Button className="primary" onClick={async()=>{await copyAndOpen(externalText,external);setExternal(null);}}>Copy briefing and open</Button><Button onClick={()=>setExternal(null)}>Cancel</Button></div></Modal>}
  </div>;
}
