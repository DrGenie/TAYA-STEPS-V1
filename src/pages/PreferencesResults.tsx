import type { Scenario } from '../types/scenario';
import { calculateUptake } from '../engine/uptake';
import { UptakeBarChart } from '../components/charts/UptakeBarChart';
import { UtilityPlot } from '../components/charts/UtilityPlot';
import { formatPercent } from '../utils/format';
import { Details } from '../components/common/Details';

export function PreferencesResults({scenario}: {scenario:Scenario}){
  const u=calculateUptake(scenario);
  const gap=Math.abs(u.youth-u.parent);
  return <section>
    <h2>Modelled uptake</h2>
    <p className="result-lead"><strong>{formatPercent(u.family)} family-compatible uptake</strong> under the selected prototype family decision rule.</p>
    <p>{gap<0.03?'Youth and parent estimates are similar in this configuration.':`Youth and parent estimates differ by ${formatPercent(gap)} in this configuration.`}</p>
    <UptakeBarChart youth={u.youth} parent={u.parent} family={u.family}/>
    <Details summary="Why uptake changes">
      <p className="small">The model combines the support setting, waiting time, delivery mode, parent involvement, professional support, follow-up and family cost. Positive and negative utility contributions determine the modelled probability of taking up support.</p>
      <UtilityPlot youth={u.youthUtility} parent={u.parentUtility}/>
    </Details>
  </section>;
}
