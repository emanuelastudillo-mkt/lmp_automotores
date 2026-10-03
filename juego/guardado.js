(function(root){
  'use strict';
  function valid(s){
    if(!s || typeof s!=='object' || Array.isArray(s))return false;
    if(typeof s.player!=='string' || !Number.isInteger(s.year) || s.year<1960 || s.year>2031 || !Number.isInteger(s.startYear) || s.startYear<1960 || s.startYear>s.year || !Number.isFinite(s.money))return false;
    for(const k of ['history','events','collection','newMarketStock','usedMarketStock'])if(s[k]!==undefined && (!Array.isArray(s[k]) || s[k].some(v=>!v || typeof v!=='object' || Array.isArray(v))))return false;
    if(s.car!==null && s.car!==undefined && (typeof s.car!=='object' || typeof s.car.id!=='string'))return false;
    if(s.endYear!==undefined&&(!Number.isInteger(s.endYear)||s.endYear<s.startYear||s.endYear>2031))return false;
    for(const unit of [...(s.collection||[]),...(s.car?[s.car]:[])]){
      if(typeof unit.id!=='string')return false;
      if(unit.uid!==undefined&&(typeof unit.uid!=='string'||! /^[a-zA-Z0-9_-]{1,160}$/.test(unit.uid)))return false;
      for(const k of ['condition','originality','performance'])if(unit[k]!==undefined&&(!Number.isFinite(unit[k])||unit[k]<0||unit[k]>100))return false;
    }
    if(s.pendingEvent?.hailApplied){
      const p=s.pendingEvent.hailProfile;
      if(!p||!['leve','moderado','fuerte','destructivo'].includes(p.severity))return false;
      for(const k of ['condition','originality'])if(!Number.isFinite(p[k])||p[k]<0||p[k]>100)return false;
    }
    for(const item of [...(s.newMarketStock||[]),...(s.usedMarketStock||[])]){
      if(typeof item.id!=='string'||!['new','used'].includes(item.type)||typeof item.stockId!=='string'||! /^[a-zA-Z0-9_:-]{1,220}$/.test(item.stockId))return false;
      if(!Number.isFinite(item.price)||item.price<0||!Number.isInteger(item.modelYear))return false;
    }
    return true;
  }
  function create(storage,key){
    const backupKey=key+'_backup',invalidKey=key+'_invalid';
    let lastValid=null,damaged=null,warning='',blocked=false;
    function decode(raw){if(!raw)return null;const value=JSON.parse(raw);if(!valid(value))throw Error('Formato de partida inválido');return value;}
    function read(){
      let raw=null;
      try{
        raw=storage.getItem(key);
        const value=decode(raw);
        if(value){lastValid=raw;return value;}
        return null;
      }catch(error){
        damaged=raw;
        try{
          const backup=storage.getItem(backupKey),value=decode(backup);
          if(value){
            lastValid=backup;
            if(raw){try{storage.setItem(invalidKey,raw);}catch{blocked=true;}}
            warning='Se recuperó la última copia válida de tu partida.';
            return value;
          }
        }catch{}
        blocked=!!raw;
        warning=raw?'No se pudo leer la partida guardada. Podés descargarla e importar una copia válida antes de reiniciar.':'No se pudo acceder al guardado local. Exportá tu partida para conservarla.';
        return null;
      }
    }
    function save(value){
      if(blocked){warning='El registro dañado se conservó. Exportá la partida recuperada antes de cerrar; el guardado local no pudo actualizarse.';return false;}
      if(!valid(value)){warning='La partida contiene datos inválidos y no reemplazó el último guardado válido.';return false;}
      const raw=JSON.stringify(value);
      try{
        if(lastValid && lastValid!==raw){try{storage.setItem(backupKey,lastValid);}catch{}}
        storage.setItem(key,raw);lastValid=raw;
        if(!warning.startsWith('Se recuperó'))warning='';
        return true;
      }catch{warning='No se pudo guardar la partida en este navegador. Exportala para evitar perder el progreso al cerrar.';return false;}
    }
    function clear(){
      try{storage.removeItem(key);storage.removeItem(backupKey);lastValid=null;damaged=null;blocked=false;warning='';return true;}
      catch{warning='No se pudo reiniciar el guardado local. La partida se conservó.';return false;}
    }
    function importRaw(raw){const value=decode(raw);if(!value)throw Error('El archivo está vacío');if(damaged){try{storage.setItem(invalidKey,damaged);}catch{throw Error('No se pudo preservar el registro dañado. Descargalo antes de importar.');}}blocked=false;if(!save(value))throw Error(warning);warning='';return value;}
    return {read,save,clear,importRaw,warning:()=>warning,damaged:()=>damaged,backupKey};
  }
  const api={create,valid};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.LMPGameStorage=api;
})(typeof globalThis!=='undefined'?globalThis:this);
