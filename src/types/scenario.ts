import { z } from 'zod';

export const settingSchema = z.enum(['school','gp','youth-service','online']);
export const deliverySchema = z.enum(['face-to-face','video','online-checkins','choice']);
export const parentSchema = z.enum(['youth-choice','first-contact','progress-summaries','scheduled-contacts']);
export const supportSchema = z.enum(['navigation','three','six','stepped']);
export const followUpSchema = z.enum(['requested','one-week','one-month','both']);
export const familyModeSchema = z.enum(['youth','parent','balanced','youth-centred','parent-constrained']);
export const subgroupSchema = z.enum(['regional','lower-resources','higher-resources','elevated-anxiety','previous-service']);

export const scenarioSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(120),
  setting: settingSchema,
  waitWeeks: z.number().min(0).max(26),
  delivery: deliverySchema,
  parentInvolvement: parentSchema,
  professionalSupport: supportSchema,
  followUp: followUpSchema,
  familyCost: z.number().min(0).max(1000),
  familyMode: familyModeSchema,
  subgroups: z.array(subgroupSchema),
  heterogeneityEnabled: z.boolean(),
  segmentsEnabled: z.boolean(),
  population: z.number().int().min(1).max(100000000),
  offerRate: z.number().min(0).max(1),
  completionRate: z.number().min(0).max(1),
  referralRate: z.number().min(0).max(1),
  referralCompletion: z.number().min(0).max(1),
  budgetHorizon: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(5)]),
  inflation: z.number().min(-0.2).max(1),
  setupCost: z.number().min(0),
  maintenanceCost: z.number().min(0),
  annualHours: z.number().positive(),
  unitCostOverrides: z.record(z.string(), z.number().min(0)).optional(),
  capacityFteOverrides: z.record(z.string(), z.number().min(0)).optional(),
  resourceUseOverrides: z.object({assessment:z.number().min(0),admin:z.number().min(0),briefContact:z.number().min(0),followUp:z.number().min(0),review:z.number().min(0)}).optional(),
  economicEnabled: z.boolean(),
  economicAcknowledged: z.boolean(),
  improvementProbability: z.number().min(0).max(1),
  qalyGain: z.number().min(0).max(1),
  qalyValue: z.number().min(0),
  avoidedCost: z.number().min(0),
  broaderBenefitPerCompleter: z.number().min(0),
  discountRate: z.number().min(0).max(0.2),
  monteCarloDraws: z.number().int().min(100).max(20000),
  simulationSeed: z.number().int(),
  createdAt: z.string(),
  modifiedAt: z.string(),
  appVersion: z.string(),
  parameterSetVersion: z.string(),
  evidenceReviewDate: z.string(),
});

export type Scenario = z.infer<typeof scenarioSchema>;
export type Setting = z.infer<typeof settingSchema>;
export type Delivery = z.infer<typeof deliverySchema>;
export type ParentInvolvement = z.infer<typeof parentSchema>;
export type ProfessionalSupport = z.infer<typeof supportSchema>;
export type FollowUp = z.infer<typeof followUpSchema>;
export type FamilyMode = z.infer<typeof familyModeSchema>;
export type Subgroup = z.infer<typeof subgroupSchema>;
