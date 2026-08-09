import { PageHeader } from '../components/common/PageHeader';
import { ScenarioForm } from '../components/scenario/ScenarioForm';
import { ScenarioSummary } from '../components/scenario/ScenarioSummary';
import { useScenarioStore } from '../state/scenarioStore';
import { useSavedScenariosStore } from '../state/savedScenariosStore';
import { Button } from '../components/common/Button';
import { Details } from '../components/common/Details';
import { downloadText } from '../utils/download';
import { exportScenarioJson, importScenarioJson } from '../reports/jsonExport';
import { scenarioToShareHash } from '../utils/share';

export function ScenarioBuilderPage(){
  const s=useScenarioStore(x=>x.scenario),save=useSavedScenariosStore(x=>x.save),set=useScenarioStore(x=>x.setScenario);
  const exportJson=()=>downloadText(exportScenarioJson(s),`TAYA-STEPS_${s.name.replace(/[^a-z0-9]+/gi,'-')}.json`,'application/json');
  const importFile=async(file:File)=>{try{set(importScenarioJson(await file.text()));}catch(e){alert(e instanceof Error?e.message:'Invalid scenario file');}};
  const share=async()=>{const url=new URL(window.location.href);url.searchParams.set('scenario',scenarioToShareHash(s));url.hash='#/scenario';await navigator.clipboard.writeText(url.toString());alert('Shareable scenario link copied to clipboard.');};
  return <div className="page container">
    <PageHeader title="Build a scenario" lead="Choose a support pathway and see the illustrative service-planning results update as you make changes."/>
    <div className="scenario-layout">
      <div>
        <ScenarioForm/>
        <div className="action-row builder-actions"><Button className="primary" onClick={()=>save({...s,id:crypto.randomUUID(),createdAt:new Date().toISOString()})}>Save for comparison</Button></div>
        <Details summary="Import, export and sharing">
          <div className="action-row"><Button onClick={exportJson}>Export scenario JSON</Button><Button onClick={share}>Copy share link</Button><label className="button">Import scenario JSON<input className="sr-only" type="file" accept="application/json" onChange={e=>e.target.files?.[0]&&importFile(e.target.files[0])}/></label></div>
        </Details>
      </div>
      <ScenarioSummary/>
    </div>
  </div>;
}
