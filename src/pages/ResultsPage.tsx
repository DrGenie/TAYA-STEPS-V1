import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { Tabs } from '../components/common/Tabs';
import { Details } from '../components/common/Details';
import { useScenarioStore } from '../state/scenarioStore';
import { PreferencesResults } from './PreferencesResults';
import { ReachResults } from './ReachResults';
import { CostResults } from './CostResults';
import { CapacityResults } from './CapacityResults';
import { EquityResults } from './EquityResults';
import { EconomicResults } from './EconomicResults';
import type { SimulationResult } from '../engine/uncertainty';
import { Button } from '../components/common/Button';
import { UncertaintyDistribution } from '../components/charts/UncertaintyDistribution';
import { oneWaySensitivity } from '../engine/sensitivity';
import { TornadoChart } from '../components/charts/TornadoChart';
import { calculateUptake } from '../engine/uptake';
import { calculateReach } from '../engine/reach';
import { calculateCosts } from '../engine/costing';
import { calculateCapacity } from '../engine/capacity';
import { formatPercent, formatNumber } from '../utils/format';
import { formatCurrency } from '../utils/currency';

const items=[
  {id:'overview',label:'Overview'},
  {id:'uptake',label:'Uptake & reach'},
  {id:'resources',label:'Cost & capacity'},
  {id:'equity',label:'Equity'},
  {id:'advanced',label:'Advanced'}
];

export function ResultsPage(){
  const s=useScenarioStore(x=>x.scenario);
  const [params]=useSearchParams();
  const initial=params.get('tab')??'overview';
  const [active,setActive]=useState(items.some(x=>x.id===initial)?initial:'overview');
  const [sim,setSim]=useState<SimulationResult|null>(null),[running,setRunning]=useState(false);
  const sensitivity=useMemo(()=>oneWaySensitivity(s,'netBenefit'),[s]);
  const u=calculateUptake(s),r=calculateReach(s,u.family),c=calculateCosts(s,r),cap=calculateCapacity(s,r);
  const runWorker=()=>{setRunning(true);const worker=new Worker(new URL('../workers/monteCarlo.worker.ts',import.meta.url),{type:'module'});worker.onmessage=(event:MessageEvent<SimulationResult>)=>{setSim(event.data);setRunning(false);worker.terminate();};worker.onerror=()=>{setRunning(false);worker.terminate();};worker.postMessage({scenario:s,draws:Math.min(s.monteCarloDraws,20000),seed:s.simulationSeed});};
  return <div className="page container">
    <PageHeader title="Scenario results" lead={s.name}/>
    <div className="prototype-note compact-note"><strong>Illustrative prototype estimates.</strong> These are not TAYA study results.</div>
    <Tabs items={items} active={active} onChange={setActive}/>
    <div id={`panel-${active}`} role="tabpanel" aria-labelledby={`tab-${active}`} className="results-panel">
      {active==='overview'&&<section>
        <h2>Decision summary</h2>
        <div className="core-metrics">
          <ResultMetric label="Family-compatible uptake" value={formatPercent(u.family)} detail={`Youth ${formatPercent(u.youth)} · Parent ${formatPercent(u.parent)}`}/>
          <ResultMetric label="Expected starters" value={formatNumber(r.starters)} detail={`From ${formatNumber(r.offered)} offered support`}/>
          <ResultMetric label="Annual service cost" value={formatCurrency(c.annualTotalCost)} detail={`${formatCurrency(c.costPerStarter)} per starter`}/>
          <ResultMetric label="Workforce required" value={`${cap.fteRequired.toFixed(2)} FTE`} detail={cap.status}/>
        </div>
        <div className="interpretation-box"><h3>What this means</h3><p>Under the current assumptions, the pathway is modelled to attract about {formatPercent(u.family)} of those offered it. For the current planning cohort, this corresponds to approximately {formatNumber(r.starters)} starters and an annual service requirement of {cap.fteRequired.toFixed(2)} FTE.</p></div>
        <div className="action-row"><Link className="button primary" to="/scenario">Change scenario</Link><Link className="button" to="/compare">Compare saved scenarios</Link></div>
      </section>}
      {active==='uptake'&&<><PreferencesResults scenario={s}/><hr className="section-rule"/><ReachResults scenario={s}/></>}
      {active==='resources'&&<><CostResults scenario={s}/><hr className="section-rule"/><CapacityResults scenario={s}/></>}
      {active==='equity'&&<EquityResults scenario={s}/>} 
      {active==='advanced'&&<section>
        <h2>Advanced prototype analyses</h2>
        <p className="prose">These modules are useful for methodological review and sensitivity testing, but are not required to understand the core prototype.</p>
        <Details summary="Exploratory economic value"><EconomicResults scenario={s}/></Details>
        <Details summary="Uncertainty and sensitivity">
          <p>Run the deterministic seeded Monte Carlo simulation using the current draw count and seed.</p>
          <Button className="primary" disabled={running} onClick={runWorker}>{running?'Running simulation':'Run uncertainty analysis'}</Button>
          {sim&&<><UncertaintyDistribution label="Family-compatible uptake" summary={sim.uptake} formatter={v=>formatPercent(v)}/><UncertaintyDistribution label="Annual cost" summary={sim.annualCost} formatter={v=>formatCurrency(v)}/><UncertaintyDistribution label="Net benefit" summary={sim.netBenefit} formatter={v=>formatCurrency(v)}/><UncertaintyDistribution label="Benefit-cost ratio" summary={sim.bcr}/><p>Probability net benefit &gt; 0: {formatPercent(sim.netBenefit.probabilityPositive??0)}. Probability BCR &gt; 1: {formatPercent(sim.bcr.probabilityAboveOne??0)}.</p></>}
          <TornadoChart rows={sensitivity} title="Decision sensitivity for net benefit"/>
        </Details>
      </section>}
    </div>
  </div>;
}

function ResultMetric({label,value,detail}:{label:string;value:string;detail:string}){return <section className="core-metric"><span className="label">{label}</span><div className="value">{value}</div><span className="caption">{detail}</span></section>;}
