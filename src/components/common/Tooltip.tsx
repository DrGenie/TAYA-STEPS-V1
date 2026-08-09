import type { PropsWithChildren } from 'react';
export function Tooltip({label,children}:PropsWithChildren<{label:string}>){return <span title={label} aria-label={label}>{children}</span>;}
