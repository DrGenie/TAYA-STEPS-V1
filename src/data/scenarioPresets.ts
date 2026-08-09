import type { Scenario } from '../types/scenario';

const now='2026-08-08T00:00:00.000Z';
const common: Omit<Scenario,'id'|'name'|'setting'|'waitWeeks'|'delivery'|'parentInvolvement'|'professionalSupport'|'followUp'|'familyCost'> = {
  familyMode:'balanced',subgroups:[],heterogeneityEnabled:true,segmentsEnabled:false,
  population:10000,offerRate:0.50,completionRate:0.78,referralRate:0.25,referralCompletion:0.70,
  budgetHorizon:2,inflation:0.03,setupCost:0,maintenanceCost:0,annualHours:1155,
  economicEnabled:false,economicAcknowledged:false,improvementProbability:0.20,qalyGain:0.05,qalyValue:50000,avoidedCost:200,broaderBenefitPerCompleter:0,discountRate:0.03,
  monteCarloDraws:5000,simulationSeed:20260808,createdAt:now,modifiedAt:now,appVersion:'1.0.0',parameterSetVersion:'prototype-0.9.0',evidenceReviewDate:'2026-08-08'
};
export const scenarioPresets: Scenario[] = [
  {...common,id:'rapid-flexible',name:'Rapid flexible early support',setting:'youth-service',waitWeeks:1,delivery:'choice',parentInvolvement:'youth-choice',professionalSupport:'three',followUp:'both',familyCost:0},
  {...common,id:'school-linked',name:'School-linked early support',setting:'school',waitWeeks:3/7,delivery:'face-to-face',parentInvolvement:'first-contact',professionalSupport:'three',followUp:'one-week',familyCost:0},
  {...common,id:'online-stepped',name:'Supported online stepped care',setting:'online',waitWeeks:3/7,delivery:'online-checkins',parentInvolvement:'youth-choice',professionalSupport:'stepped',followUp:'both',familyCost:0},
  {...common,id:'gp-referral',name:'GP-led referral pathway',setting:'gp',waitWeeks:1,delivery:'face-to-face',parentInvolvement:'first-contact',professionalSupport:'stepped',followUp:'one-month',familyCost:30},
  {...common,id:'resource-constrained',name:'Resource-constrained pathway',setting:'gp',waitWeeks:6,delivery:'video',parentInvolvement:'progress-summaries',professionalSupport:'navigation',followUp:'requested',familyCost:60}
];
export const unattractiveScenario: Scenario = {...common,id:'unattractive',name:'Deliberately unattractive test scenario',setting:'school',waitWeeks:6,delivery:'online-checkins',parentInvolvement:'progress-summaries',professionalSupport:'navigation',followUp:'requested',familyCost:120};
