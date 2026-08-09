import { useRef, type PropsWithChildren } from 'react';
import { Button } from './Button';
import { useFocusTrap } from '../accessibility/useFocusTrap';

export function Modal({title,onClose,children}:PropsWithChildren<{title:string;onClose:()=>void}>){
  const ref=useRef<HTMLDivElement>(null);
  useFocusTrap(ref,true,onClose);
  return <>
    <div className="modal-backdrop" aria-hidden="true" onClick={onClose}/>
    <div ref={ref} className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1}>
      <div className="controls-inline" style={{justifyContent:'space-between'}}><h2 id="modal-title" style={{marginTop:0}}>{title}</h2><Button aria-label="Close dialog" onClick={onClose}>Close</Button></div>
      {children}
    </div>
  </>;
}
