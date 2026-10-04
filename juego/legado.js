(function(root){
  'use strict';
  const KEY='lmp_car_life_legacies_v1';
  const clone=value=>JSON.parse(JSON.stringify(value));
  const plain=value=>String(value||'').replace(/<[^>]*>/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
  function units(s,cars){
    const owned=[...(s.collection||[]),...(s.car?[s.car]:[])];
    const rows=(s.history||[]).filter(h=>!h.reactivatedFromCollection).map((h,i)=>{
      const uid=h.unitUid||h.collectionUid||`legacy-${i}`;
      const item=owned.find(v=>v.uid===uid);
      const car=cars.find(c=>c.id===h.id);
      const soldYear=h.collectionSoldYear??h.soldYear;
      return {uid,id:h.id,brand:car?.marca||h.brand||'Vehículo',model:car?.modelo||h.model||'Sin identificar',
        modelYear:h.modelYear??item?.modelYear??null,boughtYear:h.boughtYear??null,
        endYear:soldYear??(s.phase==='finished'?(s.endYear||s.year):s.year),soldYear:soldYear??null,
        status:item?(s.car?.uid===uid?'En uso':'Conservado'):(soldYear!=null?'Vendido':'Registro histórico'),
        boughtFor:h.boughtFor??null,soldFor:h.collectionSoldFor??h.soldFor??null,
        value:item?(item.collectionValue??item.estimatedValue??h.boughtFor??0):null,
        stars:item?.stars??h.maxStars??1,flames:item?.flames??h.maxFlames??0,
        condition:item?.condition??null,originality:item?.originality??null,
        purchaseType:h.purchaseType||item?.purchaseType||'',reason:h.saleReason||'',owned:!!item};
    });
    // Guardados antiguos sin ficha de adquisición siguen visibles, sin inventar fechas.
    for(const v of owned){if(rows.some(r=>r.uid===v.uid))continue;const c=cars.find(c=>c.id===v.id);
      rows.push({uid:v.uid||`unlinked-${rows.length}`,id:v.id,brand:c?.marca||v.brand||'Vehículo',model:c?.modelo||v.model||'Sin identificar',modelYear:v.modelYear??null,boughtYear:v.purchaseYear??null,endYear:s.year,soldYear:null,status:s.car?.uid===v.uid?'En uso':'Conservado',boughtFor:v.purchasePrice??null,soldFor:null,value:v.collectionValue??v.purchasePrice??0,stars:v.stars||1,flames:v.flames||0,condition:v.condition??null,originality:v.originality??null,purchaseType:v.purchaseType||'',owned:true});}
    return rows;
  }
  function timeline(s,cars,events){
    const rows=units(s,cars),list=[];
    rows.forEach((r,i)=>{
      if(r.boughtYear!=null)list.push({year:r.boughtYear,order:i,type:'Vehículos',title:r.purchaseType==='herencia'?'Una llave heredada':'Una nueva llave',text:`${r.brand} ${r.model}${r.modelYear?' · '+r.modelYear:''}. ${r.boughtFor!=null?'Adquisición: USD '+Math.round(r.boughtFor).toLocaleString('es-AR')+'.':''}`,uid:r.uid});
      if(r.soldYear!=null)list.push({year:r.soldYear,order:1000+i,type:'Vehículos',title:'El cambio de manos',text:`${r.brand} ${r.model}. ${r.soldFor!=null?'Venta: USD '+Math.round(r.soldFor).toLocaleString('es-AR')+'.':''}`,uid:r.uid});
    });
    [...(s.events||[])].reverse().forEach((e,i)=>{if(['purchase','sale'].includes(e.kind)&&rows.some(r=>r.uid===e.unitUid))return;const def=events.find(d=>d.id===e.eventId);list.push({year:e.year,order:2000+i,type:def?.historicalArgentina?'Historia argentina':def?.exclusiveVehicleEvent?'Tu vehículo':['store','reactivate'].includes(e.kind)?'Vehículos':'Decisiones',title:def?.title||({store:'Una llave guardada',reactivate:'Volver al volante'}[e.kind])||'En el camino',text:plain(e.text),uid:rows.some(r=>r.uid===e.unitUid)?e.unitUid:null});});
    return list.sort((a,b)=>a.year-b.year||a.order-b.order);
  }
  function chapters(s,cars){
    const rows=units(s,cars),first=rows[0],kept=rows.filter(r=>r.owned),sales=rows.filter(r=>r.soldYear!=null),brands=new Set(rows.map(r=>r.brand));
    const out=[{title:'La primera llave',year:s.startYear,uid:first?.uid,text:first?`La trayectoria de ${s.player} comenzó en ${s.startYear}. El primer vehículo registrado fue ${first.brand} ${first.model}${first.modelYear?' de '+first.modelYear:''}${first.boughtYear!=null?', adquirido en '+first.boughtYear:''}.`:`La trayectoria de ${s.player} comenzó en ${s.startYear}. Todavía no hay vehículos adquiridos en el registro.`}];
    if(rows.length>1)out.push({title:'Los caminos elegidos',year:null,uid:rows[Math.floor(rows.length/2)].uid,text:`El registro reúne ${rows.length} ${rows.length===1?'vehículo':'vehículos'} de ${brands.size} ${brands.size===1?'marca':'marcas'}. ${sales.length} ${sales.length===1?'unidad pasó':'unidades pasaron'} a otras manos. Reactivar un auto de la colección conserva su misma ficha.`});
    const ferrari=rows.find(r=>r.brand.toLowerCase()==='ferrari');if(ferrari)out.push({title:'Una Ferrari en la historia',year:ferrari.boughtYear,uid:ferrari.uid,text:`La ${ferrari.brand} ${ferrari.model} se incorporó al recorrido${ferrari.boughtYear!=null?' en '+ferrari.boughtYear:''}. ${ferrari.owned?'Forma parte del garaje conservado.':'Su paso sigue presente en el álbum.'}`});
    if((s.exhibitionWins||0)>0)out.push({title:'Un lugar en la vitrina',year:null,uid:null,text:`Los vehículos de esta trayectoria consiguieron ${s.exhibitionWins} ${s.exhibitionWins===1?'premio':'premios'} de exhibición. Ingresos registrados por premios: USD ${Math.round(s.exhibitionIncome||0).toLocaleString('es-AR')}.`});
    const marks=[];if(s.crashCount)marks.push(`${s.crashCount} ${s.crashCount===1?'choque':'choques'}`);if(s.hailCount)marks.push(`${s.hailCount} ${s.hailCount===1?'granizada':'granizadas'}`);if(s.friendMechanicUses)marks.push(`${s.friendMechanicUses} trabajos con el mecánico amigo`);if(marks.length)out.push({title:'Las marcas de la ruta',year:null,uid:null,text:`En esta trayectoria quedaron registrados ${marks.join(', ')}. Los resultados de cada decisión pueden recorrerse en la cronología.`});
    if(s.divorceCount)out.push({title:'La vida fuera del garaje',year:null,uid:null,text:`Durante el recorrido atravesaste ${s.divorceCount} ${s.divorceCount===1?'divorcio':'divorcios'}. Sus decisiones económicas también forman parte de esta historia.`});
    if(s.phase==='finished')out.push({title:'Las cuentas del camino',year:s.year,uid:null,text:`Entradas de dinero registradas: USD ${Math.round(s.totalIncome||0).toLocaleString('es-AR')}. Gastos de uso, guarda y mantenimiento registrados: USD ${Math.round(s.totalRunningCosts||0).toLocaleString('es-AR')}. Estos totales históricos no son el dinero disponible al cierre.`});
    out.push({title:s.phase==='finished'?'Las llaves que quedan':'Una historia en marcha',year:s.year,uid:kept[0]?.uid,text:s.phase==='finished'?`El recorrido terminó en ${s.endYear||s.year}, después de ${Math.max(0,(s.endYear||s.year)-s.startYear)} años y ${s.decisions||0} decisiones. Quedaron ${kept.length} ${kept.length===1?'vehículo conservado':'vehículos conservados'} y USD ${Math.round(s.money).toLocaleString('es-AR')} de dinero disponible.`:`En ${s.year}, el garaje conserva ${kept.length} ${kept.length===1?'vehículo':'vehículos'}. Las próximas decisiones todavía pueden cambiar esta historia.`});
    return out;
  }
  function validEntry(e,validState){
    if(!e||typeof e.id!=='string'||! /^[a-zA-Z0-9_-]{1,160}$/.test(e.id)||!validState(e.state)||e.state.phase!=='finished'||!Array.isArray(e.achievements)||!e.achievements.every(v=>typeof v==='string'))return false;
    const s=e.state,uid=value=>value===undefined||typeof value==='string'&&/^[a-zA-Z0-9_-]{1,160}$/.test(value);
    const year=value=>value===undefined||Number.isInteger(value)&&value>=1886&&value<=2031;
    for(const h of s.history||[]){if(typeof h.id!=='string'||!uid(h.unitUid)||!uid(h.collectionUid))return false;for(const k of ['brand','model','purchaseType','saleReason'])if(h[k]!==undefined&&typeof h[k]!=='string')return false;for(const k of ['modelYear','boughtYear','soldYear','collectionSoldYear'])if(!year(h[k]))return false;for(const k of ['boughtFor','soldFor','collectionSoldFor'])if(h[k]!==undefined&&!Number.isFinite(h[k]))return false;}
    for(const event of s.events||[]){if(typeof event.text!=='string'||!year(event.year)||event.unitUid!==null&&!uid(event.unitUid))return false;}
    for(const v of [...(s.collection||[]),...(s.car?[s.car]:[])]){if(!year(v.modelYear))return false;for(const k of ['collectionValue','purchasePrice','estimatedValue'])if(v[k]!==undefined&&!Number.isFinite(v[k]))return false;}
    return true;
  }
  function create(storage,validState){
    function read(){const raw=storage.getItem(KEY);if(!raw)return [];const value=JSON.parse(raw);if(value?.format!=='LMP-legados-v1'||!Array.isArray(value.entries)||!value.entries.every(e=>validEntry(e,validState)))throw Error('El archivo local de trayectorias no se pudo leer. Se conservó sin reemplazarlo.');return value.entries;}
    function write(entry){if(!validEntry(entry,validState))throw Error('El recuerdo no contiene una trayectoria final válida.');const entries=read();const i=entries.findIndex(e=>e.id===entry.id);if(i<0)entries.push(clone(entry));else entries[i]=clone(entry);try{storage.setItem(KEY,JSON.stringify({format:'LMP-legados-v1',entries}));}catch{throw Error('No se pudo guardar el museo. Exportá el recuerdo antes de empezar otra trayectoria; tu partida se conservó.');}return entry;}
    function archive(s,ids){if(!s.careerId)throw Error('La trayectoria necesita un identificador antes de archivarse.');return write({id:s.careerId,at:new Date().toISOString(),state:clone(s),achievements:ids.slice()});}
    function importRaw(raw){if(raw.length>20000000)throw Error('El archivo de museo supera el tamaño permitido.');const entry=JSON.parse(raw);if(entry.format!=='LMP-recuerdo-v1')throw Error('Elegí un archivo de recuerdo LMP.');write(entry.entry);return clone(entry.entry);}
    return {read,archive,importRaw,exportRaw:e=>JSON.stringify({format:'LMP-recuerdo-v1',entry:clone(e)},null,2)};
  }
  const api={KEY,units,timeline,chapters,create};if(typeof module==='object'&&module.exports)module.exports=api;else root.LMPLegacy=api;
})(typeof globalThis!=='undefined'?globalThis:this);
