export const formatPercent=(value:number,digits=1)=>`${(value*100).toFixed(digits)}%`;
export const formatNumber=(value:number,digits=0)=>new Intl.NumberFormat('en-AU',{maximumFractionDigits:digits}).format(value);
export const slugify=(s:string)=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
