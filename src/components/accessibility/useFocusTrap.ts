import { useEffect, useRef, type RefObject } from 'react';

const focusableSelector='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function useFocusTrap(ref:RefObject<HTMLElement|null>,active:boolean,onEscape?:()=>void){
  const escapeRef=useRef(onEscape);
  escapeRef.current=onEscape;
  useEffect(()=>{
    if(!active)return;
    const previous=document.activeElement as HTMLElement|null;
    const root=ref.current;
    const first=root?.querySelector<HTMLElement>(focusableSelector);
    (first??root)?.focus();
    const onKey=(event:KeyboardEvent)=>{
      if(event.key==='Escape'&&escapeRef.current){event.preventDefault();escapeRef.current();return;}
      if(event.key!=='Tab'||!root)return;
      const items=Array.from(root.querySelectorAll<HTMLElement>(focusableSelector)).filter(el=>!el.hasAttribute('disabled')&&el.offsetParent!==null);
      if(items.length===0){event.preventDefault();root.focus();return;}
      const firstItem=items[0],lastItem=items[items.length-1];
      if(event.shiftKey&&document.activeElement===firstItem){event.preventDefault();lastItem.focus();}
      else if(!event.shiftKey&&document.activeElement===lastItem){event.preventDefault();firstItem.focus();}
    };
    document.addEventListener('keydown',onKey);
    return()=>{document.removeEventListener('keydown',onKey);previous?.focus();};
  },[active,ref]);
}
