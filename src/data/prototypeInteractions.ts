export const prototypeInteractions = {
  'elevated-anxiety': { youthAsc: 0.20, parentAsc: 0.15, grade: 'C' },
  'previous-service': { youthAsc: 0.10, parentAsc: 0.10, grade: 'C' },
  regional: { youthOnline: 0.10, parentOnline: 0.05, waitMultiplier: 1.10, grade: 'D' },
  'lower-resources': { costMultiplier: 1.35, grade: 'D' },
  'higher-resources': { costMultiplier: 0.75, grade: 'D' }
} as const;
