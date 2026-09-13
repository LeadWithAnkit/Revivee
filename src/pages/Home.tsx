import { useState } from "react";
import { ArrowRight, Brain, CalendarCheck, Moon, Target, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppData } from "../hooks/useAppData";
import { todayISO } from "../lib/format";
import { ActionRow, Button, Card, Metric, SectionTitle } from "../components/ui";
import { ResetPanel } from "../components/ResetPanel";
import { StuckModal } from "../components/StuckModal";

export default function Home(){
  const navigate = useNavigate();
  const {observations,sessions}=useAppData();
  const today=todayISO();
  const latest=observations.find(o=>o.date===today)||observations[0];
  const [stuck,setStuck]=useState(false);
  const [done,setDone]=useState<string[]>([]);
  const actions=[
    {id:"movement",title:"10 minutes outside or gentle movement",body:"Change state without turning it into a productivity task."},
    {id:"task",title:"Complete one tiny focus task",body:"One question or one concept is enough."},
    {id:"observe",title:"Record one useful observation",body:"Lunch + post-meal sleepiness is a good low-friction option."}
  ];
  const studyToday=sessions.filter(s=>s.date===today).reduce((a,b)=>a+b.minutes,0);
  const focus=latest?.concentration??3;
  const energy=latest?.energy??4;
  const sleep=latest?.sleepHours??6.5;
  const mood=latest?.motivation??5;
  return <div className="page home-page">
    <section className="hero reveal">
      <div className="hero-copy">
        <span className="eyebrow">REVIVE · PERSONAL COGNITION</span>
        <h1>Understand your patterns.<br/><em>Reset without pressure.</em><br/>Move one step forward.</h1>
        <p>One quiet place to observe sleep, energy, attention and study behavior — then turn what you learn into smaller, kinder actions.</p>
        <div className="hero-actions"><Link className="btn btn-primary" to="/tracker">Check in today <ArrowRight size={16}/></Link><button className="btn btn-soft" onClick={()=>setStuck(true)}>I'm stuck</button></div>
      </div>
      <div className="hero-orbit"><div className="orbit-core"><Brain size={28}/><span>observe</span></div><span className="orbit-label one">sleep</span><span className="orbit-label two">attention</span><span className="orbit-label three">study</span><span className="orbit-label four">recovery</span></div>
    </section>

    <section className="today-grid reveal">
      <Card className="today-card">
        <div className="card-kicker"><span>Today</span><span>{today}</span></div>
        <h2>{latest ? "Let's make today slightly better than yesterday." : "Start with where you are."}</h2>
        <p className="muted">The dashboard is deliberately small. It should help you act, not give you another system to manage.</p>
        <div className="metrics-grid">
          <Metric label="Energy" value={`${energy}/10`} />
          <Metric label="Focus" value={`${focus}/10`} />
          <Metric label="Mood" value={`${mood}/10`} />
          <Metric label="Sleep" value={`${sleep}h`} />
        </div>
        <div className="divider"/>
        <div className="card-kicker"><span>Today's recovery</span><span className="quiet">3 small things</span></div>
        <div className="action-list">{actions.map(a=><ActionRow key={a.id} title={a.title} body={a.body} done={done.includes(a.id)} onClick={()=>setDone(d=>d.includes(a.id)?d.filter(x=>x!==a.id):[...d,a.id])}/>)}</div>
        <div className="next-session">
          <div><span className="eyebrow">Next best action</span><strong>Start a {focus<=4?"5":"10"}-minute focus session.</strong><small>You don't need to finish. Just start.</small></div>
          <Link to="/focus" className="session-button"><Target size={19}/><span>Start</span></Link>
        </div>
      </Card>
      <div className="side-stack">
        <Card className="quiet-card"><div className="mini-icon"><CalendarCheck size={18}/></div><span className="eyebrow">This week</span><strong>{studyToday} min today</strong><p>Build consistency before chasing volume.</p><Link to="/calendar">Open calendar <ArrowRight size={14}/></Link></Card>
        <Card className="quiet-card"><div className="mini-icon"><Zap size={18}/></div><span className="eyebrow">If your mind is noisy</span><strong>Make the next step smaller.</strong><p>Use the stuck flow instead of negotiating with yourself.</p><button onClick={()=>setStuck(true)}>Open I'm stuck <ArrowRight size={14}/></button></Card>
        <Card className="quiet-card"><div className="mini-icon"><Moon size={18}/></div><span className="eyebrow">Observation</span><strong>{latest ? `${latest.daytimeSleepiness}/10 daytime sleepiness` : "No sleep data yet"}</strong><p>Track patterns across several days before interpreting them.</p></Card>
      </div>
    </section>

    <section className="narrative reveal">
      <SectionTitle eyebrow="The REVIVE loop" title="Notice → understand → experiment → return." body="The app is intentionally not a checklist machine. It turns observations into one or two practical next actions."/>
      <div className="loop-grid">{[
        ["01","Notice","A small daily check-in."],["02","Understand","Evidence with uncertainty visible."],["03","Experiment","Try one low-friction change."],["04","Focus","Return to the task."],["05","Review","Look for patterns, not blame."]
      ].map(([n,t,b])=><div className="loop-step" key={n}><span>{n}</span><h3>{t}</h3><p>{b}</p></div>)}</div>
    </section>

    <section className="recovery-strip reveal"><ResetPanel compact/><Card className="stuck-card"><div><span className="eyebrow">When everything feels like too much</span><h2>Don't solve the whole day.</h2><p>Choose one reason, get one intervention, and return to a tiny action.</p></div><Button onClick={()=>setStuck(true)}>I'm stuck <ArrowRight size={16}/></Button></Card></section>

    <section className="home-bottom reveal"><SectionTitle eyebrow="Built from your research" title="A calmer way to see the whole picture."/><div className="three-columns"><Link to="/mind-map"><span>01</span><h3>Interaction map</h3><p>Sleep, physical state, hydration, digestion, mood, attention, avoidance and stress — with relationship uncertainty visible.</p></Link><Link to="/insights"><span>02</span><h3>Personal patterns</h3><p>Use your own observations to notice recurring combinations without pretending they prove causation.</p></Link><Link to="/learn"><span>03</span><h3>Learn without overload</h3><p>Short explanations for attention, avoidance, sleep, emotional awareness and study re-entry.</p></Link></div></section>

    <StuckModal open={stuck} onClose={()=>setStuck(false)} onStartFocus={()=>{setStuck(false);navigate("/focus")}}/>
  </div>
}

