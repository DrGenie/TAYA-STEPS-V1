import type { Scenario } from '../types/scenario';
import { calculateUptake } from './uptake';
import { calculateReach } from './reach';
import { calculateCosts } from './costing';
import { calculateEconomic } from './economic';

export interface DistributionSummary {mean:number;median:number;lower:number;upper:number;probabilityPositive?:number;probabilityAboveOne?:number;}
export interface SimulationResult {uptake:DistributionSummary;annualCost:DistributionSummary;netBenefit:DistributionSummary;bcr:DistributionSummary;draws:number;seed:number;}
export function mulberry32(seed:number){return ()=>{let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function normal(rng:()=>number,mean=0,sd=1){const u=Math.max(rng(),1e-12),v=rng();return mean+sd*Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function triangular(rng:()=>number,min:number,mode:number,max:number){const u=rng(),f=(mode-min)/(max-min);return u<f?min+Math.sqrt(u*(max-min)*(mode-min)):max-Math.sqrt((1-u)*(max-min)*(max-mode));}
function clamp(v:number,lo:number,hi:number){return Math.min(hi,Math.max(lo,v));}
function summary(values:number[],extra?:'positive'|'aboveOne'):DistributionSummary{const s=[...values].sort((a,b)=>a-b);const n=s.length;const q=(p:number)=>s[Math.min(n-1,Math.max(0,Math.floor((n-1)*p)))];const out:DistributionSummary={mean:values.reduce((a,b)=>a+b,0)/n,median:q(.5),lower:q(.025),upper:q(.975)};if(extra==='positive')out.probabilityPositive=values.filter(v=>v>0).length/n;if(extra==='aboveOne')out.probabilityAboveOne=values.filter(v=>v>1).length/n;return out;}
export function runSimulation(s:Scenario,draws=s.monteCarloDraws,seed=s.simulationSeed):SimulationResult{
  const rng=mulberry32(seed);const uptake:number[]=[],cost:number[]=[],net:number[]=[],bcr:number[]=[];
  for(let i=0;i<draws;i++){
    const ss={...s,completionRate:clamp(normal(rng,s.completionRate,0.06),0.2,0.99),referralRate:clamp(normal(rng,s.referralRate,0.05),0.01,0.9),improvementProbability:triangular(rng,0.05,s.improvementProbability,0.35),qalyGain:triangular(rng,0.015,s.qalyGain,0.08),qalyValue:triangular(rng,30000,s.qalyValue,75000),avoidedCost:triangular(rng,0,s.avoidedCost,600)};
    const u=calculateUptake(ss);const noisyU=clamp(u.family+normal(rng,0,0.025),0.001,0.999);const r=calculateReach(ss,noisyU);const c=calculateCosts(ss,r);const costMultiplier=triangular(rng,0.80,1,1.25);const cc={...c,annualVariableCost:c.annualVariableCost*costMultiplier,annualTotalCost:c.annualVariableCost*costMultiplier+c.annualFixedCost};const e=calculateEconomic(ss,r,cc);uptake.push(noisyU);cost.push(cc.annualTotalCost);net.push(e.netBenefit);bcr.push(e.bcr);
  }
  return{uptake:summary(uptake),annualCost:summary(cost),netBenefit:summary(net,'positive'),bcr:summary(bcr,'aboveOne'),draws,seed};
}
