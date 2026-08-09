export interface UtilityBreakdown {
  asc: number;
  setting: number;
  waitingTime: number;
  delivery: number;
  parentInvolvement: number;
  professionalSupport: number;
  followUp: number;
  cost: number;
  interactions: number;
  total: number;
}

export interface UptakeResult {
  youthUtility: UtilityBreakdown;
  parentUtility: UtilityBreakdown;
  youth: number;
  parent: number;
  family: number;
}

export interface ReachResult {
  target: number;
  offered: number;
  uptake: number;
  starters: number;
  completed: number;
  referred: number;
  referralCompleted: number;
}

export interface CostResult {
  annualVariableCost: number;
  annualFixedCost: number;
  annualTotalCost: number;
  costPerOffered: number;
  costPerStarter: number;
  costPerCompleter: number;
  byStaff: Record<string, number>;
  clinicianHours: number;
  adminHours: number;
}

export interface CapacityResult {
  requiredHours: number;
  availableHours: number;
  utilisation: number;
  fteRequired: number;
  fteAvailable: number;
  fteGap: number;
  maximumAnnualStarters: number;
  monthlyDemand: number;
  referralDemand: number;
  status: 'Available capacity' | 'Tight capacity' | 'Capacity exceeded';
}
