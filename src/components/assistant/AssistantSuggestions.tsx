import { assistantSuggestions } from '../../assistant/intents';
export function AssistantSuggestions({onSelect}: {onSelect:(q:string)=>void}){return <div className="suggestions" aria-label="Suggested questions">{assistantSuggestions.map(q=><button key={q} onClick={()=>onSelect(q)}>{q}</button>)}</div>;}
