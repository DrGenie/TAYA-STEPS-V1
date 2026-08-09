import { PageHeader } from '../components/common/PageHeader';
import { Details } from '../components/common/Details';
import { useSavedScenariosStore } from '../state/savedScenariosStore';
import { useScenarioStore } from '../state/scenarioStore';
import { calculateUptake } from '../engine/uptake';
import { calculateReach } from '../engine/reach';
import { calculateCosts } from '../engine/costing';
import { calculateCapacity } from '../engine/capacity';
import { calculateEquity } from '../engine/equity';
import { Button } from '../components/common/Button';
import { DataTable } from '../components/common/DataTable';
import { formatCurrency } from '../utils/currency';
import { formatPercent, formatNumber } from '../utils/format';
import { downloadText } from '../utils/download';

type ComparisonRow={name:string;youth:number;parent:number;family:number;reach:number;cost:number;cps:number;fte:number;status:string;equity:number;diff:number;id:string};

export function ComparePage(){
  const saved=useSavedScenariosStore(x=>x.scenarios),baselineId=useSavedScenariosStore(x=>x.baselineId),save=useSavedScenariosStore(x=>x.save),remove=useSavedScenariosStore(x=>x.remove),duplicate=useSavedScenariosStore(x=>x.duplicate),setBaseline=useSavedScenariosStore(x=>x.setBaseline),rename=useSavedScenariosStore(x=>x.rename);
  const active=useScenarioStore(x=>x.scenario),selected=saved.slice(0,4);
  const data=selected.map(s=>{const u=calculateUptake(s),r=calculateReach(s,u.family),c=calculateCosts(s,r),cap=calculateCapacity(s,r),eq=calculateEquity(s);return{s,u,r,c,cap,eq};});
  const baseline=data.find(d=>d.s.id===baselineId)??data[0];
  const rows:ComparisonRow[]=data.map(d=>({name:d.s.name,youth:d.u.youth,parent:d.u.parent,family:d.u.family,reach:d.r.starters,cost:d.c.annualTotalCost,cps:d.c.costPerStarter,fte:d.cap.fteRequired,status:d.cap.status,equity:d.eq.maxGap,diff:baseline?d.u.family-baseline.u.family:0,id:d.s.id}));
  const csv=()=>downloadText(['Scenario,Family uptake,Reach,Annual cost,FTE,Equity gap',...rows.map(r=>`"${r.name.replaceAll('"','""')}",${r.family},${r.reach},${r.cost},${r.fte},${r.equity}`)].join('\n'),'TAYA-STEPS_comparison.csv','text/csv');
  return <div className="page container">
    <PageHeader title="Compare scenarios" lead="Compare the main planning trade-offs across up to four saved scenarios."/>
    <div className="action-row"><Button className="primary" onClick={()=>save({...active,id:crypto.randomUUID(),createdAt:new Date().toISOString()})}>Save current scenario</Button>{rows.length>0&&<Button onClick={csv}>Download CSV</Button>}</div>
    {rows.length===0?<div className="empty-state"><h2>No saved scenarios yet</h2><p>Save the current scenario, change the pathway, then save another scenario to compare the trade-offs.</p></div>:<>
      <DataTable<ComparisonRow> caption="Core scenario comparison" rows={rows} columns={[{key:'n',header:'Scenario',render:r=><><strong>{r.name}</strong>{r.id===baselineId&&<><br/><span className="badge a">Baseline</span></>}</>},{key:'f',header:'Family uptake',render:r=>formatPercent(r.family)},{key:'d',header:'Difference',render:r=>(r.diff>=0?'+':'')+formatPercent(r.diff)},{key:'r',header:'Starters',render:r=>formatNumber(r.reach)},{key:'c',header:'Annual cost',render:r=>formatCurrency(r.cost)},{key:'fte',header:'FTE',render:r=>r.fte.toFixed(2)},{key:'eq',header:'Equity gap',render:r=>formatPercent(r.equity)}]}/>
      <Details summary="Youth and parent uptake"><DataTable caption="Youth and parent uptake" rows={rows} columns={[{key:'n',header:'Scenario',render:r=>r.name},{key:'y',header:'Youth uptake',render:r=>formatPercent(r.youth)},{key:'p',header:'Parent uptake',render:r=>formatPercent(r.parent)},{key:'f',header:'Family-compatible uptake',render:r=>formatPercent(r.family)}]}/></Details>
      <Details summary="Service configurations"><DataTable caption="Service configurations" rows={selected} columns={[{key:'n',header:'Scenario',render:r=>r.name},{key:'s',header:'Setting',render:r=>r.setting},{key:'w',header:'Wait',render:r=>`${r.waitWeeks.toFixed(1)} weeks`},{key:'d',header:'Delivery',render:r=>r.delivery},{key:'ps',header:'Support',render:r=>r.professionalSupport},{key:'fc',header:'Family cost',render:r=>formatCurrency(r.familyCost)}]}/></Details>
      <Details summary="Manage saved scenarios"><div className="saved-scenario-list">{rows.map(r=><div key={r.id} className="saved-scenario-row"><strong>{r.name}</strong><div className="controls-inline"><Button onClick={()=>setBaseline(r.id)}>Set baseline</Button><Button onClick={()=>{const name=window.prompt('Rename scenario',r.name);if(name?.trim())rename(r.id,name.trim());}}>Rename</Button><Button onClick={()=>duplicate(r.id)}>Duplicate</Button><Button className="danger" onClick={()=>remove(r.id)}>Delete</Button></div></div>)}</div></Details>
    </>}
  </div>;
}
