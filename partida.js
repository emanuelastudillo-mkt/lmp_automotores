let unitSequence=0;
function unitUid(){return typeof crypto!=='undefined'&&crypto.randomUUID?`unit-${crypto.randomUUID()}`:`unit-${Date.now().toString(36)}-${++unitSequence}-${Math.random().toString(36).slice(2,10)}`;}
function acquiredCount(){return (state?.history||[]).filter(h=>!h.reactivatedFromCollection).length;}
function unitHistory(uid){return (state.history||[]).find(h=>h.unitUid===uid&&!h.reactivatedFromCollection);}
function currentHistory(){return state?.car?unitHistory(state.car.uid):null;}
function ensureVehicleLinks(){
  const history=state.history||[];
  for(const item of state.collection||[]){
    if(!item.uid)item.uid=unitUid();
    let h=history.find(h=>h.id===item.id&&(h.collectionUid===item.uid||h.unitUid===item.uid));
    if(!h)h=[...history].reverse().find(h=>h.id===item.id&&!h.reactivatedFromCollection&&!h.unitUid&&h.collected&&!h.collectionSoldYear);
    if(h){h.unitUid=item.uid;h.collectionUid=item.uid;}
    item.flags=item.flags&&typeof item.flags==='object'?item.flags:{};
    if(item.operable===undefined)item.operable=true;
  }
  if(state.car){
    if(!state.car.uid){
      const candidate=[...history].reverse().find(h=>h.id===state.car.id&&!h.soldYear&&!h.collectionSoldYear&&(!h.unitUid||!(state.collection||[]).some(i=>i.uid===h.unitUid)));
      state.car.uid=candidate?.unitUid||candidate?.previousCollectionUid||unitUid();
      if(candidate){
        candidate.unitUid=state.car.uid;
        const original=history.find(h=>h.id===candidate.id&&h.collectionUid===candidate.previousCollectionUid);
        if(original)original.unitUid=state.car.uid;
      }
    }
    if(!currentHistory()){
      const h=[...history].reverse().find(h=>h.id===state.car.id&&!h.reactivatedFromCollection&&!h.unitUid&&!h.soldYear);
      if(h)h.unitUid=state.car.uid;
      else{
        const car=carById(state.car.id);
        history.push({unitUid:state.car.uid,id:state.car.id,brand:car?.marca||'',model:car?.modelo||'',boughtYear:state.car.purchaseYear??state.year,boughtFor:state.car.purchasePrice||0,maxStars:1,maxFlames:0,recovered:true});
      }
    }
    state.car.flags=state.car.flags&&typeof state.car.flags==='object'?state.car.flags:(state.flags||{});
    state.flags=state.car.flags;
    if(state.car.operable===undefined)state.car.operable=true;
    if(eventById(state.pendingEvent?.id)?.special==='engine'&&state.pendingEvent.forcedApplied)state.car.operable=false;
  }
  for(const h of history){
    if(h.unitUid)continue;
    if(h.reactivatedFromCollection){const original=history.find(x=>x.id===h.id&&x.collectionUid===h.previousCollectionUid);h.unitUid=original?.unitUid||h.previousCollectionUid||unitUid();}
    else h.unitUid=unitUid();
  }
}
function isTrajectoryEvent(event){return !!event?.historicalArgentina||event?.special==='corralito';}
function trajectoryEventNow(){
  if(state.year===2001&&!state.careerFlags?.corralito_ocurrido)return EVENTS.find(e=>e.special==='corralito');
  return historicalEventForCurrentYear();
}
function vehicleEventMatches(event,car=currentCar()){
  return !event.vehicleId||event.vehicleId===car?.id||event.vehicleId===car?.modeloBaseId;
}
function bindPendingUnit(){
  const event=eventById(state.pendingEvent?.id);
  if(event&&!event.collectionOnly&&!isTrajectoryEvent(event)&&state.car){
    if(state.pendingEvent.unitUid&&state.pendingEvent.unitUid!==state.car.uid){state.pendingEvent=null;return;}
    if(!vehicleEventMatches(event)){state.pendingEvent=null;return;}
    state.pendingEvent.unitUid=state.car.uid;
  }
}
function suspendVehicleEvent(){
  const event=eventById(state.pendingEvent?.id);
  if(state.car&&event&&!event.collectionOnly&&!isTrajectoryEvent(event)){
    state.car.pendingVehicleEvent={...state.pendingEvent,unitUid:state.car.uid};
    state.pendingEvent=null;
  }
}
function registerCrash(event){
  if(event?.special!=='crash'&&event?.id!=='seguro_choque_decision')return;
  if(state.pendingEvent?.crashCounted)return;
  state.crashCount=(state.crashCount||0)+1;
  if(state.pendingEvent)state.pendingEvent.crashCounted=true;
}
function creditIncome(amount){
  const value=Number(amount)||0;
  state.money+=value;
  if(value>0)state.totalIncome=(state.totalIncome||0)+value;
}
function escapeText(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function sanitizeImportedState(saved){
  const text=s=>escapeText(String(s??'').replace(/<[^>]*>/g,''));
  for(const e of saved.events||[])if(e.text!==undefined)e.text=text(e.text);
  if(saved.pendingResult){saved.pendingResult.text=text(saved.pendingResult.text);saved.pendingResult.title=text(saved.pendingResult.title);saved.pendingResult.icon='📜';}
  for(const item of [...(saved.collection||[]),...(saved.history||[])]){const car=carById(item.id);item.brand=car?.marca||text(item.brand);item.model=car?.modelo||text(item.model);}
  if(saved.pendingEvent){
    if(saved.pendingEvent.divorceVariant){
      saved.pendingEvent.divorceVariant.title=text(saved.pendingEvent.divorceVariant.title);
      saved.pendingEvent.divorceVariant.text=text(saved.pendingEvent.divorceVariant.text);
    }
    if(saved.pendingEvent.hailProfile){
      saved.pendingEvent.hailProfile.label=text(saved.pendingEvent.hailProfile.label);
    }
    if(saved.pendingEvent.crashReason)saved.pendingEvent.crashReason=text(saved.pendingEvent.crashReason);
    if(saved.pendingEvent.inheritedUnit){const car=carById(saved.pendingEvent.inheritedUnit.id);if(car){saved.pendingEvent.inheritedUnit.brand=car.marca;saved.pendingEvent.inheritedUnit.model=car.modelo;}else delete saved.pendingEvent.inheritedUnit;}
  }
  for(const item of [...(saved.newMarketStock||[]),...(saved.usedMarketStock||[])]){
    if(item.quality!==undefined)item.quality=text(item.quality);
  }
  return saved;
}
function renderBrokenVehicle(){
  renderStats($('#gameStats'));renderGarage();renderLog();
  const cost=repairCost(1850);
  $('#eventCard').className='event-card';
  $('#eventCard').innerHTML=`<div class="event-icon">🔩</div><span class="eyebrow">Fuera de servicio</span><h2>El motor necesita reconstrucción</h2><p>Este auto no puede circular ni generar ingresos por fans o exhibiciones. Podés reconstruirlo, guardarlo, venderlo o usar otro vehículo.</p><div class="choices"><button class="choice" id="repairBroken" ${state.money>=cost?'':'disabled'}><strong>Reconstruir motor · ${money(cost)}</strong><small>${state.money>=cost?'Recupera la posibilidad de circular.':'No te alcanza.'}</small></button></div>`;
  $('#repairBroken').onclick=()=>{
    if(!state.car||state.car.operable!==false||state.money<cost)return;
    state.money-=cost;state.car.repairs++;state.car.investedValue+=Math.round(cost*.76);
    state.car.condition=clamp(state.car.condition+22,0,100);state.car.performance=clamp(state.car.performance+20,0,100);
    state.car.originality=clamp(state.car.originality-2,0,100);state.car.operable=true;
    state.decisions++;state.pendingResult={year:state.year,title:'Motor reconstruido',text:`Reconstruiste el motor por ${money(cost)}. El auto volvió a circular.`,icon:'🔩'};
    state.events.unshift({year:state.year,text:state.pendingResult.text});state.nextEventYear=Math.min(careerEndYear(),state.year+nextGap());persist();renderGame();
  };
  persist();closeMarket();hydrateSvgIcons($('#eventCard'));
}
function showSaveWarning(message=gameStore.warning()){
  const el=document.querySelector('#saveWarning');if(!el)return;
  el.textContent=message||'';el.hidden=!message;
  const damaged=document.querySelector('#exportDamaged');if(damaged)damaged.hidden=!gameStore.damaged();
}
function downloadSave(raw,name='LMP-partida.json'){
  const blob=new Blob([raw],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportGame(){
  const raw=state?JSON.stringify(state,null,2):gameStore.damaged();
  if(raw)downloadSave(raw);else showSaveWarning('No hay una partida para exportar.');
}
