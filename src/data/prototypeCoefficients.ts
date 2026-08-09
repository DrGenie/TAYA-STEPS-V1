import type { Delivery, FollowUp, ParentInvolvement, ProfessionalSupport, Setting } from '../types/scenario';

export type Group = 'youth' | 'parent';
export interface Coef { mean: number; se: number; }
export interface CoefficientSet {
  version: string;
  name: string;
  youth: GroupCoefficients;
  parent: GroupCoefficients;
}
interface GroupCoefficients {
  asc: Coef;
  setting: Record<Setting, Coef>;
  waitPerWeek: Coef;
  delivery: Record<Delivery, Coef>;
  parentInvolvement: Record<ParentInvolvement, Coef>;
  professionalSupport: Record<ProfessionalSupport, Coef>;
  followUp: Record<FollowUp, Coef>;
  costPer10: Coef;
}
const c=(mean:number,se=0):Coef=>({mean,se});
export const prototypeCoefficients: CoefficientSet = {
  version:'prototype-0.9.0', name:'Literature-informed prototype parameters',
  youth:{
    asc:c(0.45,0.15),
    setting:{school:c(0.05,0.08),gp:c(0), 'youth-service':c(0.18,0.09),online:c(0.10,0.10)},
    waitPerWeek:c(-0.11,0.025),
    delivery:{'face-to-face':c(0.08,0.07),video:c(0.02,0.07),'online-checkins':c(-0.08,0.08),choice:c(0.20,0.08)},
    parentInvolvement:{'youth-choice':c(0.30,0.10),'first-contact':c(0.08,0.09),'progress-summaries':c(-0.08,0.10),'scheduled-contacts':c(-0.18,0.11)},
    professionalSupport:{navigation:c(0),three:c(0.12,0.07),six:c(0.18,0.08),stepped:c(0.28,0.09)},
    followUp:{requested:c(0),'one-week':c(0.08,0.06),'one-month':c(0.05,0.06),both:c(0.12,0.07)},
    costPer10:c(-0.055,0.012)
  },
  parent:{
    asc:c(0.60,0.15),
    setting:{school:c(0),gp:c(0.10,0.08),'youth-service':c(0.28,0.09),online:c(-0.08,0.10)},
    waitPerWeek:c(-0.13,0.025),
    delivery:{'face-to-face':c(0.15,0.07),video:c(0.03,0.07),'online-checkins':c(-0.12,0.08),choice:c(0.18,0.08)},
    parentInvolvement:{'youth-choice':c(-0.05,0.10),'first-contact':c(0.18,0.09),'progress-summaries':c(0.20,0.09),'scheduled-contacts':c(0.12,0.10)},
    professionalSupport:{navigation:c(0),three:c(0.15,0.07),six:c(0.25,0.08),stepped:c(0.38,0.09)},
    followUp:{requested:c(0),'one-week':c(0.10,0.06),'one-month':c(0.08,0.06),both:c(0.16,0.07)},
    costPer10:c(-0.065,0.013)
  }
};

let activeCoefficientSet: CoefficientSet = prototypeCoefficients;
export function getActiveCoefficients(): CoefficientSet { return activeCoefficientSet; }
export function setActiveCoefficients(next: CoefficientSet): void { activeCoefficientSet = next; }
