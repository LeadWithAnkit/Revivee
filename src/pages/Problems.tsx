import { Link } from "react-router-dom";
import { Brain, Droplets, Moon, ShieldAlert } from "lucide-react";
import { Card, SectionTitle } from "../components/ui";
import { problems } from "../data/content";
import { useAppData } from "../hooks/useAppData";
const icons:any={focus:Brain,sleep:Moon,water:Droplets,stress:ShieldAlert};
export default function Problems(){const {observations,interventions}=useAppData();return <div className="page"><SectionTitle eyebrow="Problem library" title="Name the pattern without turning it into an identity." body="These are practical categories for observation and experimentation."/><div className="problem-grid">{problems.map(p=>{const Icon=icons[p.icon]||Brain;const latest=observations[0];const val=p.id==="focus"?latest?.concentration:p.id==="sleep"?latest?.sleepQuality:p.id==="thirst"?latest?.thirst:latest?.studyStress;return <Link key={p.id} to={`/problems/${p.id}`} className="problem-card"><div className="problem-icon"><Icon size={19}/></div><span className="eyebrow">{p.title}</span><strong>{val===undefined?"—":`${val}/10`}</strong><p>{p.description}</p><small>{interventions.length} intervention records</small></Link>})}</div></div>}
