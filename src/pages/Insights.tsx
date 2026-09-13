import { useMemo } from "react";
import { ArrowUpRight, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Card, Metric, SectionTitle } from "../components/ui";
import { useAppData } from "../hooks/useAppData";

function avg(a:number[]){return a.length?a.reduce((x,y)=>x+y,0)/a.length:0}
export default function Insights(){
 const {observations,sessions}=useAppData();
 const recent=observations.slice(0,7);
 const sleep=avg(recent.map(x=>x.sleepHours)), focus=avg(recent.map(x=>x.concentration)), energy=avg(recent.map(x=>x.energy)), stress=avg(recent.map(x=>x.studyStress));
 const maxStudy=Math.max(1,...recent.map(x=>x.focusedMinutes));
 const trend=(field:keyof typeof recent[number])=>{const a=recent.slice(0,Math.ceil(recent.length/2)).map(x=>Number(x[field]));const b=recent.slice(Math.ceil(recent.length/2)).map(x=>Number(x[field]));if(a.length<2||b.length<2)return "→";return avg(a)>avg(b)+.4?"↑":avg(a)<avg(b)-.4?"↓":"→"};
 return <div className="page">
   <SectionTitle eyebrow="Insights" title="Patterns, not verdicts." body="These views summarize your recorded observations. A relationship here is not proof of causation."/>
   <div className="insight-metrics"><Metric label="Avg sleep" value={`${sleep.toFixed(1)}h`} sub={`${trend("sleepHours")} recent trend`}/><Metric label="Avg focus" value={`${focus.toFixed(1)}/10`} sub={`${trend("concentration")} recent trend`}/><Metric label="Avg energy" value={`${energy.toFixed(1)}/10`} sub={`${trend("energy")} recent trend`}/><Metric label="Avg stress" value={`${stress.toFixed(1)}/10`} sub={`${trend("studyStress")} recent trend`}/></div>
   <div className="insight-grid">
     <Card><div className="chart-head"><div><span className="eyebrow">Sleep vs focus</span><h3>Recorded pairs</h3></div><span className="chart-note">not causal</span></div><div className="scatter">{recent.map((o,i)=><span key={o.date} title={`${o.date}: ${o.sleepHours}h / ${o.concentration}/10`} style={{left:`${Math.min(94,(o.sleepHours/9)*100)}%`,bottom:`${Math.max(6,o.concentration*8)}%`}}>{i+1}</span>)}</div><div className="axis"><span>5h</span><span>9h sleep</span></div></Card>
     <Card><div className="chart-head"><div><span className="eyebrow">Study minutes</span><h3>Recent sessions</h3></div><span className="chart-note">{sessions.length} logged</span></div><div className="bars">{recent.slice().reverse().map(o=><div key={o.date}><span style={{height:`${Math.max(4,o.focusedMinutes/maxStudy*100)}%`}}/><small>{o.date.slice(-2)}</small></div>)}</div></Card>
     <Card><div className="chart-head"><div><span className="eyebrow">Avoidance signals</span><h3>What tends to rise together?</h3></div></div><div className="signal-list">{[["Escape urge",avg(recent.map(x=>x.escapeUrge))],["Phone urges",avg(recent.map(x=>Math.min(10,x.phoneUrges)))],["Study stress",stress],["Concentration",focus]].map(([n,v]:any)=><div key={n}><span>{n}</span><div><i style={{width:`${v*10}%`}}/></div><b>{v.toFixed(1)}</b></div>)}</div></Card>
     <Card><div className="chart-head"><div><span className="eyebrow">Reading the data</span><h3>Keep the interpretation modest.</h3></div><ArrowUpRight size={18}/></div><p className="large-copy">If several days show high stress and high escape urge, that is a useful pattern to notice. It is not evidence that stress caused the escape urge — or that either variable has one underlying cause.</p><div className="interpretation"><span><TrendingUp size={15}/> Observe repeated combinations</span><span><Minus size={15}/> Avoid single-day conclusions</span><span><TrendingDown size={15}/> Compare before/after interventions</span></div></Card>
   </div>
 </div>
}
