export function downloadBlob(blob:Blob,filename:string){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function downloadText(text:string,filename:string,type='text/plain;charset=utf-8'){downloadBlob(new Blob([text],{type}),filename);}
