'use strict';
const achievementTracker=LMPAchievements.createTracker({
  getItem:key=>localStorage.getItem(key),
  setItem:(key,value)=>localStorage.setItem(key,value)
});
let achievementToastTimer=null;

function achievementMetrics(year=state?.year){
  const owned=[...(Array.isArray(state?.collection)?state.collection:[]),...(state?.car?[state.car]:[])];
  const brands=owned.map(item=>String(CARS.find(car=>car.id===item.id)?.marca||item.brand||'').trim().toLowerCase()).filter(Boolean);
  return {
    cash:Math.max(0,Number(state?.money)||0),
    ferrari:brands.includes('ferrari')?1:0,
    garage:owned.length,
    finalGarage:owned.length,
    acquired:(state?.history||[]).filter(item=>!item.reactivatedFromCollection).length,
    brands:new Set(brands).size,
    decisions:Math.max(0,Number(state?.decisions)||0),
    years:Math.max(0,(Number(year)||0)-(Number(state?.startYear)||0)),
    exhibitions:Math.max(0,Number(state?.exhibitionWins)||0),
    inheritances:Math.max(0,Number(state?.inheritanceCount)||0),
    finished:1
  };
}
function checkAchievements(final=false,year=state?.year){
  if(!state?.player)return;
  const unlocked=achievementTracker.observe(achievementMetrics(year),{player:state.player,year},final);
  renderAchievements();
  if(unlocked.length){
    const toast=document.querySelector('#achievementToast');
    const names=unlocked.slice(0,3).map(d=>d.name).join(' · ');
    const extra=unlocked.length>3?` y ${unlocked.length-3} más`:'';
    toast.textContent=`🏆 ${unlocked.length===1?'Logro desbloqueado':'Logros desbloqueados'}: ${names}${extra}.`;
    toast.hidden=false;
    clearTimeout(achievementToastTimer);
    achievementToastTimer=setTimeout(()=>{toast.hidden=true;},10000);
  }
}
function renderAchievements(){
  const records=achievementTracker.records();
  document.querySelector('#openAchievements').textContent=`🏆 Logros ${achievementTracker.count()}/${records.length}`;
  document.querySelector('#achievementsSummary').textContent=`${achievementTracker.count()} de ${records.length} logros desbloqueados`;
  document.querySelector('#achievementsWarning').hidden=!achievementTracker.storageFailed();
  // Sólo reconstruir las tarjetas cuando se abre el panel o cambia estando abierto.
  if(!document.querySelector('#achievementsDialog').open)return;
  const list=document.querySelector('#achievementsList');
  list.replaceChildren();
  for(const d of records){
    const card=document.createElement('article');
    card.className=`achievement-card${d.record?' unlocked':''}`;
    const category=document.createElement('div');
    category.className='achievement-category';category.textContent=d.category;
    const title=document.createElement('h3');title.textContent=d.name;
    const description=document.createElement('p');description.textContent=d.description;
    const status=document.createElement('div');status.className='achievement-status';
    status.textContent=d.record?'✓ Desbloqueado':'Pendiente';
    const progress=document.createElement('progress');
    progress.max=d.target;progress.value=d.record?d.target:d.progress;
    progress.setAttribute('aria-label',`Progreso de ${d.name}`);
    const detail=document.createElement('div');detail.className='achievement-detail';
    if(d.record){
      const date=new Date(d.record.at).toLocaleDateString('es-AR');
      detail.textContent=`${d.record.player} · ${date}${d.record.year!==null?` · año de juego ${d.record.year}`:''}`;
    }else{
      const format=n=>d.metric==='cash'?`USD ${n.toLocaleString('es-AR')}`:n.toLocaleString('es-AR');
      detail.textContent=`Mejor marca: ${format(d.progress)} / ${format(d.target)}${d.finalOnly?' · se evalúa al finalizar':''}`;
    }
    card.append(category,title,description,status,progress,detail);
    list.append(card);
  }
}
document.querySelector('#openAchievements').onclick=()=>{
  document.querySelector('#achievementsDialog').showModal();
  renderAchievements();
};
document.querySelector('#closeAchievements').onclick=()=>document.querySelector('#achievementsDialog').close();
document.querySelector('#achievementsDialog').addEventListener('click',event=>{
  if(event.target===event.currentTarget)event.currentTarget.close();
});
renderAchievements();
