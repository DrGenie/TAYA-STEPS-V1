export function ScreenReaderStatus({message}: {message:string}){return <div className="sr-only" aria-live="polite" aria-atomic="true">{message}</div>;}
