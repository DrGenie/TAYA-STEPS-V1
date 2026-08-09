import { useMemo, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Details } from '../components/common/Details';
import { evidenceRegistry } from '../data/evidenceRegistry';
import { calculateEvidenceCoverage } from '../engine/evidenceCoverage';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { DataTable } from '../components/common/DataTable';
import { useScenarioStore } from '../state/scenarioStore';
import { runIntegrityChecks } from '../engine/validation';
import { useSettingsStore, parameterSetSchema } from '../state/settingsStore';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import type { EvidenceRecord } from '../types/evidence';
import type { IntegrityCheck } from '../engine/validation';
import { formatPercent } from '../utils/format';

export function EvidencePage(){
  const [domain,setDomain]=useState('all'),[grade,setGrade]=useState('all'),[use,setUse]=useState('all');
  const scenario=useScenarioStore(x=>x.scenario);
  const setParameter=useSettingsStore(x=>x.setParameterSet),restore=useSettingsStore(x=>x.restorePrototype),active=useSettingsStore(x=>x.parameterSet);
  const cov=calculateEvidenceCoverage(evidenceRegistry),checks=runIntegrityChecks(scenario);
  const rows=useMemo(()=>evidenceRegistry.filter(r=>(domain==='all'||r.domain===domain)&&(grade==='all'||r.sourceGrade===grade)&&(use==='all'||String(r.usedInModel)===use)),[domain,grade,use]);
  const importFile=async(file:File)=>{try{const parsed=parameterSetSchema.safeParse(JSON.parse(await file.text()));if(!parsed.success)throw new Error(parsed.error.issues.map(i=>i.message).join('; '));setParameter(parsed.data);alert('Parameter set imported and stored locally.');}catch(e){alert(`Parameter import failed: ${e instanceof Error?e.message:'Invalid file'}`);}};
  return <div className="page container">
    <PageHeader title="Assumptions and evidence" lead="See which parts of the prototype use official evidence, published research, literature-informed translation or illustrative assumptions."/>

    <section className="evidence-summary">
      <h2>How to read the prototype</h2>
      <div className="evidence-grade-grid">
        <Grade grade="A" title="Official Australian source" text={`${cov.counts.A} active inputs`}/>
        <Grade grade="B" title="Direct peer-reviewed evidence" text={`${cov.counts.B} active inputs`}/>
        <Grade grade="C" title="Literature-informed translation" text={`${cov.counts.C} active inputs`}/>
        <Grade grade="D" title="Prototype assumption" text={`${cov.counts.D} active inputs`}/>
      </div>
      <p className="small">Of {cov.total} active model inputs, {formatPercent(cov.publishedOrOfficialShare)} are Grade A or B. Grade C and D values are not observed TAYA data.</p>
    </section>

    <Alert kind="warning"><strong>The current preference coefficients are synthetic.</strong> They preserve plausible directions and relative importance for demonstration, but they are not empirical estimates from the planned TAYA study.</Alert>

    <h2>Evidence register</h2>
    <Details summary="Filter the evidence register">
      <div className="grid cols-3 no-print"><label className="field">Domain<select value={domain} onChange={e=>setDomain(e.target.value)}><option value="all">All domains</option>{['preference','cost','implementation','economic','context','design'].map(x=><option key={x}>{x}</option>)}</select></label><label className="field">Evidence grade<select value={grade} onChange={e=>setGrade(e.target.value)}><option value="all">All grades</option>{['A','B','C','D'].map(x=><option key={x}>{x}</option>)}</select></label><label className="field">Model use<select value={use} onChange={e=>setUse(e.target.value)}><option value="all">Used and contextual</option><option value="true">Used in model</option><option value="false">Context only</option></select></label></div>
    </Details>
    <DataTable<EvidenceRecord> caption="Evidence register" rows={rows} columns={[{key:'l',header:'Input or source',render:r=><span id={r.id}><strong>{r.label}</strong><br/><span className="small muted">{r.rationale}</span></span>},{key:'g',header:'Grade',render:r=><EvidenceBadge grade={r.sourceGrade}/>},{key:'v',header:'Value',render:r=>`${r.value} ${r.unit}`},{key:'s',header:'Source',render:r=><a href={r.url} target="_blank" rel="noopener noreferrer">{r.sourceTitle}</a>}]}/>

    <Details summary="Technical model checks">
      <p className={checks.every(c=>c.passed)?'status-ok':'status-bad'}>Model integrity checks: {checks.every(c=>c.passed)?'Passed':'Attention required'}</p>
      <DataTable<IntegrityCheck> caption="Model integrity checks" rows={checks} columns={[{key:'n',header:'Check',render:r=>r.name},{key:'s',header:'Status',render:r=>r.passed?'Passed':'Failed'},{key:'d',header:'Detail',render:r=>r.detail}]}/>
    </Details>

    <Details summary="Advanced parameter management">
      <p><strong>Active parameter set:</strong> {active.name} ({active.version}). Imported files remain on this device.</p>
      <div className="action-row"><label className="button primary">Import parameter set<input className="sr-only" type="file" accept="application/json" onChange={e=>e.target.files?.[0]&&importFile(e.target.files[0])}/></label><Button onClick={restore}>Restore prototype parameters</Button><a className="button" href={`${import.meta.env.BASE_URL}example-parameter-set.json`} download>Download example JSON</a></div>
    </Details>
  </div>;
}

function Grade({grade,title,text}:{grade:'A'|'B'|'C'|'D';title:string;text:string}){return <div className="evidence-grade"><EvidenceBadge grade={grade}/><div><strong>{title}</strong><span>{text}</span></div></div>;}
