import type { PropsWithChildren } from 'react';
export function Alert({children,kind='info'}:PropsWithChildren<{kind?:'info'|'warning'|'error'}>){return <div className={`alert ${kind==='info'?'':kind}`} role={kind==='error'?'alert':undefined}>{children}</div>;}
