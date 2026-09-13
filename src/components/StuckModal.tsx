import { useState } from "react";
import { Brain, Check, ChevronRight, X } from "lucide-react";
import { Button, Card } from "./ui";
import { db } from "../lib/db";

type Props = {open:boolean; onClose:()=>void; onStartFocus:()=>void};

const reasons = [
  ["start","I can't start"],
  ["phone","I keep checking my phone"],
  ["sleepy","I'm sleepy"],
  ["anxious","I'm anxious / restless"],
  ["hard","The task feels too difficult"],
  ["unclear","I don't understand what to do"],
  ["bed","I just want to lie down"],
  ["unknown","I don't know what's wrong"]
];

const responses: Record<string,{title:string;body:string;actions:string[]}> = {
  start:{title:"Make the starting point smaller.",body:"You do not need to finish. Open the task and commit to only five minutes.",actions:["Open the task","Start 5 minutes"]},
  phone:{title:"Remove the easiest escape route.",body:"Put the phone out of reach for the next ten minutes. Capture anything you want to check instead of checking it.",actions:["Start 10 minutes","Capture a distraction"]},
  sleepy:{title:"Don't fight your state with guilt.",body:"Stand up, move for two minutes, drink normally if you're thirsty, then choose a minimum-size task.",actions:["2-minute reset","Start 5 minutes"]},
  anxious:{title:"Reduce the size of the threat.",body:"Take one slow minute. Then define one visible action instead of thinking about the whole syllabus.",actions:["60-second reset","Define one step"]},
  hard:{title:"Don't solve the question yet.",body:"Find only the first step: read it, mark what is known, or look at one worked example.",actions:["Find first step","Start 3 minutes"]},
  unclear:{title:"Turn ambiguity into one action.",body:"Write what you need to produce. If you cannot, choose a worked example or concept review.",actions:["Define one action","Start 5 minutes"]},
  bed:{title:"Change state before making a decision.",body:"Stand up and change rooms for two minutes. Then reassess whether a minimum session is possible.",actions:["Change environment","Start 5 minutes"]},
  unknown:{title:"You don't need to explain everything.",body:"Choose the smallest useful action: breathe, move, or open the next question.",actions:["60-second reset","Start 5 minutes"]}
};

export function StuckModal({open,onClose,onStartFocus}:Props){
  const [reason,setReason]=useState("");
  if(!open)return null;
  const response=reason?responses[reason]:null;
  const choose=(r:string)=>setReason(r);
  const finish=async(action:string)=>{
    await db.putIntervention({id:crypto.randomUUID(),date:new Date().toISOString().slice(0,10),intervention:action,context:reason,before:7,after:5,helpfulness:0});
    if(action.toLowerCase().includes("start")) onStartFocus();
    else onClose();
  };
  return <div className="modal-backdrop"><div className="stuck-modal">
    <button className="modal-close" onClick={onClose}><X size={18}/></button>
    <div className="modal-icon"><Brain size={22}/></div>
    <span className="eyebrow">20-second pause</span>
    {!response ? <>
      <h2>What's making it hard to start?</h2>
      <p className="muted">Pick the closest answer. You don't need to explain yourself.</p>
      <div className="reason-grid">{reasons.map(([id,label])=><button key={id} onClick={()=>choose(id)}>{label}<ChevronRight size={15}/></button>)}</div>
    </>:<>
      <h2>{response.title}</h2>
      <p className="modal-body">{response.body}</p>
      <div className="response-actions">{response.actions.map(a=><Button key={a} variant={a.includes("Start")?"primary":"soft"} onClick={()=>finish(a)}>{a}</Button>)}</div>
      <button className="back-choice" onClick={()=>setReason("")}>Choose another</button>
    </>}
    <div className="modal-foot"><Check size={14}/> One small action is enough for this moment.</div>
  </div></div>
}
