import type { PropsWithChildren } from 'react';
export function Details({summary,children}:PropsWithChildren<{summary:string}>){return <details className="panel"><summary><strong>{summary}</strong></summary><div style={{marginTop:12}}>{children}</div></details>;}
