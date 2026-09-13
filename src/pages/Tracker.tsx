import { useEffect, useState } from "react";
import { Check, Save, Sparkles } from "lucide-react";
import { db, type Observation } from "../lib/db";
import { todayISO } from "../lib/format";
import { Button, Card, SectionTitle } from "../components/ui";
import { useAppData } from "../hooks/useAppData";
import { DataManagementCard } from "../components/DataManagementCard";

const initial: Observation = {
 date: todayISO(), sleepHours:6.5,sleepQuality:5,awakenings:1,daytimeSleepiness:6,walkKm:0,pushups:0,sunlightMinutes:0,mobilityMinutes:0,cardioMinutes:0,fluidLitres:2.5,thirst:5,urineFrequency:4,urineColour:2,unusualUrineSmell:false,
 mealSize:"normal",postMealHeaviness:4,postMealSleepiness:5,appetite:"normal",energy:4,headache:false,muscleAches:false,dryMouth:false,eyeFatigue:false,somaticFatigue:false,tasteChanges:false,toothSensation:false,digestion:"",
 motivation:4,concentration:3,enjoyment:4,emotionalEngagement:4,studyStress:6,escapeUrge:7,phoneUrges:5,focusedMinutes:0,focusBlocks:0,subjects:"",distractions:"",helped:"",notes:""
};

export default function Tracker(){
 const {observations,refresh}=useAppData();
 const [form,setForm]=useState<Observation>(initial);
 const [saved,setSaved]=useState(false);
 useEffect(()=>{const o=observations.find(x=>x.date===todayISO());if(o)setForm(o)},[observations]);
 const set=<K extends keyof Observation>(key:K,value:Observation[K])=>setForm(f=>({...f,[key]:value}));
 const save=async()=>{
   await db.putObservation(form);
   await refresh();
   setSaved(true);
   setTimeout(()=>setSaved(false),2200);
 };
 return <div className="page">
   <SectionTitle eyebrow="Daily check-in" title="Observe, don't judge." body="The full tracker is here when you need it. You can save partially and return later."/>
   <div className="tracker-head">
     <div><span className="eyebrow">Today</span><strong>{form.date}</strong></div>
     <Button onClick={save} className={saved ? "btn-saved" : ""}>
       {saved ? <Check size={16} /> : <Save size={16} />}
       <span>{saved ? "Observation Saved!" : "Save observation"}</span>
     </Button>
   </div>
   <div className="tracker-grid">
    <TrackerSection title="Sleep">
      <Field label="Estimated sleep (hours)" value={form.sleepHours} onChange={v=>set("sleepHours",Number(v))} type="number" step="0.1"/>
      <Scale label="Sleep quality" value={form.sleepQuality} onChange={v=>set("sleepQuality",v)}/>
      <Field label="Awakenings" value={form.awakenings} onChange={v=>set("awakenings",Number(v))} type="number"/>
      <Scale label="Daytime sleepiness" value={form.daytimeSleepiness} onChange={v=>set("daytimeSleepiness",v)}/>
    </TrackerSection>
    <TrackerSection title="Activities & Movement">
      <Field label="Walk distance (km)" value={form.walkKm ?? 0} onChange={v=>set("walkKm",Number(v))} type="number" step="0.1"/>
      <Field label="Push-ups (count)" value={form.pushups ?? 0} onChange={v=>set("pushups",Number(v))} type="number"/>
      <Field label="Morning sunlight exposure (mins)" value={form.sunlightMinutes ?? 0} onChange={v=>set("sunlightMinutes",Number(v))} type="number"/>
      <Field label="Stretching & mobility (mins)" value={form.mobilityMinutes ?? 0} onChange={v=>set("mobilityMinutes",Number(v))} type="number"/>
      <Field label="Cardio / high-intensity exercise (mins)" value={form.cardioMinutes ?? 0} onChange={v=>set("cardioMinutes",Number(v))} type="number"/>
    </TrackerSection>
    <TrackerSection title="Hydration">
      <Field label="Approx. fluid intake (L)" value={form.fluidLitres} onChange={v=>set("fluidLitres",Number(v))} type="number" step="0.1"/>
      <Scale label="Thirst" value={form.thirst} onChange={v=>set("thirst",v)}/>
      <Field label="Urination frequency" value={form.urineFrequency} onChange={v=>set("urineFrequency",Number(v))} type="number"/>
      <Scale label="Urine colour (pale → dark)" value={form.urineColour} onChange={v=>set("urineColour",v)} max={5}/>
      <Toggle label="Unusual / strong urine smell" value={form.unusualUrineSmell} onChange={v=>set("unusualUrineSmell",v)}/>
    </TrackerSection>
    <TrackerSection title="Food & digestion">
      <Select label="Meal size" value={form.mealSize} onChange={v=>set("mealSize",v as "light" | "normal" | "large")} options={["light","normal","large"]}/>
      <Scale label="Post-meal heaviness" value={form.postMealHeaviness} onChange={v=>set("postMealHeaviness",v)}/>
      <Scale label="Post-meal sleepiness" value={form.postMealSleepiness} onChange={v=>set("postMealSleepiness",v)}/>
      <Select label="Appetite" value={form.appetite} onChange={v=>set("appetite",v as "low" | "normal" | "high")} options={["low","normal","high"]}/>
      <Textarea label="Digestion notes" value={form.digestion} onChange={v=>set("digestion",v)}/>
    </TrackerSection>
    <TrackerSection title="Physical">
      <Scale label="Energy" value={form.energy} onChange={v=>set("energy",v)}/>
      <Toggle label="Headache / cranial tension" value={form.headache} onChange={v=>set("headache",v)}/>
      <Toggle label="Neck & shoulder muscle tension" value={form.muscleAches} onChange={v=>set("muscleAches",v)}/>
      <Toggle label="Dry mouth (salivary stress sign)" value={form.dryMouth} onChange={v=>set("dryMouth",v)}/>
      <Toggle label="Eye fatigue / screen strain" value={form.eyeFatigue ?? form.tasteChanges ?? false} onChange={v=>{ set("eyeFatigue",v); set("tasteChanges",v); }}/>
      <Toggle label="Physical lethargy / somatic fatigue" value={form.somaticFatigue ?? form.toothSensation ?? false} onChange={v=>{ set("somaticFatigue",v); set("toothSensation",v); }}/>
    </TrackerSection>
    <TrackerSection title="Mind & attention">
      <Scale label="Motivation" value={form.motivation} onChange={v=>set("motivation",v)}/>
      <Scale label="Concentration" value={form.concentration} onChange={v=>set("concentration",v)}/>
      <Scale label="Enjoyment" value={form.enjoyment} onChange={v=>set("enjoyment",v)}/>
      <Scale label="Emotional engagement" value={form.emotionalEngagement} onChange={v=>set("emotionalEngagement",v)}/>
      <Scale label="Study stress" value={form.studyStress} onChange={v=>set("studyStress",v)}/>
      <Scale label="Escape / avoid urge" value={form.escapeUrge} onChange={v=>set("escapeUrge",v)}/>
      <Field label="Phone-check urges (count)" value={form.phoneUrges} onChange={v=>set("phoneUrges",Number(v))} type="number"/>
    </TrackerSection>
    <TrackerSection title="Study">
      <Field label="Focused minutes" value={form.focusedMinutes} onChange={v=>set("focusedMinutes",Number(v))} type="number"/>
      <Field label="Focus blocks" value={form.focusBlocks} onChange={v=>set("focusBlocks",Number(v))} type="number"/>
      <Field label="Subject(s)" value={form.subjects} onChange={v=>set("subjects",v)}/>
      <Textarea label="Main distractions" value={form.distractions} onChange={v=>set("distractions",v)}/>
      <Textarea label="What helped today?" value={form.helped} onChange={v=>set("helped",v)}/>
      <Textarea label="Notes" value={form.notes} onChange={v=>set("notes",v)}/>
    </TrackerSection>
   </div>
   <div className="tracker-note"><Sparkles size={16}/><span>This is for pattern-spotting and self-observation, not diagnosis.</span></div>
   <DataManagementCard />
 </div>
}

