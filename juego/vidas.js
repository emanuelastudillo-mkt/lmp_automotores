(function(root){
  'use strict';
  const bounded=(n,min,max)=>Math.min(max,Math.max(min,Number.isFinite(n)?n:min));
  function normalize(s){
    if(!s)return null;
    if(!s.life||typeof s.life!=='object'||Array.isArray(s.life)){
      const childEvent=(s.events||[]).find(e=>e.eventId==='hijo_aprende');
      s.life={version:1,relationship:(s.divorceCount||0)>0?'divorciado':'pareja',focus:'inicio',fierrera:Math.min(100,(s.illegalRaceCount||0)*3),familiar:childEvent?4:0,libertad:0,tension:s.flags?.tension_pareja?45:10,children:childEvent?[{bornYear:Math.max(1940,childEvent.year-16)}]:[],seen:{},lastEventYear:null,divorceYear:null,friendOffers:false};
      for(const e of s.events||[])if(e.eventId&&e.eventId.startsWith('vida_'))s.life.seen[e.eventId]=e.year;
    }
    const l=s.life;
    for(const k of ['fierrera','familiar','libertad','tension'])l[k]=bounded(l[k],0,100);
    if(!['inicio','fierrera','familiar'].includes(l.focus))l.focus='inicio';
    if(!Array.isArray(l.children))l.children=[];
    if(!l.seen||typeof l.seen!=='object'||Array.isArray(l.seen))l.seen={};
    l.relationship=(s.divorceCount||0)>0?'divorciado':'pareja';
    if(l.relationship==='pareja'){
      const leader=l.familiar>l.fierrera?'familiar':'fierrera';
      if(l.focus==='inicio'&&Math.max(l.familiar,l.fierrera)>=3)l.focus=leader;
      else if(l.focus!==leader&&l[leader]>=l[l.focus]+3)l.focus=leader;
    }
    return l;
  }
  function branch(s){const l=normalize(s);return l.relationship==='divorciado'?'soltero':l.focus;}
  function eligible(e,s,cars=[]){
    const l=normalize(s),b=branch(s),m=e.lifeRoute;
    if(e.id==='pareja_odia_auto'&&l.relationship!=='pareja')return false;
    if(e.id==='hijo_aprende'&&!l.children.some(c=>s.year-c.bornYear>=16))return false;
    if(e.special==='divorce')return l.relationship==='pareja'&&(s.divorceCount||0)===0&&l.tension>=70;
    if(e.special==='inheritance_inlaw'&&l.relationship!=='pareja')return false;
    if(!m)return true;
    if(m.branches&&!m.branches.includes(b))return false;
    if(m.relationship&&m.relationship!==l.relationship)return false;
    if(m.once&&Object.prototype.hasOwnProperty.call(l.seen,e.id))return false;
    if(m.requires&&!m.requires.every(id=>Object.prototype.hasOwnProperty.call(l.seen,id)))return false;
    if(m.minYears&&s.year-s.startYear<m.minYears)return false;
    if(m.minTension&&l.tension<m.minTension)return false;
    if(m.maxTension!==undefined&&l.tension>m.maxTension)return false;
    if(m.friendOffers&&!l.friendOffers)return false;
    if(m.minFans&&(s.fans||0)<m.minFans)return false;
    if(m.children&&!l.children.length)return false;
    if(m.noChildren&&l.children.length)return false;
    if(m.maxChildren&&l.children.length>=m.maxChildren)return false;
    if(m.childMinAge&&!l.children.some(c=>s.year-c.bornYear>=m.childMinAge))return false;
    if(m.requiresCar&&!s.car)return false;
    if(m.sourceAlive==='father'&&s.careerFlags?.fatherInheritance)return false;
    if(m.sourceAlive==='inlaw'&&s.careerFlags?.inlawInheritance)return false;
    if(m.requiresOffer&&!candidates(e,s,cars).length)return false;
    if(!m.priority&&l.lastEventYear!==null&&s.year-l.lastEventYear<2)return false;
    if(l.seen[e.id]!==undefined&&s.year-l.seen[e.id]<(m.cooldown||5))return false;
    return true;
  }
  function effects(s,e,c){
    const l=normalize(s),effect={...(c.life||{})};
    if(e.id==='pareja_odia_auto')Object.assign(effect,c.setFlag==='tension_pareja'?{fierrera:3,tension:25}:{familiar:3,tension:-25});
    if(e.id==='tuning')Object.assign(effect,c.performance>0?{fierrera:3,tension:8}:{familiar:1,tension:-3});
    if(e.id==='club_propietarios'&&c.setFlag)effect.fierrera=3;
    if(e.id==='semaforo_desafio'&&c.label!=='Aceptar el desafío')Object.assign(effect,{familiar:2,tension:-4});
    for(const k of ['fierrera','familiar','libertad'])l[k]=bounded(l[k]+(effect[k]||0),0,100);
    if(l.relationship==='pareja')l.tension=bounded(l.tension+(effect.tension||0),0,100);
    if(effect.child&&l.children.length<2)l.children.push({bornYear:s.year});
    if(effect.friendOffers)l.friendOffers=true;
    normalize(s);
  }
  function raced(s){const l=normalize(s);l.fierrera=bounded(l.fierrera+4,0,100);if(l.relationship==='pareja')l.tension=bounded(l.tension+12,0,100);normalize(s);}
  function complete(s,e){const l=normalize(s);if(e.lifeRoute){l.seen[e.id]=s.year;l.lastEventYear=s.year;}}
  function divorce(s){
    const l=normalize(s);if((s.divorceCount||0)>0)return false;
    s.divorceCount=1;l.relationship='divorciado';l.divorceYear=s.year;l.libertad=bounded(l.libertad+3,0,100);return true;
  }
  function weight(e,s){
    const l=normalize(s),b=branch(s);
    if(e.lifeRoute)return 1;
    if(['semaforo_desafio','tuning','club_propietarios'].includes(e.id)||e.special==='collection_race')return b==='fierrera'?4:b==='familiar'?.4:2;
    if(e.id==='pareja_odia_auto')return b==='familiar'?2:1;
    if(e.id==='hijo_aprende')return b==='familiar'?3:1;
    if(e.special?.startsWith('inheritance_'))return b==='fierrera'||b==='familiar'?3:1;
    if(e.minFlames||e.minStars)return b==='fierrera'?2:1;
    return 1;
  }
  function pick(pool,s,random=Math.random){
    if(!pool.length)return null;
    const total=pool.reduce((sum,e)=>sum+weight(e,s),0);let roll=random()*total;
    for(const e of pool){roll-=weight(e,s);if(roll<0)return e;}return pool[pool.length-1];
  }
  function priority(pool,s,cars=[]){return pool.find(e=>e.lifeRoute?.priority&&eligible(e,s,cars));}
  function candidates(e,s,cars){
    const gift=e.special!=='life_friend_offer';
    const owned=new Set([s.car?.id,...(s.collection||[]).map(c=>c.id)]);
    return cars.filter(c=>{
      if(owned.has(c.id)||c.desde>s.year)return false;
      if(gift){return (c.hasta>=s.year||c.hasta>=2026)&&!c.tags.includes('deportivo')&&!['Coupé','Pickup','Utilitario'].includes(c.segmento)&&c.precioBaseUSD<=30000;}
      return (c.tags.includes('deportivo')||c.tags.includes('alta-gama')||c.segmento==='Coupé')&&c.desde<=s.year-2;
    });
  }
  function summary(s){
    const l=normalize(s),b=branch(s),names={inicio:'Prioridades por definir',fierrera:'Vida fierrera',familiar:'Vida familiar',soltero:'Vida de soltero'};
    const kids=l.children.length?` · ${l.children.length} ${l.children.length===1?'hijo':'hijos'}`:'';
    return `${names[b]} · ${l.relationship==='pareja'?'En pareja':'Divorciado'}${kids}${l.relationship==='pareja'?` · Tensión ${Math.round(l.tension)}/100`:''}`;
  }
  const api={normalize,branch,eligible,effects,raced,complete,divorce,weight,pick,priority,candidates,summary};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.LMPLife=api;
})(typeof globalThis!=='undefined'?globalThis:this);
