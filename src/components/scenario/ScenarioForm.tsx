import { useScenarioStore } from '../../state/scenarioStore';
import { Field, Fieldset } from '../common/Field';
import { ScenarioSelector } from './ScenarioSelector';
import { PopulationInputs } from './PopulationInputs';
import { CapacityInputs } from './CapacityInputs';
import { CostInputs } from './CostInputs';
import { EconomicInputs } from './EconomicInputs';
import { AdvancedInputs } from './AdvancedInputs';
import { Details } from '../common/Details';

const labels={
  setting:{school:'School wellbeing service',gp:'GP or youth health service','youth-service':'Youth mental health service',online:'Secure online anxiety service'},
  delivery:{'face-to-face':'Face-to-face',video:'Video','online-checkins':'Structured online program with professional check-ins',choice:'Choice of face-to-face or video'},
  parentInvolvement:{'youth-choice':'Young person chooses parent involvement, subject to safety/legal requirements','first-contact':'Parent joins first contact and receives agreed summary','progress-summaries':'Parent receives scheduled progress summaries','scheduled-contacts':'Parent participates in scheduled support contacts'},
  professionalSupport:{navigation:'Assessment and navigation only',three:'Three brief professional contacts',six:'Six brief professional contacts',stepped:'Stepped support with review and referral'},
  followUp:{requested:'Only if requested','one-week':'One-week check-in','one-month':'One-month check-in',both:'One-week and one-month check-ins'}
} as const;

export function ScenarioForm(){
  const s=useScenarioStore(x=>x.scenario),update=useScenarioStore(x=>x.updateScenario);
  const select=(field:keyof typeof labels)=><select value={String(s[field])} onChange={e=>update({[field]:e.target.value} as Partial<typeof s>)}>{Object.entries(labels[field]).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>;
  return <div>
    <section className="builder-section builder-start">
      <h2>1. Start from an example</h2>
      <p className="small muted">Choose a preset, then adjust only what matters for your scenario.</p>
      <ScenarioSelector/>
    </section>

    <section className="builder-section">
      <h2>2. Configure the support pathway</h2>
      <div className="grid cols-2">
        <Field label="Where would support begin?">{select('setting')}</Field>
        <Field label="How quickly could support start?" hint="Enter waiting time in weeks. For 3 days, use 0.4."><input type="number" min="0" max="26" step="0.1" value={s.waitWeeks} onChange={e=>update({waitWeeks:Number(e.target.value)})}/></Field>
        <Field label="How would support be delivered?">{select('delivery')}</Field>
        <Field label="How would parents or carers be involved?">{select('parentInvolvement')}</Field>
        <Field label="How much professional support could be offered?">{select('professionalSupport')}</Field>
        <Field label="What follow-up could be provided?">{select('followUp')}</Field>
        <Field label="What would the family pay?" hint="Out-of-pocket cost in AUD"><input type="number" min="0" step="5" value={s.familyCost} onChange={e=>update({familyCost:Number(e.target.value)})}/></Field>
      </div>
    </section>

    <section className="builder-section">
      <h2>3. Set the planning context</h2>
      <p className="small muted">These two inputs determine the size of the illustrative service-planning cohort.</p>
      <div className="grid cols-2">
        <Field label="Planning population" hint="Number of adolescents" evidenceId="planning-population"><input type="number" min="1" value={s.population} onChange={e=>update({population:Number(e.target.value)})}/></Field>
        <Field label="Percentage offered the pathway" evidenceId="offer-rate"><input type="number" min="0" max="100" step="1" value={s.offerRate*100} onChange={e=>update({offerRate:Number(e.target.value)/100})}/></Field>
      </div>
    </section>

    <Details summary="Advanced prototype options">
      <div className="grid cols-2">
        <Field label="Scenario name"><input value={s.name} onChange={e=>update({name:e.target.value})}/></Field>
        <Field label="Family decision rule"><select value={s.familyMode} onChange={e=>update({familyMode:e.target.value as typeof s.familyMode})}><option value="youth">Youth perspective</option><option value="parent">Parent perspective</option><option value="balanced">Balanced family</option><option value="youth-centred">Youth-centred family</option><option value="parent-constrained">Parent-constrained</option></select></Field>
      </div>
      <Fieldset legend="Illustrative subgroup modifiers" hint="Optional synthetic modifiers for demonstration. They are not TAYA subgroup estimates.">
        <label className="check-row"><input type="checkbox" checked={s.heterogeneityEnabled} onChange={e=>update({heterogeneityEnabled:e.target.checked})}/>Apply prototype subgroup modifiers</label>
        {s.heterogeneityEnabled&&<div className="check-grid">{(['regional','lower-resources','elevated-anxiety','previous-service'] as const).map(g=><label className="check-row" key={g}><input type="checkbox" checked={s.subgroups.includes(g)} onChange={e=>update({subgroups:e.target.checked?[...s.subgroups,g]:s.subgroups.filter(x=>x!==g)})}/>{g.replaceAll('-',' ')}</label>)}</div>}
      </Fieldset>
      <label className="check-row"><input type="checkbox" checked={s.segmentsEnabled} onChange={e=>update({segmentsEnabled:e.target.checked})}/>Show illustrative preference segments</label>
      {s.segmentsEnabled&&<p className="small"><strong>Synthetic segmentation:</strong> these are not TAYA latent classes.</p>}
    </Details>

    <Details summary="Expert assumptions">
      <p className="small muted">Use these controls only when testing implementation, costing, workforce or uncertainty assumptions.</p>
      <Details summary="Population, completion and referral"><PopulationInputs/></Details>
      <Details summary="Unit resource costs"><CostInputs/></Details>
      <Details summary="Workforce capacity"><CapacityInputs/></Details>
      <Details summary="Exploratory economic assumptions"><EconomicInputs/></Details>
      <Details summary="Resource use and uncertainty"><AdvancedInputs/></Details>
      <Details summary="Budget assumptions"><div className="grid cols-2"><Field label="Budget horizon"><select value={s.budgetHorizon} onChange={e=>update({budgetHorizon:Number(e.target.value) as 1|2|3|5})}>{[1,2,3,5].map(v=><option key={v} value={v}>{v} year{v>1?'s':''}</option>)}</select></Field><Field label="Annual nominal cost growth (%)"><input type="number" step="0.1" value={s.inflation*100} onChange={e=>update({inflation:Number(e.target.value)/100})}/></Field><Field label="Implementation/set-up cost (AUD)"><input type="number" min="0" value={s.setupCost} onChange={e=>update({setupCost:Number(e.target.value)})}/></Field><Field label="Fixed annual maintenance cost (AUD)"><input type="number" min="0" value={s.maintenanceCost} onChange={e=>update({maintenanceCost:Number(e.target.value)})}/></Field></div></Details>
    </Details>
  </div>;
}
