export const clamp=(n:number,min:number,max:number)=>Math.min(max,Math.max(min,n));
export const round=(n:number,digits=2)=>Math.round(n*10**digits)/10**digits;
