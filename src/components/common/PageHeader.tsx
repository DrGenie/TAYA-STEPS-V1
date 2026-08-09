export function PageHeader({title,lead}: {title:string;lead?:string}){return <header className="page-header"><h1>{title}</h1>{lead&&<p className="prose">{lead}</p>}</header>;}
