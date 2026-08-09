export const formatCurrency=(value:number,maximumFractionDigits=0)=>new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',maximumFractionDigits}).format(value);
