import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { useScenarioStore } from '../state/scenarioStore';
import { calculateUptake } from '../engine/uptake';
import { calculateReach } from '../engine/reach';
import { calculateCosts } from '../engine/costing';
import { calculateCapacity } from '../engine/capacity';
import { formatPercent, formatNumber } from '../utils/format';
import { formatCurrency } from '../utils/currency';
import { ReviewerTour } from '../components/common/ReviewerTour';

export function DashboardPage(){
  const s=useScenarioStore(x=>x.scenario);
  const u=calculateUptake(s),r=calculateReach(s,u.family),c=calculateCosts(s,r),cap=calculateCapacity(s,r);
  const [tour,setTour]=useState(false);
  return <div className="page container">
    <PageHeader title="TAYA-STEPS" lead="Explore how the design of early anxiety support may influence uptake, reach, service cost and workforce requirements."/>

    <div className="prototype-intro">
      <div>
        <span className="eyebrow">Current prototype scenario</span>
        <h2>{s.name}</h2>
        <p className="prose">Change the service configuration and the model recalculates the illustrative outcomes immediately.</p>
      </div>
      <div className="action-row compact-actions">
        <Link className="button primary" to="/scenario">Edit scenario</Link>
        <Link className="button" to="/results">View results</Link>
      </div>
    </div>

    <div className="core-metrics" aria-label="Current scenario summary">
      <Metric label="Family-compatible uptake" value={formatPercent(u.family)} detail={`Youth ${formatPercent(u.youth)} · Parent ${formatPercent(u.parent)}`}/>
      <Metric label="Expected starters" value={formatNumber(r.starters)} detail={`From ${formatNumber(r.offered)} offered support`}/>
      <Metric label="Annual service cost" value={formatCurrency(c.annualTotalCost)} detail={`${formatCurrency(c.costPerStarter)} per starter`}/>
      <Metric label="Workforce required" value={`${cap.fteRequired.toFixed(2)} FTE`} detail={cap.status}/>
    </div>

    <section className="scenario-at-a-glance">
      <div>
        <h2>Scenario at a glance</h2>
        <dl className="compact-definition-list">
          <div><dt>Setting</dt><dd>{labelSetting(s.setting)}</dd></div>
          <div><dt>Waiting time</dt><dd>{s.waitWeeks < 1 ? `${Math.round(s.waitWeeks*7)} days` : `${s.waitWeeks} week${s.waitWeeks===1?'':'s'}`}</dd></div>
          <div><dt>Delivery</dt><dd>{labelDelivery(s.delivery)}</dd></div>
          <div><dt>Professional support</dt><dd>{labelSupport(s.professionalSupport)}</dd></div>
          <div><dt>Family cost</dt><dd>{formatCurrency(s.familyCost)}</dd></div>
        </dl>
      </div>
      <div className="prototype-explainer">
        <h2>What this prototype is</h2>
        <p>It demonstrates how a planned national preference study could be translated into service-planning decisions. The current coefficients and selected implementation and economic inputs are illustrative.</p>
        <p className="small"><strong>Planned research:</strong> 3,000 respondents, including 1,500 adolescent-parent dyads, across seven choice attributes.</p>
        <button className="text-button" onClick={()=>setTour(true)}>Open the 3-minute reviewer tour</button>
      </div>
    </section>

    <div className="prototype-note"><strong>Prototype estimates are illustrative.</strong> They are not results from the TAYA study and must not be used for individual clinical decisions.</div>
    {tour&&<ReviewerTour onClose={()=>setTour(false)}/>} 
  </div>;
}

function Metric({label,value,detail}:{label:string;value:string;detail:string}){return <section className="core-metric"><span className="label">{label}</span><div className="value">{value}</div><span className="caption">{detail}</span></section>;}
function labelSetting(v:string){return ({school:'School wellbeing service',gp:'GP or youth health service','youth-service':'Youth mental health service',online:'Secure online anxiety service'} as Record<string,string>)[v]??v;}
function labelDelivery(v:string){return ({'face-to-face':'Face-to-face',video:'Video','online-checkins':'Online program with professional check-ins',choice:'Choice of face-to-face or video'} as Record<string,string>)[v]??v;}
function labelSupport(v:string){return ({navigation:'Assessment and navigation only',three:'Three brief professional contacts',six:'Six brief professional contacts',stepped:'Stepped support with review and referral'} as Record<string,string>)[v]??v;}
