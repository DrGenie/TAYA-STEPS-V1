import type { Scenario } from '../types/scenario';
import { calculateUptake } from '../engine/uptake';
import { calculateReach } from '../engine/reach';
import { calculateCosts } from '../engine/costing';
import { calculateCapacity } from '../engine/capacity';
import { calculateEquity } from '../engine/equity';
import { calculateEconomic } from '../engine/economic';
import { calculateBudgetImpact } from '../engine/budgetImpact';
import { oneWaySensitivity } from '../engine/sensitivity';
import { calculateEvidenceCoverage } from '../engine/evidenceCoverage';
import { evidenceRegistry } from '../data/evidenceRegistry';
export function getReportData(scenario:Scenario){const uptake=calculateUptake(scenario);const reach=calculateReach(scenario,uptake.family);const costs=calculateCosts(scenario,reach);const capacity=calculateCapacity(scenario,reach);return{scenario,uptake,reach,costs,capacity,equity:calculateEquity(scenario),economic:calculateEconomic(scenario,reach,costs),budget:calculateBudgetImpact(scenario,costs),sensitivity:oneWaySensitivity(scenario,'netBenefit'),evidenceCoverage:calculateEvidenceCoverage(evidenceRegistry)};}
