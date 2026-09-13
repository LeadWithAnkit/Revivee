import type { ReactNode } from "react";
import { ArrowRight, Check, CircleHelp, Info, Sparkles } from "lucide-react";
import { evidenceMeta, type Evidence } from "../data/content";

export function Button({children, onClick, variant="primary", disabled=false, className="", style}: {children: ReactNode; onClick?:()=>void; variant?: "primary"|"soft"|"ghost"|"danger"; disabled?: boolean; className?: string; style?: React.CSSProperties; key?: string}) {
  return <button disabled={disabled} onClick={onClick} className={`btn btn-${variant} ${className}`} style={style}>{children}</button>;
}
export function Card({children, className="", style}: {children: ReactNode; className?: string; style?: React.CSSProperties}) {
  return <section className={`card ${className}`} style={style}>{children}</section>;
}
export function EvidenceBadge({level}: {level: Evidence}) {
  const m = evidenceMeta[level];
  return <span className={`evidence ${m.tone}`}>{m.label}</span>;
}
export function SectionTitle({eyebrow, title, body}: {eyebrow?: string; title: string; body?: string}) {
  return <div className="section-title">{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{body && <p>{body}</p>}</div>;
}
export function Metric({label, value, sub, tone=""}: {label:string; value:string|number; sub?:string; tone?:string}) {
  return <div className={`metric ${tone}`}><span>{label}</span><strong>{value}</strong>{sub && <small>{sub}</small>}</div>;
}
export function EmptyState({title, body, icon="info"}:{title:string;body:string;icon?:string}) {
  return <div className="empty-state">{icon==="help"?<CircleHelp size={22}/>:<Info size={22}/>}<div><strong>{title}</strong><p>{body}</p></div></div>;
}
export function ActionRow({title, body, done=false, onClick}:{title:string;body?:string;done?:boolean;onClick?:()=>void}) {
  return <button className={`action-row ${done?"done":""}`} onClick={onClick}><span className="action-check">{done?<Check size={15}/>:<Sparkles size={14}/>}</span><span><b>{title}</b>{body&&<small>{body}</small>}</span><ArrowRight size={16}/></button>;
}
