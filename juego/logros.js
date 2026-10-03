(function(root){
  'use strict';
  const KEY='lmp_car_life_achievements_v1';
  const definitions=[];
  function add(id,name,description,metric,target,category,finalOnly=false){
    definitions.push(Object.freeze({id,name,description,metric,target,category,finalOnly}));
  }
  [
    [20000,'Colchón de seguridad'],[50000,'Ahorrista sobre ruedas'],
    [100000,'Los primeros cien mil'],[150000,'Capital en marcha'],
    [200000,'Caja fuerte'],[300000,'Fortuna en ascenso'],
    [500000,'Medio millón de razones'],[1000000,'Club del millón']
  ].forEach(([n,name])=>add(`cash_${n}`,name,`Tener USD ${n.toLocaleString('es-AR')} de dinero disponible. No cuenta el valor de los autos.`,'cash',n,'Dinero'));
  add('ferrari','Sueño italiano','Ser dueño de una Ferrari, activa o guardada en la colección.','ferrari',1,'Garaje');
  add('garage_live_10','Garaje de colección','Tener 10 autos simultáneamente durante la trayectoria, contando el activo y los guardados.','garage',10,'Garaje');
  [
    [3,'Trío al cierre'],[5,'Quinteto de colección'],[10,'Diez llaves para el recuerdo'],
    [20,'Museo privado'],[30,'Imperio del garaje']
  ].forEach(([n,name])=>add(`garage_final_${n}`,name,`Finalizar una trayectoria conservando ${n} autos. Incluye el último auto activo.`,'finalGarage',n,'Colección final',true));
  [
    [1,'Mi primera llave'],[3,'Probador de caminos'],[5,'Cinco historias'],
    [10,'Buscador de novedades'],[20,'Veinte oportunidades']
  ].forEach(([n,name])=>add(`acquired_${n}`,name,`Adquirir ${n} ${n===1?'auto':'autos'} en una trayectoria, por compra o herencia. Reactivar un auto guardado no suma.`,'acquired',n,'Trayectoria'));
  [[3,'Sin casarse con una marca'],[5,'Pasaporte automotor']].forEach(([n,name])=>add(`brands_${n}`,name,`Tener autos de ${n} marcas diferentes al mismo tiempo.`,'brands',n,'Garaje'));
  [[25,'Al volante de mi destino'],[50,'Cincuenta decisiones'],[100,'Toda una vida de elecciones']].forEach(([n,name])=>add(`decisions_${n}`,name,`Tomar ${n} decisiones en una trayectoria.`,'decisions',n,'Trayectoria'));
  [[10,'Una década sobre ruedas'],[30,'Treinta años de ruta']].forEach(([n,name])=>add(`years_${n}`,name,`Recorrer ${n} años desde el inicio de una trayectoria.`,'years',n,'Trayectoria'));
  [[1,'Primera vitrina'],[3,'Estrella de las exhibiciones']].forEach(([n,name])=>add(`exhibitions_${n}`,name,`Ganar ${n} ${n===1?'premio':'premios'} de exhibición en una trayectoria.`,'exhibitions',n,'Momentos especiales'));
  add('inheritance','Una llave con historia','Recibir una herencia de vehículo, aunque decidas venderlo.','inheritances',1,'Momentos especiales');
  add('finish','Una vida sobre ruedas','Completar una trayectoria hasta su año final.','finished',1,'Trayectoria',true);
  Object.freeze(definitions);

  // Las marcas son máximos por trayectoria; nunca se suman entre partidas.
  // Los desbloqueos viven aparte del guardado de la partida y son permanentes.
  function createTracker(storage){
    let best={};
    let unlocked={};
    let storageError=false;
    let writable=true;
    try{
      const raw=storage.getItem(KEY);
      if(raw){
        const saved=JSON.parse(raw);
        if(!saved || saved.version!==1 || !saved.best || !saved.unlocked)throw new Error('Formato de logros no válido');
        for(const d of definitions){
          const value=saved.best[d.metric];
          if(Number.isFinite(value) && value>=0)best[d.metric]=value;
          const record=saved.unlocked[d.id];
          if(record && typeof record.at==='string' && Number.isFinite(Date.parse(record.at))){
            unlocked[d.id]={at:record.at,player:typeof record.player==='string'?record.player.slice(0,28):'Conductor',year:Number.isFinite(record.year)?record.year:null};
          }
        }
      }
    }catch(error){
      // Preservar el registro original si no se puede leer; no sobrescribirlo.
      storageError=true;
      writable=false;
    }
    function save(){
      if(!writable)return;
      try{
        storage.setItem(KEY,JSON.stringify({version:1,best,unlocked}));
        storageError=false;
      }catch(error){storageError=true;}
    }
    function observe(metrics,meta={},final=false){
      let changed=false;
      const newlyUnlocked=[];
      for(const d of definitions){
        if(d.finalOnly && !final)continue;
        const value=metrics[d.metric];
        if(!Number.isFinite(value) || value<0)continue;
        if(value>(best[d.metric]||0)){best[d.metric]=value;changed=true;}
        if(!unlocked[d.id] && value>=d.target){
          unlocked[d.id]={at:new Date().toISOString(),player:String(meta.player||'Conductor').slice(0,28),year:Number.isFinite(meta.year)?meta.year:null};
          newlyUnlocked.push(d);
          changed=true;
        }
      }
      // Reintentar si la cuota de almacenamiento falló anteriormente.
      if(changed || storageError)save();
      return newlyUnlocked;
    }
    return {
      observe,
      records:()=>definitions.map(d=>({...d,progress:Math.min(d.target,best[d.metric]||0),record:unlocked[d.id]?{...unlocked[d.id]}:null})),
      count:()=>Object.keys(unlocked).length,
      storageFailed:()=>storageError
    };
  }
  const api=Object.freeze({KEY,definitions,createTracker});
  if(typeof module==='object' && module.exports)module.exports=api;
  else root.LMPAchievements=api;
})(typeof globalThis!=='undefined'?globalThis:this);
