export const unitCosts = {
  school:{label:'School wellbeing professional',central:110,low:85,high:145,grade:'D'},
  gp:{label:'GP/youth-health clinician',central:150,low:120,high:200,grade:'D'},
  generalPsych:{label:'General psychologist',central:150,low:120,high:215,grade:'C'},
  clinicalPsych:{label:'Clinical psychologist',central:190,low:150,high:260,grade:'C'},
  youthMental:{label:'Youth mental-health allied clinician',central:165,low:130,high:220,grade:'C'},
  navigator:{label:'Youth worker/navigator',central:85,low:65,high:110,grade:'D'},
  admin:{label:'Administrative support',central:55,low:45,high:75,grade:'D'}
} as const;
export const mbsReferences = [
  {item:'80010',label:'Clinical psychologist, 50+ minute individual in-person psychological therapy',scheduleFee:175.30,benefit:149.05,updated:'1 July 2026'},
  {item:'80110',label:'Eligible psychologist, 50+ minute individual in-person focussed psychological strategies',scheduleFee:119.45,benefit:101.55,updated:'1 July 2026'}
];
