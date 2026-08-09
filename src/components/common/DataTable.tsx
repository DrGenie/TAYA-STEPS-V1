import type { ReactNode } from 'react';
export interface Column<T>{key:string;header:string;render:(row:T)=>ReactNode;}
export function DataTable<T>({caption,columns,rows}: {caption:string;columns:Column<T>[];rows:T[]}){return <div className="table-wrap" role="region" aria-label={caption} tabIndex={0}><table className="data-table"><caption className="sr-only">{caption}</caption><thead><tr>{columns.map(c=><th key={c.key} scope="col">{c.header}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{columns.map(c=><td key={c.key}>{c.render(row)}</td>)}</tr>)}</tbody></table></div>;}
