import type { Scenario, Subgroup } from '../types/scenario';
import { calculateUptake } from './uptake';
import { calculateReach } from './reach';
import { calculateCosts } from './costing';
export interface EquityRow {group:string;uptake:number;difference:number;reach:number;completion:number;costPerStarter:number;note:string;}
const groups:{label:string;subgroups:Subgroup[]}[]=[
  {label:'All adolescents',subgroups:[]},{label:'Metropolitan',subgroups:[]},{label:'Regional/rural',subgroups:['regional']},{label:'Lower economic resources',subgroups:['lower-resources']},{label:'Elevated anxiety symptoms',subgroups:['elevated-anxiety']},{label:'Previous mental-health service use',subgroups:['previous-service']}
];
export function calculateEquity(s:Scenario):{rows:EquityRow[];maxGap:number;ratio:number}{
  const base={...s,subgroups:[]}; const overall=calculateUptake(base).family;
  const rows=groups.map(g=>{const scenario={...s,subgroups:s.heterogeneityEnabled?g.subgroups:[]};const uptake=calculateUptake(scenario).family;const reach=calculateReach(scenario,uptake);const cost=calculateCosts(scenario,reach);return{group:g.label,uptake,difference:uptake-overall,reach:reach.starters,completion:reach.completed,costPerStarter:cost.costPerStarter,note:g.subgroups.length&&!s.heterogeneityEnabled?'Neutral prototype assumption: no differential preference parameter applied.':g.subgroups.length?'Prototype subgroup modifier applied.':'Neutral prototype assumption: no differential preference parameter applied.'};});
  const values=rows.map(r=>r.uptake); const max=Math.max(...values),min=Math.min(...values); return {rows,maxGap:Math.max(...rows.map(r=>Math.abs(r.difference))),ratio:min>0?max/min:Infinity};
}
