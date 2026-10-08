/* Eventos de trayectoria: sus decisiones y ofertas pertenecen a la persona. */
function queueLifeEvent(priorityOnly=false){
  const eligible=EVENTS.filter(e=>e.lifeRoute&&LMPLife.eligible(e,state,CARS));
  const priority=LMPLife.priority(eligible,state,CARS);
  if(!priority&&(priorityOnly||!eligible.length||Math.random()>=.32))return false;
  const e=priority||LMPLife.pick(eligible,state);
  state.pendingEvent={id:e.id,forcedApplied:false};persist();return true;
}
function ensureLifeOffer(event){
  if(state.pendingEvent.lifeOffer)return state.pendingEvent.lifeOffer;
  const pool=LMPLife.candidates(event,state,CARS);if(!pool.length)return null;
  const car=pool[rand(0,pool.length-1)],gift=event.special!=='life_friend_offer';
  const lastModelYear=Math.max(car.desde,Math.min(car.hasta,state.year-2));
  const modelYear=gift?state.year:rand(Math.max(car.desde,lastModelYear-10),lastModelYear);
  const condition=gift?100:rand(64,90),originality=gift?100:rand(65,95),performance=gift?50:rand(54,78);
  const value=gift?newCarPrice(car,state.year):Math.max(300,Math.round(marketPrice(car,state.year,modelYear)*(.65+condition/240)));
  state.pendingEvent.lifeOffer={id:car.id,modelYear,condition,originality,performance,value,price:gift?0:Math.round(value*.94),inspected:false,defectCost:gift?0:rand(80,400)};
  persist();return state.pendingEvent.lifeOffer;
}
function resolveLifeOffer(event,accept){
  if(state.pendingEvent?.id!==event.id)return;
  const offer=ensureLifeOffer(event);if(!offer)return completeEvent(event,'La propuesta quedó sin un vehículo disponible.','📜');
  const gift=event.special!=='life_friend_offer';
  if(accept&&state.money<offer.price)return;
  const car=carById(offer.id);
  if(!accept)return completeEvent(event,`Dejaste pasar la propuesta de ${car.marca} ${car.modelo} ${offer.modelYear}.`,'📜');
  state.money-=offer.price;
  const uid=unitUid(),source=event.special==='life_gift_father'?'father':event.special==='life_gift_inlaw'?'inlaw':'friend';
  const purchaseType=gift?'regalo 0 km':'compra a amigo';
  const unit={...offer,uid,id:car.id,brand:car.marca,model:car.modelo,flags:{},operable:true,purchaseType,collectedYear:state.year,purchaseYear:state.year,purchasePrice:offer.price,valueAtCollection:offer.value,collectionValue:offer.value,repairs:0,investedValue:0,valueDamage:0,expenseModifier:0,stars:inheritedStars(offer),flames:0,fans:0,fanStatusLevel:0,yearsStored:0,receivedFrom:source};
  delete unit.price;delete unit.inspected;delete unit.defectCost;
  state.collection.push(unit);
  state.history.push({unitUid:uid,id:car.id,brand:car.marca,model:car.modelo,modelYear:offer.modelYear,purchaseType,receivedFrom:source,boughtYear:state.year,boughtFor:offer.price,maxStars:unit.stars,maxFlames:0,collected:true,collectionUid:uid});
  state.pendingEvent.resolvedUnitUid=uid;
  LMPLife.effects(state,event,{life:gift?{familiar:3,tension:-6}:{fierrera:3,libertad:2}});
  completeEvent(event,`${gift?'Recibiste como regalo':'Compraste por '+money(offer.price)} un ${car.marca} ${car.modelo} ${offer.modelYear}${gift?' 0 km':''}. Quedó en tu garaje; podés usarlo desde la colección.`,'🗝️');
}
function renderLifeOffer(event){
  const offer=ensureLifeOffer(event);if(!offer)return completeEvent(event,'La propuesta quedó sin un vehículo disponible.','📜');
  const car=carById(offer.id),gift=event.special!=='life_friend_offer';
  $('#eventCard').innerHTML=`<div class="event-icon">🗝️</div><span class="eyebrow">${gift?'Regalo familiar':'Oportunidad de un amigo'}</span><h2>${event.title}</h2><p>${event.text}</p><div class="forced-banner"><strong>${gift?'Regalo 0 km':'Condiciones de la compra'}</strong><span>${gift?'Regalo sin costo de compra':`Precio ${money(offer.price)}${offer.inspected?` · inspección: arreglos estimados en ${money(offer.defectCost)}, ya descontados del precio`:''}`} · Estado ${offer.condition}/100 · Originalidad ${offer.originality}/100.</span></div><div class="choices">${specialButton('🗝️',gift?'Aceptar el regalo':'Comprar y guardar en mi garaje',gift?'Conservás también tu vehículo actual.':state.money>=offer.price?'La compra no reemplaza tu auto actual.':'No te alcanza.','life-offer-accept')}${!gift&&!offer.inspected?specialButton('🔧','Revisarlo con un mecánico','Costo USD 60; el resultado y la oferta quedan guardados.','life-offer-inspect'):''}${specialButton('📜','Dejar pasar la propuesta','Conservás tu dinero y seguís tu trayectoria.','life-offer-decline')}</div>`;
  $('#life-offer-accept').disabled=state.money<offer.price;
  $('#life-offer-accept').onclick=()=>resolveLifeOffer(event,true);
  $('#life-offer-decline').onclick=()=>resolveLifeOffer(event,false);
  const inspect=$('#life-offer-inspect');
  if(inspect){inspect.disabled=state.money<60;inspect.onclick=()=>{
    if(state.pendingEvent?.id!==event.id||offer.inspected||state.money<60)return;
    state.money-=60;offer.inspected=true;offer.price=Math.max(100,offer.price-offer.defectCost);
    persist();renderStats($('#gameStats'));renderPendingEvent();
  };}
}