function TrackerSection({title,children}:{title:string;children:React.ReactNode}){return <Card className="tracker-section"><h3>{title}</h3><div className="field-list">{children}</div></Card>}
function Field({label,value,onChange,type="text",step}:{label:string;value:string | number;onChange:(v:string)=>void;type?:string;step?:string}){return <label className="field"><span>{label}</span><input type={type} step={step} value={value} onChange={e=>onChange(e.target.value)}/></label>}
function Textarea({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}){return <label className="field"><span>{label}</span><textarea value={value} onChange={e=>onChange(e.target.value)} rows={2}/></label>}
function Scale({label,value,onChange,max=10}:{label:string;value:number;onChange:(v:number)=>void;max?:number}){return <div className="scale-field"><div><span>{label}</span><b>{value}/{max}</b></div><input type="range" min="0" max={max} value={value} onChange={e=>onChange(Number(e.target.value))}/></div>}
function Toggle({label,value,onChange}:{label:string;value:boolean;onChange:(v:boolean)=>void}){return <button className={`toggle-row ${value?"on":""}`} onClick={()=>onChange(!value)}><span>{label}</span><span className="toggle">{value?"Yes":"No"}</span></button>}
function Select({label,value,onChange,options}:{label:string;value:string;onChange:(v:string)=>void;options:string[]}){return <label className="field"><span>{label}</span><select value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select></label>}
