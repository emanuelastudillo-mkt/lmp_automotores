/* Presentación del paso actual. Consultar estas funciones no avanza la partida. */
function storyVehicle(event){
  const pending=state?.pendingEvent;
  let unit=null,label='Tu vehículo en uso',note='';
  if(event?.collectionOnly||['collection_fame','collection_race','collection_offer'].includes(event?.special)){
    unit=collectionItem(pending?.collectionUid);
    label='Auto de tu colección';
    note=event.special==='collection_race'?'Este es el auto que participa en la picada.':event.special==='collection_offer'?'La oferta de compra es por este auto.':'Este es el auto invitado al encuentro.';
  }else if(pending?.lifeOffer){
    unit=pending.lifeOffer;label=event?.special==='life_friend_offer'?'Auto que te ofrecen':'Regalo familiar';
  }else if(pending?.inheritedUnit){
    unit=pending.inheritedUnit;label='Vehículo de la herencia';
  }else if(!event||!isTrajectoryEvent(event)||event.special==='divorce'){
    unit=state?.car;
  }
  const car=unit&&carById(unit.id);
  return car?{id:car.id,uid:unit.uid||null,modelYear:unit.modelYear??car.desde,label,note}:null;
}
function storyVehicleMarkup(vehicle,result=false){
  const car=vehicle&&carById(vehicle.id);if(!car)return '';
  const year=Number.isInteger(vehicle.modelYear)?` · ${vehicle.modelYear}`:'';
  return `<div class="event-vehicle" data-vehicle-id="${escapeText(car.id)}"${vehicle.uid?` data-unit-uid="${escapeText(vehicle.uid)}"`:''}>
    <div class="event-vehicle-photo">${carImageMarkup(car)}</div>
    <div><span class="event-vehicle-label">${escapeText(result?'Vehículo involucrado':vehicle.label)}</span><strong>${escapeText(car.marca+' '+car.modelo+year)}</strong>${!result&&vehicle.note?`<small>${escapeText(vehicle.note)}</small>`:''}</div>
  </div>`;
}
function nextStoryYear(){
  let target=Math.min(state.nextEventYear,careerEndYear());
  const historical=nextHistoricalYearBetween(state.year,target);
  if(historical!==null)target=historical;
  if(state.year<2001&&target>2001&&!state.careerFlags?.corralito_ocurrido)target=2001;
  return target;
}
function storyNextStep(){
  if(trajectoryEventNow())return {label:`Continuar en ${state.year}`,note:'Hay otro acontecimiento de tu historia en este año.'};
  if(state.car?.operable===false)return {label:'Revisar mi auto',note:'El vehículo necesita reparación. También podés elegir otro desde su ficha.'};
  if(!state.car)return {label:'Continuar mi historia',note:'Seguí con los acontecimientos pendientes o elegí otro vehículo.'};
  const next=nextStoryYear(),years=next-state.year;
  if(years>0&&next>=careerEndYear())return {label:`Cerrar mi trayectoria en ${next}`,note:'Avanzás el último tramo y abrís el resumen de tu vida y tu colección.'};
  return years>0?{label:`Avanzar a ${next}`,note:`${years===1?'Pasará 1 año':`Pasarán ${years} años`}. Se sumarán los ingresos y gastos del período.`}:{label:`Continuar en ${state.year}`,note:'Ver el próximo acontecimiento de tu historia.'};
}
function renderStoryStep(kind,event){
  if(kind==='decision'&&state.pendingResult)return;
  const result=kind==='result',guide=$('#turnGuide'),card=$('#eventCard');
  guide.innerHTML=`<span class="turn-badge ${result?'resolved':''}">${result?'Decisión resuelta':kind==='repair'?'Tu auto necesita atención':kind==='market'?'Elegí tu próximo auto':'Tu decisión'}</span><span class="turn-meta">${state.year} · ${money(state.money)}</span><span class="turn-instruction">${result?'Leé el resultado y seguí cuando quieras.':kind==='repair'?'Elegí cómo volver a circular.':kind==='market'?'Buscá un vehículo en el mercado o esperá un año para ahorrar.':'Elegí una de las opciones para seguir.'}</span>`;
  const vehicle=result?state.pendingResult?.vehicle:storyVehicle(event);
  const title=card.querySelector('h2');
  if(title&&vehicle&&!card.querySelector('.event-vehicle'))title.insertAdjacentHTML('afterend',storyVehicleMarkup(vehicle,result));
  if(result){
    pendingYearAnimation=null;stopYearAnimation();
  }else{
    $('#yearAdvanceNotice').hidden=true;
  }
  if(typeof requestAnimationFrame==='function')requestAnimationFrame(()=>{
    if(!$('#gameScreen').classList.contains('active')||$('#marketModal').classList.contains('open'))return;
    const header=document.querySelector('.lmp-site-header'),nav=$('#careerNav');
    let offset=(header?.getBoundingClientRect().height||0)+14;
    if(nav&&getComputedStyle(nav).position==='sticky')offset+=nav.getBoundingClientRect().height+12;
    window.scrollTo({top:Math.max(0,guide.getBoundingClientRect().top+window.scrollY-offset),behavior:'instant'});
    if(title){title.tabIndex=-1;title.focus({preventScroll:true});}
  });
}
