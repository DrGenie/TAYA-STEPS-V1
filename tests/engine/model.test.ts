import { describe, expect, it } from 'vitest';
import { scenarioPresets, unattractiveScenario } from '../../src/data/scenarioPresets';
import { calculateUptake } from '../../src/engine/uptake';
import { calculateReach } from '../../src/engine/reach';
import { calculateCosts } from '../../src/engine/costing';
import { calculateCapacity } from '../../src/engine/capacity';
import { calculateBudgetImpact } from '../../src/engine/budgetImpact';
import { calculateEconomic } from '../../src/engine/economic';
import { calculateEquity } from '../../src/engine/equity';
import { runSimulation } from '../../src/engine/uncertainty';
import { optimise } from '../../src/engine/optimiser';
import { runIntegrityChecks } from '../../src/engine/validation';

describe('TAYA-STEPS modelling engines',()=>{
  const base=scenarioPresets[0];
  it('central preset falls in the specified prototype uptake ranges',()=>{const u=calculateUptake(base);expect(u.youth).toBeGreaterThanOrEqual(.75);expect(u.youth).toBeLessThanOrEqual(.81);expect(u.parent).toBeGreaterThanOrEqual(.73);expect(u.parent).toBeLessThanOrEqual(.82);expect(u.family).toBeGreaterThanOrEqual(.74);expect(u.family).toBeLessThanOrEqual(.81);});
  it('deliberately unattractive scenario has low uptake',()=>{const u=calculateUptake(unattractiveScenario);expect(u.youth).toBeLessThan(.40);expect(u.parent).toBeLessThan(.40);});
  it('higher cost and longer wait do not raise uptake',()=>{const u=calculateUptake(base);expect(calculateUptake({...base,familyCost:100}).family).toBeLessThanOrEqual(u.family);expect(calculateUptake({...base,waitWeeks:6}).family).toBeLessThanOrEqual(u.family);});
  it('zero cost contribution is zero',()=>{expect(calculateUptake({...base,familyCost:0}).youthUtility.cost).toBe(0);});
  it('population flow identities hold',()=>{const u=calculateUptake(base),r=calculateReach(base,u.family);expect(r.offered).toBeCloseTo(base.population*base.offerRate);expect(r.starters).toBeCloseTo(r.offered*u.family);expect(r.completed).toBeCloseTo(r.starters*base.completionRate);expect(r.referralCompleted).toBeCloseTo(r.referred*base.referralCompletion);});
  it('costing, budget and capacity reconcile',()=>{const u=calculateUptake(base),r=calculateReach(base,u.family),c=calculateCosts(base,r),cap=calculateCapacity(base,r),budget=calculateBudgetImpact(base,c);expect(c.annualTotalCost).toBeCloseTo(c.annualVariableCost+c.annualFixedCost);expect(budget[0].total).toBeCloseTo(c.annualVariableCost+base.setupCost+base.maintenanceCost);expect(cap.fteRequired).toBeCloseTo(cap.requiredHours/base.annualHours);});
  it('economic engine returns finite break-even values',()=>{const u=calculateUptake(base),r=calculateReach(base,u.family),c=calculateCosts(base,r),e=calculateEconomic(base,r,c);expect(Number.isFinite(e.netBenefit)).toBe(true);expect(e.breakEvenQalyGain).toBeGreaterThanOrEqual(0);});
  it('equity model applies specified groups without invalid probabilities',()=>{const e=calculateEquity(base);expect(e.rows).toHaveLength(6);expect(e.rows.every(r=>r.uptake>=0&&r.uptake<=1)).toBe(true);});
  it('Monte Carlo is reproducible for the same seed and differs by seed',()=>{const a=runSimulation(base,300,123),b=runSimulation(base,300,123),c=runSimulation(base,300,124);expect(a.netBenefit.mean).toBe(b.netBenefit.mean);expect(a.netBenefit.mean).not.toBe(c.netBenefit.mean);});
  it('optimiser respects tight constraints',()=>{const rows=optimise(base,{maxBudget:1800000,maxFte:10,maxWait:1,maxFamilyCost:30,minYouth:.65,minParent:.65,minFamily:.65,maxEquityGap:.2,requiredDeliveries:[],allowedSettings:['school','gp','youth-service','online']});expect(rows.length).toBeGreaterThan(0);expect(rows.every(r=>r.annualCost<=1800000&&r.fte<=10&&r.scenario.waitWeeks<=1&&r.scenario.familyCost<=30&&r.family>=.65)).toBe(true);});
  it('all integrity checks pass',()=>{expect(runIntegrityChecks(base).every(c=>c.passed)).toBe(true);});
});
