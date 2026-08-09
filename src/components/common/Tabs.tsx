import type { KeyboardEvent } from 'react';
export interface TabItem {id:string;label:string;}
export function Tabs({items,active,onChange}: {items:TabItem[];active:string;onChange:(id:string)=>void}){
  const move=(event:KeyboardEvent<HTMLButtonElement>,index:number)=>{
    let next=index;
    if(event.key==='ArrowRight')next=(index+1)%items.length;
    else if(event.key==='ArrowLeft')next=(index-1+items.length)%items.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=items.length-1;
    else return;
    event.preventDefault();
    onChange(items[next].id);
    const group=event.currentTarget.parentElement;
    requestAnimationFrame(()=>group?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus());
  };
  return <div className="tabs" role="tablist" aria-label="Results sections">{items.map((item,index)=><button key={item.id} role="tab" aria-selected={active===item.id} aria-controls={`panel-${item.id}`} id={`tab-${item.id}`} tabIndex={active===item.id?0:-1} onClick={()=>onChange(item.id)} onKeyDown={e=>move(e,index)}>{item.label}</button>)}</div>;
}
