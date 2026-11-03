/* DEATH RUSH: INFERNAL ASCENSION — V1.1 CUMULATIVA
 * Vanilla HTML5 Canvas, no libraries or backend, mobile-first, offline-ready.
 * All progression lives locally in browser storage (localStorage).
 */
'use strict';
const $ = (id) => document.getElementById(id);
const canvas = $('battle'), ctx = canvas.getContext('2d', { alpha:false });
const TAU = Math.PI * 2;
const rand=(a,b)=>a+Math.random()*(b-a), clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const distance2=(a,b,c,d)=>(a-c)*(a-c)+(b-d)*(b-d);
const fmtTime=t=>`${Math.floor(t/60).toString().padStart(2,'0')}:${Math.floor(t%60).toString().padStart(2,'0')}`;
const STORAGE_KEY='deathrush.infernal.v1';
const SAVE_DEFAULT={souls:0,bestKills:0,bestTime:0,wins:0,runs:0,selectedClass:'carnage',upgrades:{damage:0,health:0,magnet:0},inventory:[],equipped:{weapon:null,armor:null,charm:null},sound:true,graphics:'auto'};
let save;
try { save={...SAVE_DEFAULT,...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')};save.upgrades={...SAVE_DEFAULT.upgrades,...save.upgrades};save.equipped={...SAVE_DEFAULT.equipped,...save.equipped};if(!Array.isArray(save.inventory))save.inventory=[]; } catch {save=structuredClone(SAVE_DEFAULT)}
const persist=()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(save))}catch(e){console.warn('Save local indisponível:',e)}};
const CLASSES={
 carnage:{name:'Carnificina',short:'CARNIFICINA',symbol:'⚔',color:'#ff786d',desc:'Lâminas orbitais, resistência e roubo de vida.',ability:'blade',health:135,speed:211,damage:21},
 necro:{name:'Necromancia',short:'NECROMANCIA',symbol:'☠',color:'#cc96fb',desc:'Espectros aliados e energia das almas.',ability:'spirit',health:112,speed:219,damage:19},
 inferno:{name:'Ascensão Infernal',short:'INFERNAL',symbol:'✴',color:'#ffbf78',desc:'Círculos de fogo e explosões flamejantes.',ability:'fire',health:118,speed:215,damage:22}
};
const SHOP={
 damage:{icon:'⚔',name:'Força Maldita',description:'Dano inicial +12% por nível.',max:8},
 health:{icon:'♥',name:'Sangue Ancestral',description:'Vida máxima +15 por nível.',max:8},
 magnet:{icon:'✧',name:'Ímã de Almas',description:'Alcance de coleta +18 por nível.',max:8}
};
const RELICS={
 bloodblade:{icon:'⚔',name:'Lâmina do Sacrifício',slot:'weapon',rarity:'RARA',stat:'damage',bonus:.14,description:'Dano de todas as armas +14%.'},
 emberstaff:{icon:'✹',name:'Cajado de Cinzas',slot:'weapon',rarity:'ÉPICA',stat:'rate',bonus:.18,description:'Ataques básicos 18% mais rápidos.'},
 boneplate:{icon:'♜',name:'Couraça de Ossos',slot:'armor',rarity:'COMUM',stat:'health',bonus:30,description:'Vida máxima inicial +30.'},
 hellplate:{icon:'◆',name:'Armadura do Flagelo',slot:'armor',rarity:'ÉPICA',stat:'regen',bonus:1.1,description:'Regeneração adicional por segundo.'},
 soulstone:{icon:'✧',name:'Pedra das Almas',slot:'charm',rarity:'RARA',stat:'magnet',bonus:55,description:'Coleta de XP +55 de alcance.'},
 voidheart:{icon:'☽',name:'Coração do Vazio',slot:'charm',rarity:'LENDÁRIA',stat:'critical',bonus:.13,description:'Chance crítica adicional +13%.'}
};
const slotName={weapon:'ARMA',armor:'ARMADURA',charm:'AMULETO'};
function equippedStat(stat){return Object.values(save.equipped).reduce((v,id)=>v+(RELICS[id]?.stat===stat?RELICS[id].bonus:0),0)}
const UPGRADES={
 guardian:{icon:'⬡',name:'Sentinelas Orbitais',desc:'1 drone protetor por nível (até 5). Sede de Sangue acelera a órbita e potencializa o dano.',max:5,tag:'ARMA'},
 storm:{icon:'ϟ',name:'Julgamento Trovejante',desc:'Raios automáticos atingem demônios aleatórios. Mais níveis = mais raios e menor recarga.',max:5,tag:'MAGIA'},
 blade:{icon:'⚔',name:'Dança das Lâminas',desc:'Adiciona lâminas ao redor de você. No nível V, vira Tempestade Carmesim.',max:5,tag:'ARMA'},
 fire:{icon:'✺',name:'Círculo Infernal',desc:'Explosão periódica que queima monstros ao redor. No nível V, incendeia a área.',max:5,tag:'MAGIA'},
 spirit:{icon:'☠',name:'Legião de Espectros',desc:'Espíritos invocados atacam inimigos automaticamente. No nível V, invoca um espectro superior.',max:5,tag:'INVOCAÇÃO'},
 damage:{icon:'◆',name:'Poder Sombrio',desc:'Aumenta todo o dano causado em 18%.',max:5,tag:'ATRIBUTO'},
 speed:{icon:'➤',name:'Passos Fantasmas',desc:'Velocidade de movimento +9%.',max:4,tag:'MOBILIDADE'},
 health:{icon:'♥',name:'Coração Profano',desc:'Vida máxima +22 e cura 22 pontos.',max:5,tag:'SOBREVIVÊNCIA'},
 magnet:{icon:'✧',name:'Colheita de Almas',desc:'Alcance de coleta de XP +45.',max:4,tag:'SUPORTE'},
 rate:{icon:'✦',name:'Sede de Sangue',desc:'Acelera tiros e sentinelas orbitais em 20% por nível.',max:5,tag:'ATAQUE'},
 regen:{icon:'❖',name:'Pacto de Regeneração',desc:'Recupera vida lentamente ao longo da partida.',max:4,tag:'SOBREVIVÊNCIA'},
 critical:{icon:'✸',name:'Golpe Fatal',desc:'Aumenta sua chance de dano crítico em 8%.',max:4,tag:'ATAQUE'}
};
const ENEMIES={
 imp:{hp:23,speed:92,damage:10,radius:13,xp:5,color:'#c95c58',soul:.17},
 hound:{hp:35,speed:117,damage:12,radius:15,xp:7,color:'#9e7187',soul:.24},
 cultist:{hp:58,speed:66,damage:15,radius:18,xp:10,color:'#8b65b1',soul:.42},
 brute:{hp:125,speed:54,damage:21,radius:26,xp:18,color:'#ac7359',soul:.8}
};
const WORLD=3800;
const keys=new Set();let vw=0,vh=0,dpr=1,lastFrame=0,frameAvg=16;
let game=null,screen='menu',toastTimer=0,phaseTimer=0,audioContext=null,joystickVector={x:0,y:0};
let decorations=[];
let touchPointer=null;
let seed=37791;
function seeded(){seed=(Math.imul(seed,1664525)+1013904223)|0;return (seed>>>0)/4294967296}
function generateDecor(){decorations=[];for(let i=0;i<410;i++){let x=seeded()*WORLD-WORLD/2,y=seeded()*WORLD-WORLD/2;decorations.push({x,y,type:Math.floor(seeded()*5),rot:seeded()*TAU,size:10+seeded()*25})}}
generateDecor();
function resize(){vw=window.innerWidth;vh=window.innerHeight;dpr=Math.min(window.devicePixelRatio||1,1.6);canvas.width=Math.round(vw*dpr);canvas.height=Math.round(vh*dpr);canvas.style.width=vw+'px';canvas.style.height=vh+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
window.addEventListener('resize',resize);resize();
const isTouch=()=>window.matchMedia('(pointer:coarse)').matches;
function sound(note=480,dur=.10,type='sine',volume=.045){if(!save.sound)return;try{audioContext=audioContext||new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume();let o=audioContext.createOscillator(),g=audioContext.createGain(),t=audioContext.currentTime;o.type=type;o.frequency.setValueAtTime(note,t);o.frequency.exponentialRampToValueAtTime(Math.max(90,note*.58),t+dur);g.gain.setValueAtTime(volume,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(audioContext.destination);o.start(t);o.stop(t+dur+.01)}catch{}}
function toast(text,delay=2400){let t=$('toast');t.textContent=text;t.classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.add('hidden'),delay)}
function phase(text){let p=$('phaseText');p.textContent=text;p.classList.add('active');clearTimeout(phaseTimer);phaseTimer=setTimeout(()=>p.classList.remove('active'),2600)}
const purchaseCost=(type,level)=>Math.floor((45+level*29)*Math.pow(1.57,level));
function menu(){screen='menu';game=null;$('hud').classList.add('hidden');$('touchUI').classList.add('hidden');$('bossHud').classList.add('hidden');$('overlay').innerHTML=`<div class="menu-shell">
<div class="eyebrow">UMA ALMA • INFINITAS MORTES</div><div class="sigil" aria-hidden="true"><span>♱</span></div>
<h1 class="brand">DEATH RUSH<small>INFERNAL ASCENSION</small></h1>
<p class="intro">O Abismo despertou. Enfrente hordas demoníacas, evolua poderes proibidos e desafie <b>Malgor, o Devorador</b>. Quanto mais você mata, mais o inferno responde.</p>
<div class="menu-stats"><span class="stat-chip">✦ ALMAS <b>${save.souls}</b></span><span class="stat-chip">☠ RECORDE <b>${save.bestKills}</b></span><span class="stat-chip">♛ VITÓRIAS <b>${save.wins}</b></span></div>
<div class="section-label">ESCOLHA SEU PACTO</div><div class="classes">${Object.entries(CLASSES).map(([id,c])=>`<button class="class-card ${save.selectedClass===id?'selected':''}" data-class="${id}" aria-pressed="${save.selectedClass===id}"><span class="check">${save.selectedClass===id?'✓ ATIVO':''}</span><span class="symbol" style="color:${c.color}">${c.symbol}</span><strong>${c.name}</strong><p>${c.desc}</p></button>`).join('')}</div>
<div class="menu-buttons"><button class="btn primary" data-action="start">✦ INICIAR CAÇADA • 5 MIN</button><button class="btn secondary" data-action="training">⚡ TESTE RÁPIDO • 90 S</button><button class="btn secondary" data-action="shop">⚒ ALTAR DE PODER</button><button class="btn secondary" data-action="inventory">◆ RELICÁRIO</button><button class="btn ghost" data-action="guide">? COMO JOGAR</button></div>
<div class="footnote">Grátis • Sem login • Sem anúncios • Progresso salvo neste aparelho</div></div>`;
}
function showShop(){screen='shop';$('overlay').innerHTML=`<div class="modal"><div class="eyebrow">PROGRESSÃO PERMANENTE</div><h2>ALTAR DE PODER</h2><p class="subtitle">Suas almas sobrevivem à morte. Fortaleça seu caçador para a próxima tentativa.</p><div class="wallet">✦ ALMAS DISPONÍVEIS: <strong>${save.souls}</strong></div><div class="shop-list">${Object.entries(SHOP).map(([id,u])=>{let lv=save.upgrades[id],cost=purchaseCost(id,lv);return `<div class="shop-item"><span class="shop-icon">${u.icon}</span><div class="shop-desc"><strong>${u.name}</strong><p>${u.description}</p><span class="lv">NÍVEL ${lv} / ${u.max}</span></div><button class="btn secondary" data-buy="${id}" ${lv>=u.max||save.souls<cost?'disabled':''}>${lv>=u.max?'MÁXIMO':'✦ '+cost}</button></div>`}).join('')}</div><div class="modal-actions"><button class="btn primary" data-action="menu">VOLTAR AO MENU</button></div></div>`}
function showInventory(){screen='inventory';$('overlay').innerHTML=`<div class="modal"><div class="eyebrow">TESOUROS ARRANCADOS DO ABISMO</div><h2>RELICÁRIO</h2><p class="subtitle">Relíquias podem cair de elites e do chefão. Equipe uma arma, uma armadura e um amuleto antes da caçada.</p><div class="wallet">◆ RELÍQUIAS DESCOBERTAS: <strong>${save.inventory.length} / ${Object.keys(RELICS).length}</strong></div><div class="shop-list">${Object.entries(RELICS).map(([id,item])=>{let owned=save.inventory.includes(id),equipped=save.equipped[item.slot]===id;return `<div class="shop-item" style="opacity:${owned?1:.48}"><span class="shop-icon">${owned?item.icon:'?'}</span><div class="shop-desc"><strong>${owned?item.name:'Relíquia desconhecida'}</strong><p>${owned?item.description:'Derrote elites para tentar descobrir este tesouro.'}</p><span class="lv">${slotName[item.slot]} · ${owned?item.rarity:'NÃO DESCOBERTO'}</span></div><button class="btn secondary" data-equip="${id}" ${!owned||equipped?'disabled':''}>${equipped?'EQUIPADA':owned?'EQUIPAR':'BLOQUEADA'}</button></div>`}).join('')}</div><div class="modal-actions"><button class="btn primary" data-action="menu">VOLTAR AO MENU</button></div></div>`}
function showGuide(){screen='guide';$('overlay').innerHTML=`<div class="modal"><div class="eyebrow">MANUAL DO SOBREVIVENTE</div><h2>COMO JOGAR</h2><div class="guide"><p><b>CONTROLE:</b> no celular, arraste o joystick no canto inferior esquerdo. No PC, use <b>WASD</b> ou <b>setas</b>. As armas atacam automaticamente os inimigos próximos.</p><p><b>ESQUIVA:</b> pressione <b>espaço</b> ou toque no botão ↯ para avançar rapidamente e evitar golpes. Há um pequeno tempo de recarga.</p><p><b>EVOLUÇÃO:</b> recolha cristais de XP deixados pelos monstros. Cada nível permite escolher uma entre três melhorias. Armas no nível V recebem uma evolução especial.</p><p><b>COMBOS:</b> Sentinelas Orbitais invoca de 1 a 5 drones ao redor do herói. Cada nível de Sede de Sangue acelera a órbita e potencializa seus impactos. Julgamento Trovejante atinge alvos com raios automáticos.</p><p><b>BAÚS ESPECIAIS:</b> abra caixas no mapa ou derrube elites para conseguir Ímã Abissal (atrai XP), Bomba do Juízo (elimina monstros numa área), Sangue Vital (cura tudo) ou Eclipse Temporal (congela inimigos e projéteis por 7 segundos). Malgor também solta um baú ao se transformar.</p><p><b>FRENESI:</b> atinja marcos de eliminações para ampliar seu poder e acelerar o caos. Com 1.000 abates, você assume uma forma demoníaca temporária.</p><p><b>CHEFÃO:</b> sobreviva até a chegada de Malgor e derrote-o. Atenção aos círculos vermelhos no chão: anunciam ataques perigosos.</p><p><b>PROGRESSO:</b> cada partida rende almas para melhorias permanentes no Altar de Poder. Use o modo de 90 segundos para testar rapidamente as mecânicas.</p><p><b>SAVE:</b> fica salvo neste navegador e dispositivo. Limpar os dados do site apaga o progresso. Para instalar como app, abra o projeto por HTTPS ou localhost.</p></div><div class="modal-actions"><button class="btn secondary" data-action="toggleSound">${save.sound?'♫ SONS: LIGADOS':'♫ SONS: DESLIGADOS'}</button><button class="btn secondary" data-action="toggleGraphics">GRÁFICOS: ${save.graphics.toUpperCase()}</button><button class="btn primary" data-action="menu">VOLTAR</button></div></div>`}
function showPause(){screen='paused';$('overlay').innerHTML=`<div class="modal"><div class="eyebrow">A BATALHA FOI INTERROMPIDA</div><h2>PAUSA</h2><p class="subtitle">O abismo espera por você.</p><div class="modal-actions"><button class="btn primary" data-action="resume">▶ CONTINUAR</button><button class="btn secondary" data-action="toggleSound">${save.sound?'♫ SONS LIGADOS':'♫ SONS DESLIGADOS'}</button><button class="btn ghost" data-action="quit">ABANDONAR PARTIDA</button></div></div>`}
function choicesFor(g){let options=Object.keys(UPGRADES).filter(k=>(g.abilities[k]||0)<UPGRADES[k].max);let out=[];if(options.length===0)return ['health','damage','regen'];let featured=g.player.level<=3&&g.abilities.guardian===0?'guardian':g.player.level<=5&&g.abilities.storm===0?'storm':null;if(featured&&options.includes(featured)){out.push(featured);options.splice(options.indexOf(featured),1)}while(options.length&&out.length<3){let idx=Math.floor(Math.random()*options.length);out.push(options.splice(idx,1)[0])}return out}
function showLevelup(){screen='levelup';let options=game.choices=choicesFor(game);$('overlay').innerHTML=`<div class="modal"><div class="eyebrow">O PACTO SE APROFUNDA</div><h2>NÍVEL ${game.player.level}</h2><p class="subtitle">Escolha seu próximo poder. O tempo está parado.</p><div class="upgrade-grid">${options.map((id,i)=>{let u=UPGRADES[id],next=(game.abilities[id]||0)+1;return `<button class="upgrade-option" data-upgrade="${id}"><span class="u-icon">${u.icon}</span><div><strong>${u.name}</strong><p>${u.desc}</p></div><em>${i+1} · ${u.tag}<br>NÍVEL ${next}${next===5?' ★':''}</em></button>`}).join('')}</div></div>`;sound(620,.23,'triangle',.07)}
function showResult(win){screen=win?'victory':'dead';const g=game;let earned=Math.floor(g.soulsEarned)+(win?180:0);save.souls+=earned;save.bestKills=Math.max(save.bestKills,g.kills);save.bestTime=Math.max(save.bestTime,Math.floor(g.time));save.runs++;if(win)save.wins++;persist();$('hud').classList.add('hidden');$('touchUI').classList.add('hidden');$('overlay').innerHTML=`<div class="modal"><div class="eyebrow">${win?'O ABISMO SE CURVA DIANTE DE VOCÊ':'O ABISMO RECLAMA MAIS UMA ALMA'}</div><div class="result-hero">${win?'♛':'☠'}</div><h2>${win?'MALGOR FOI DESTRUÍDO!':'VOCÊ CAIU EM COMBATE'}</h2><p class="subtitle">${win?'A caçada terminou. Mas o inferno nunca dorme.':'Toda derrota alimenta sua próxima ascensão.'}</p><p class="subtitle">Especiais ativados: <b>${g.specialsUsed}</b>${g.bossSpecial?' · Espólio de Malgor: '+g.bossSpecial:''}</p><div class="result-score"><div><strong>${g.kills}</strong><span>Eliminações</span></div><div><strong>${fmtTime(g.time)}</strong><span>Sobrevivência</span></div><div><strong>+${earned}</strong><span>Almas obtidas</span></div></div><div class="modal-actions"><button class="btn primary" data-action="retry">↻ JOGAR NOVAMENTE</button><button class="btn secondary" data-action="shop">⚒ ALTAR</button><button class="btn secondary" data-action="inventory">◆ RELICÁRIO</button><button class="btn ghost" data-action="menu">MENU</button></div></div>`;sound(win?770:220,.55,win?'triangle':'sawtooth',.08)}
function finishUpgrade(id){game.applyUpgrade(id);if(game.pendingLevels>0){game.pendingLevels--;showLevelup()}else{screen='playing';$('overlay').innerHTML=''}}
function togglePause(){if(screen==='playing'){showPause()}else if(screen==='paused'){screen='playing';$('overlay').innerHTML=''}}
$('overlay').addEventListener('click',e=>{
 const classBtn=e.target.closest('[data-class]');if(classBtn){save.selectedClass=classBtn.dataset.class;persist();sound(510,.08);menu();return}
 const buy=e.target.closest('[data-buy]');if(buy&&screen==='shop'){let k=buy.dataset.buy,lv=save.upgrades[k],cost=purchaseCost(k,lv);if(lv<SHOP[k].max&&save.souls>=cost){save.souls-=cost;save.upgrades[k]++;persist();sound(780,.19,'triangle');showShop()}return}
 const equip=e.target.closest('[data-equip]');if(equip&&screen==='inventory'){let id=equip.dataset.equip,rel=RELICS[id];if(rel&&save.inventory.includes(id)){save.equipped[rel.slot]=id;persist();sound(720,.18,'triangle');showInventory()}return}
 const up=e.target.closest('[data-upgrade]');if(up&&screen==='levelup'){finishUpgrade(up.dataset.upgrade);return}
 const action=e.target.closest('[data-action]');if(!action)return;
 switch(action.dataset.action){case 'start':start(false);break;case 'training':start(true);break;case 'retry':start(game?.rapid||false);break;case 'shop':showShop();break;case 'inventory':showInventory();break;case 'menu':menu();break;case 'guide':showGuide();break;case 'resume':togglePause();break;case 'quit':if(game)showResult(false);else menu();break;case 'toggleSound':save.sound=!save.sound;persist();if(screen==='paused')showPause();else showGuide();break;case 'toggleGraphics':save.graphics=({auto:'baixo',baixo:'alto',alto:'auto'})[save.graphics]||'auto';persist();showGuide();break}
});
$('pauseBtn').addEventListener('click',togglePause);
$('dashBtn').addEventListener('click',()=>{if(game&&screen==='playing')game.dash()});
window.addEventListener('keydown',e=>{
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();
 keys.add(e.key.toLowerCase());if(e.repeat)return;
 if(e.key==='Escape'||e.key.toLowerCase()==='p')togglePause();
 if(e.key===' '&&game&&screen==='playing')game.dash();
 if(screen==='levelup'&&['1','2','3'].includes(e.key)){let k=game.choices[Number(e.key)-1];if(k)finishUpgrade(k)}
});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>{keys.clear();if(screen==='playing')showPause()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&screen==='playing')showPause()});
function stickMove(e){let box=$('joystick').getBoundingClientRect(),dx=e.clientX-(box.left+box.width/2),dy=e.clientY-(box.top+box.height/2),len=Math.hypot(dx,dy),dist=Math.min(len,43),ang=Math.atan2(dy,dx);joystickVector={x:len>5?Math.cos(ang)*Math.min(1,len/39):0,y:len>5?Math.sin(ang)*Math.min(1,len/39):0};$('stick').style.transform=`translate(calc(-50% + ${Math.cos(ang)*dist}px),calc(-50% + ${Math.sin(ang)*dist}px))`;$('touchUI').classList.add('active')}
$('joystick').addEventListener('pointerdown',e=>{e.preventDefault();touchPointer=e.pointerId;$('joystick').setPointerCapture(e.pointerId);stickMove(e)});
$('joystick').addEventListener('pointermove',e=>{if(touchPointer===e.pointerId)stickMove(e)});
function endStick(e){if(touchPointer!==e.pointerId)return;touchPointer=null;joystickVector={x:0,y:0};$('stick').style.transform='translate(-50%,-50%)';$('touchUI').classList.remove('active')}
$('joystick').addEventListener('pointerup',endStick);$('joystick').addEventListener('pointercancel',endStick);$('joystick').addEventListener('lostpointercapture',endStick);
function controlVector(){let x=joystickVector.x,y=joystickVector.y;if(keys.has('a')||keys.has('arrowleft'))x--;if(keys.has('d')||keys.has('arrowright'))x++;if(keys.has('w')||keys.has('arrowup'))y--;if(keys.has('s')||keys.has('arrowdown'))y++;let l=Math.hypot(x,y);return l>1?{x:x/l,y:y/l}:{x,y}}
const isMobile=()=>vw<650||isTouch();
function start(rapid){game=new Game(rapid);screen='playing';$('overlay').innerHTML='';$('hud').classList.remove('hidden');$('touchUI').classList.toggle('hidden',!isTouch());$('bossHud').classList.add('hidden');$('phaseText').classList.remove('active');updateHUD();sound(380,.25,'sawtooth',.065);phase(rapid?'CAÇADA RÁPIDA — 90 SEGUNDOS':'A CAÇADA COMEÇOU')}
class Game{
 constructor(rapid){this.rapid=rapid;this.duration=rapid?90:300;this.bossAt=rapid?56:238;this.time=0;this.kills=0;this.soulsEarned=0;this.wave=0;this.spawnCd=.35;this.eliteCd=19;this.attackCd=.10;this.stormCd=1.5;this.specialSpawnCd=14;this.timeStop=0;this.specialsUsed=0;this.bossSpecial='';this.lastSpecial='';this.novaCd=2.0;this.spiritCd=1.5;this.meleeCd=0;this.dashCd=0;this.dashTime=0;this.invuln=0;this.frenzy=0;this.demonTime=0;this.nextMilestone=0;this.bossSpawned=false;this.boss=null;this.enraged=false;this.lastHud=0;this.enemies=[];this.projectiles=[];this.enemyShots=[];this.orbs=[];this.particles=[];this.rings=[];this.telegraphs=[];this.chests=[];this.lightningBolts=[];this.choices=[];this.t=0;this.anim=0;this.abilities={guardian:0,storm:0,blade:0,fire:0,spirit:0,damage:0,speed:0,health:0,magnet:0,rate:0,regen:0,critical:0};this.classId=save.selectedClass;this.classData=CLASSES[this.classId];this.abilities[this.classData.ability]=1;
 let base=this.classData.health+15*save.upgrades.health+equippedStat('health');
 this.player={x:0,y:0,radius:15,hp:base,maxHp:base,level:1,xp:0,xpNext:20,speed:this.classData.speed*1.17,dir:0,blink:0,hit:0};this.camera={x:0,y:0};this.milestones=this.rapid?[35,115,260,450]:[75,250,600,1000];this.maxEnemies=isMobile()?105:155;this.maxParticles=isMobile()?180:270;this.pendingLevels=0;for(let i=0;i<13;i++)this.spawnEnemy(i%3===0?'hound':'imp',false,true);for(let i=0;i<5;i++){let a=(i+.3)*TAU/5;this.chests.push({x:Math.cos(a)*(205+i*55),y:Math.sin(a)*(205+i*55),rare:false,phase:rand(0,TAU)});}
 }
 damageMult(){return (1+save.upgrades.damage*.12+equippedStat('damage'))*(1+this.abilities.damage*.18)*(1+this.frenzy*.12)*(this.demonTime>0?1.9:1)}
 basicDamage(){return this.classData.damage*this.damageMult()}
 randomSpawn(min=450,max=710){let angle=rand(0,TAU),distance=rand(min,max);return {x:clamp(this.player.x+Math.cos(angle)*distance,-WORLD/2+30,WORLD/2-30),y:clamp(this.player.y+Math.sin(angle)*distance,-WORLD/2+30,WORLD/2-30)}}
 spawnEnemy(kind,elite=false,near=false){const proto=ENEMIES[kind],pos=this.randomSpawn(near?185:395,near?305:630);let scale=1+this.time/this.duration*.9;this.enemies.push({kind,x:pos.x,y:pos.y,r:proto.radius*(elite?1.4:1),maxHp:proto.hp*scale*(elite?4.4:1),hp:proto.hp*scale*(elite?4.4:1),speed:proto.speed*(elite?.85:1),damage:proto.damage*(elite?1.6:1),xp:proto.xp*(elite?5:1),elite,hit:0,flash:0,walk:rand(0,TAU),bladeHit:0,fireBurn:0,lastContact:0,seed:rand(0,1000)});}
 spawnBoss(){let pos=this.randomSpawn(410,520);this.boss={x:pos.x,y:pos.y,r:69,maxHp:this.rapid?1700:3300,hp:this.rapid?1700:3300,speed:59,shotCd:2.4,burstCd:6.5,flash:0,phase:1,hit:0,walk:0};this.bossSpawned=true;$('bossHud').classList.remove('hidden');phase('MALGOR — O DEVORADOR');sound(150,1,'sawtooth',.10);this.emitParticles(pos.x,pos.y,'#f2474d',50,210)}
 nextFrenzy(){if(this.frenzy>=4)return;if(this.kills>=this.milestones[this.frenzy]){this.frenzy++;let texts=['FRENESI I — SEDE DE SANGUE','FRENESI II — CHUVA DE OSSOS','FRENESI III — CAOS INFERNAL','ASCENSÃO DEMONÍACA!'];phase(texts[this.frenzy-1]);if(this.frenzy===4)this.demonTime=15;this.emitParticles(this.player.x,this.player.y,'#ff934e',35,180);sound(320+this.frenzy*140,.40,'sawtooth',.065)}}
 dash(){if(this.dashCd>0)return;let v=controlVector();if(Math.hypot(v.x,v.y)<.2){v={x:Math.cos(this.player.dir),y:Math.sin(this.player.dir)}}this.dashVector=v;this.dashTime=.18;this.invuln=Math.max(this.invuln,.4);this.dashCd=3.8;this.emitParticles(this.player.x,this.player.y,'#f39b70',15,100);sound(410,.12,'triangle')}
 applyUpgrade(id){if(!UPGRADES[id])return;this.abilities[id]=(this.abilities[id]||0)+1;let level=this.abilities[id];if(id==='health'){this.player.maxHp+=22;this.player.hp=Math.min(this.player.maxHp,this.player.hp+22)}if(level===5&&['guardian','storm','blade','fire','spirit'].includes(id)){toast('★ EVOLUÇÃO: '+UPGRADES[id].name.toUpperCase(),3200);this.emitParticles(this.player.x,this.player.y,'#ffb66e',45,200)}else toast(`${UPGRADES[id].name} — NÍVEL ${level}`);sound(850,.15,'triangle',.055);this.updateStats()}
 updateStats(){}
 gainXP(points){this.player.xp+=points;while(this.player.xp>=this.player.xpNext){this.player.xp-=this.player.xpNext;this.player.level++;this.player.xpNext=Math.floor(this.player.xpNext*1.24+6);this.pendingLevels++}if(this.pendingLevels>0&&screen==='playing'){this.pendingLevels--;showLevelup()}}
 dropRelic(guaranteed=false){let unknown=Object.keys(RELICS).filter(id=>!save.inventory.includes(id));if(!unknown.length){this.soulsEarned+=30;toast('◆ RELÍQUIA REPETIDA: +30 ALMAS',2100);return}let id=unknown[Math.floor(Math.random()*unknown.length)];save.inventory.push(id);persist();toast('◆ NOVA RELÍQUIA: '+RELICS[id].name.toUpperCase(),3500);sound(930,.32,'triangle',.075)}
 addOrb(x,y,v){if(this.orbs.length>380)return;this.orbs.push({x,y,value:v,r:4+Math.min(4,v*.15),phase:rand(0,TAU)})}
 emitParticles(x,y,color,n=6,spread=120){let qty=Math.min(n,Math.max(0,this.maxParticles-this.particles.length));for(let i=0;i<qty;i++){let a=rand(0,TAU),s=rand(spread*.25,spread);this.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,ttl:rand(.2,.55),max:.55,color,r:rand(1.5,4.7)})}}
 ring(x,y,r,color='#e85c5a',duration=.42){this.rings.push({x,y,r,t:0,life:duration,color})}
 nearest(x,y,maxRange=700){let nearest=null,md=maxRange*maxRange;for(let e of this.enemies){let d=distance2(x,y,e.x,e.y);if(d<md){md=d;nearest=e}}if(this.boss){let d=distance2(x,y,this.boss.x,this.boss.y);if(d<md){md=d;nearest=this.boss}}return nearest}
 fireProjectile(fromX,fromY,target,damage,speed,color,pierce=1,r=5){if(this.projectiles.length>155)return;let dx=target.x-fromX,dy=target.y-fromY,len=Math.hypot(dx,dy)||1;this.projectiles.push({x:fromX,y:fromY,vx:dx/len*speed,vy:dy/len*speed,ttl:1.65,damage,color,r,pierce,hit:new Set()})}
 hitEnemy(e,damage,source='bolt'){if(e.hp<=0)return;let critical=Math.random()<this.abilities.critical*.08+equippedStat('critical');if(critical)damage*=2;e.hp-=damage;e.flash=.10;e.hit=.10;if(Math.random()<.20)this.emitParticles(e.x,e.y,critical?'#ffdf91':'#e2675c',critical?5:2,80);if(e.hp<=0){if(e===this.boss){this.bossSpecial='BAÚ SUPREMO (+50 ALMAS)';this.soulsEarned+=50;this.dropRelic(true);this.boss=null;this.ring(e.x,e.y,220,'#f1bd8a',1);this.emitParticles(e.x,e.y,'#ff9b63',65,230);showResult(true);return}let idx=this.enemies.indexOf(e);if(idx>=0)this.enemies.splice(idx,1);this.kills++;this.soulsEarned+=ENEMIES[e.kind].soul*(e.elite?4:1);this.addOrb(e.x+rand(-5,5),e.y+rand(-5,5),e.xp);if(e.elite){toast('✦ ELITE DESTRUÍDA + ALMAS',1400);if(Math.random()<.64)this.spawnChest(e.x+rand(-25,25),e.y+rand(-25,25),true);this.emitParticles(e.x,e.y,'#eec27b',12,135);if(Math.random()<.38)this.dropRelic()}if(this.classId==='carnage'&&this.kills%10===0)this.player.hp=Math.min(this.player.maxHp,this.player.hp+3);this.nextFrenzy()}}
 takeDamage(dmg){if(this.invuln>0||screen!=='playing')return;this.player.hp-=dmg;this.invuln=.64;this.player.hit=.18;this.emitParticles(this.player.x,this.player.y,'#f26b67',8,100);if(this.player.hp<=0){this.player.hp=0;showResult(false)}else if(this.player.hp<this.player.maxHp*.25&&Math.random()<.24)toast('⚠ VIDA CRÍTICA',1300);sound(180,.1,'sawtooth',.03)}
 spawnWave(){let k=this.time/this.duration;let n=3+Math.floor(k*7)+Math.floor(rand(0,2));let free=this.maxEnemies-this.enemies.length;for(let i=0;i<Math.min(n,free);i++){let p=Math.random();let kind=p<.51?'imp':p<.75?'hound':p<.94?'cultist':'brute';this.spawnEnemy(kind)}this.wave++}
 // Baús espalhados no mundo. Elites e chefes podem deixar baús adicionais.
 spawnChest(x,y,rare=false){if(this.chests.length>=15)return;this.chests.push({x:clamp(x,-WORLD/2+35,WORLD/2-35),y:clamp(y,-WORLD/2+35,WORLD/2-35),rare,phase:rand(0,TAU)})}
 useSpecial(type,fromBoss=false){
  const names={magnet:'ÍMÃ ABISSAL',bomb:'BOMBA DO JUÍZO',heal:'SANGUE VITAL',eclipse:'ECLIPSE TEMPORAL'};
  const p=this.player;this.specialsUsed++;this.lastSpecial=names[type];if(fromBoss)this.bossSpecial=names[type];
  if(type==='magnet'){
   const reach=clamp(Math.max(vw,vh)*1.1,780,1350);let collected=0;
   for(const orb of this.orbs)if(distance2(orb.x,orb.y,p.x,p.y)<=reach*reach){orb.vacuum=4.5;collected++}
   this.ring(p.x,p.y,reach,'#ad89f8',.75);toast('✧ ÍMÃ ABISSAL: '+collected+' CRISTAIS ATRAÍDOS',2600);sound(800,.25,'sine',.065);
  }else if(type==='bomb'){
   const radius=clamp(Math.min(vw,vh)*.72,330,530);let count=0;
   for(const e of [...this.enemies])if(distance2(e.x,e.y,p.x,p.y)<(radius+e.r)**2){this.hitEnemy(e,e.hp+50,'bomb');count++}
   if(this.boss&&distance2(this.boss.x,this.boss.y,p.x,p.y)<(radius+this.boss.r)**2)this.hitEnemy(this.boss,Math.max(0,Math.min(this.boss.hp-1,this.boss.maxHp*.20)),'bomb');
   this.ring(p.x,p.y,radius,'#ffad62',.80);this.emitParticles(p.x,p.y,'#ff9352',48,radius);toast('✹ BOMBA DO JUÍZO: '+count+' DEMÔNIOS ELIMINADOS',2600);sound(125,.40,'sawtooth',.08);
  }else if(type==='heal'){
   p.hp=p.maxHp;this.ring(p.x,p.y,210,'#76f1ab',.6);this.emitParticles(p.x,p.y,'#8ef8bd',25,160);toast('♥ SANGUE VITAL: VIDA RESTAURADA',2500);sound(950,.28,'triangle',.055);
  }else if(type==='eclipse'){
   this.timeStop=Math.max(this.timeStop,7);this.ring(p.x,p.y,300,'#ac8dff',.85);toast('◷ ECLIPSE TEMPORAL: 7 SEGUNDOS DE CONGELAMENTO',2750);sound(310,.38,'triangle',.065);
  }
  updateHUD();
 }
 pickChest(c){let options=['magnet','bomb','heal','eclipse'];if(this.player.hp<this.player.maxHp*.42&&Math.random()<.55)options=['heal','heal','magnet','bomb','eclipse'];let type=options[Math.floor(Math.random()*options.length)];this.useSpecial(type)}
 guardianSpeed(){return (2.05+this.abilities.guardian*.17)*(1+this.abilities.rate*.20+equippedStat('rate')*.65)}
 guardianPosition(i,count){let a=this.anim*this.guardianSpeed()+i*TAU/count,dist=66+this.abilities.guardian*4;return {x:this.player.x+Math.cos(a)*dist,y:this.player.y+Math.sin(a)*dist,a}}
 doStorm(){let lv=this.abilities.storm;if(!lv)return;let p=this.player,range=480+lv*45;
  let targets=this.enemies.filter(e=>distance2(p.x,p.y,e.x,e.y)<range*range);if(this.boss&&distance2(p.x,p.y,this.boss.x,this.boss.y)<range*range)targets.push(this.boss);
  if(!targets.length)return;
  const strikes=lv+(lv>=5?2:0);for(let i=0;i<strikes&&targets.length;i++){
   const idx=Math.floor(Math.random()*targets.length),e=targets.splice(idx,1)[0];if(!e||e.hp<=0)continue;
   const points=[{x:p.x,y:p.y}];const steps=7;for(let k=1;k<steps;k++){let t=k/steps,off=rand(-22,22);points.push({x:p.x+(e.x-p.x)*t+off,y:p.y+(e.y-p.y)*t+off})}points.push({x:e.x,y:e.y});
   this.lightningBolts.push({points,ttl:.23,max:.23});this.hitEnemy(e,(24+lv*17)*this.damageMult()*(lv>=5?1.38:1),'storm');
   this.emitParticles(e.x,e.y,'#9ee4ff',5,55);
  }sound(560,.07,'sawtooth',.016);
 }
 doNova(){let lv=this.abilities.fire;if(!lv)return;let radius=125+lv*25,damage=(22+lv*18)*this.damageMult();if(lv>=5){radius+=65;damage*=1.6}this.ring(this.player.x,this.player.y,radius,'#ff874a',.48);this.emitParticles(this.player.x,this.player.y,'#fb914b',15+lv*4,radius);for(let e of [...this.enemies,...(this.boss?[this.boss]:[])])if(distance2(this.player.x,this.player.y,e.x,e.y)<(radius+e.r)*(radius+e.r)){this.hitEnemy(e,damage,'nova');if(e.hp>0)e.fireBurn=2.1}sound(150,.22,'sawtooth',.035)}
 doSpirits(){let lv=this.abilities.spirit;if(!lv)return;let count=Math.min(lv+1,6);for(let j=0;j<count;j++){let a=this.anim*.9+j*TAU/count,x=this.player.x+Math.cos(a)*58,y=this.player.y+Math.sin(a)*58,t=this.nearest(x,y,470);if(t)this.fireProjectile(x,y,t,(19+lv*9)*this.damageMult(),470,'#cda2ff',lv>=5?3:1,5)}}
 update(dt){this.t+=dt;this.time+=dt;this.anim+=dt;this.invuln=Math.max(0,this.invuln-dt);this.dashCd=Math.max(0,this.dashCd-dt);this.demonTime=Math.max(0,this.demonTime-dt);this.player.hit=Math.max(0,this.player.hit-dt);
 let ctrl=controlVector(),p=this.player;if(Math.hypot(ctrl.x,ctrl.y)>.12)p.dir=Math.atan2(ctrl.y,ctrl.x);
 if(this.dashTime>0){this.dashTime-=dt;p.x+=(this.dashVector?.x||0)*760*dt;p.y+=(this.dashVector?.y||0)*760*dt;this.emitParticles(p.x,p.y,'#f69a6d',2,40)}else{let move=p.speed*(1+this.abilities.speed*.09);p.x+=ctrl.x*move*dt;p.y+=ctrl.y*move*dt}p.x=clamp(p.x,-WORLD/2+35,WORLD/2-35);p.y=clamp(p.y,-WORLD/2+35,WORLD/2-35);
 this.camera.x+=(p.x-this.camera.x)*Math.min(1,dt*8);this.camera.y+=(p.y-this.camera.y)*Math.min(1,dt*8);
 if(this.abilities.regen>0||equippedStat('regen')>0)p.hp=Math.min(p.maxHp,p.hp+dt*(this.abilities.regen*.7+equippedStat('regen')));
 this.spawnCd-=dt;if(this.spawnCd<=0){this.spawnWave();this.spawnCd=Math.max(.24,.77-this.time/this.duration*.47)}
 this.eliteCd-=dt;if(this.eliteCd<=0&&this.enemies.length<this.maxEnemies-4){this.spawnEnemy(this.time>this.duration*.55?'brute':'cultist',true);this.eliteCd=Math.max(12,25-this.time/this.duration*11);phase('UM ELITE DESPERTOU')}
 if(this.time>=this.bossAt&&!this.bossSpawned)this.spawnBoss();
 if(this.time>this.duration&&!this.enraged&&this.boss){this.enraged=true;phase('MALGOR ENTROU EM FÚRIA!')}
 this.attackCd-=dt;if(this.attackCd<=0){let t=this.nearest(p.x,p.y,550);if(t){let dmg=this.basicDamage();this.fireProjectile(p.x,p.y,t,dmg,570,'#f6c39c',this.frenzy>=3?2:1,5);if(this.demonTime>0){let a=Math.atan2(t.y-p.y,t.x-p.x);for(let d of [-.19,.19]){this.projectiles.push({x:p.x,y:p.y,vx:Math.cos(a+d)*570,vy:Math.sin(a+d)*570,ttl:1.2,damage:dmg*.7,color:'#ff604b',r:5,pierce:2,hit:new Set()})}}if(Math.random()<.11)sound(400,.038,'triangle',.008)}this.attackCd=Math.max(.16,.39/(1+this.abilities.rate*.20+equippedStat('rate')+this.frenzy*.09))}
 if(this.abilities.fire){this.novaCd-=dt;if(this.novaCd<=0){this.doNova();this.novaCd=Math.max(1.3,4.3-this.abilities.fire*.4)}}
 if(this.abilities.spirit){this.spiritCd-=dt;if(this.spiritCd<=0){this.doSpirits();this.spiritCd=Math.max(.48,2.0-this.abilities.spirit*.22)}}
 // Temporizador e escolha automática dos quatro especiais espalhados na arena.
 this.timeStop=Math.max(0,this.timeStop-dt);
 this.specialSpawnCd-=dt;if(this.specialSpawnCd<=0){let pos=this.randomSpawn(240,550);this.spawnChest(pos.x,pos.y);this.specialSpawnCd=20}
 for(let i=this.chests.length-1;i>=0;i--){let chest=this.chests[i];chest.phase+=dt*2;if(distance2(chest.x,chest.y,p.x,p.y)<(p.radius+25)**2){this.chests.splice(i,1);this.pickChest(chest);if(screen!=='playing')return}}
 if(this.abilities.storm){this.stormCd-=dt;if(this.stormCd<=0){this.doStorm();this.stormCd=Math.max(.53,(2.1-this.abilities.storm*.26)/(1+this.abilities.rate*.09));if(screen!=='playing')return}}
 if(this.abilities.guardian){let count=Math.min(5,this.abilities.guardian);for(let j=0;j<count;j++){let pos=this.guardianPosition(j,count);for(let enemy of [...this.enemies,...(this.boss?[this.boss]:[])]){if(enemy.hp<=0)continue;if(distance2(pos.x,pos.y,enemy.x,enemy.y)<(enemy.r+14)**2){enemy.guardHits??={};if(this.time-(enemy.guardHits[j]??-1)>.26){enemy.guardHits[j]=this.time;this.hitEnemy(enemy,(13+this.abilities.guardian*7)*this.damageMult()*(1+this.abilities.rate*.10),'guardian');if(screen!=='playing')return}}}}}
 let blades=this.abilities.blade;if(blades){let count=blades+1,dist=54+blades*8;for(let j=0;j<count;j++){let a=this.anim*(1.9+blades*.1)+j*TAU/count,bx=p.x+Math.cos(a)*dist,by=p.y+Math.sin(a)*dist;for(let enemy of [...this.enemies,...(this.boss?[this.boss]:[])])if(this.time-(enemy.bladeHit||0)>.32&&distance2(bx,by,enemy.x,enemy.y)<(enemy.r+13)*(enemy.r+13)){enemy.bladeHit=this.time;this.hitEnemy(enemy,(15+blades*11)*this.damageMult()*(blades>=5?1.7:1),'blade');if(screen!=='playing')return}}}
 // Enemy AI and collision — bounded population, no costly physics engine.
 for(let e of this.enemies){if(this.timeStop>0)continue;e.flash=Math.max(0,e.flash-dt);e.walk+=dt*5;e.fireBurn=Math.max(0,e.fireBurn-dt);let dx=p.x-e.x,dy=p.y-e.y,len=Math.hypot(dx,dy)||1;let wobble=Math.sin(e.seed+this.time*1.5)*.2;e.x+=(dx/len+wobble*-dy/len)*e.speed*dt;e.y+=(dy/len+wobble*dx/len)*e.speed*dt;if(len<e.r+p.radius-4&&this.time-e.lastContact>.55){e.lastContact=this.time;this.takeDamage(e.damage)}}
 if(this.boss&&this.timeStop<=0)this.updateBoss(dt);
 for(let i=this.projectiles.length-1;i>=0;i--){let b=this.projectiles[i];b.x+=b.vx*dt;b.y+=b.vy*dt;b.ttl-=dt;if(b.ttl<=0){this.projectiles.splice(i,1);continue}let targets=this.boss?[...this.enemies,this.boss]:this.enemies;for(let enemy of targets){if(enemy.hp>0&&!b.hit.has(enemy)&&distance2(b.x,b.y,enemy.x,enemy.y)<(b.r+enemy.r)*(b.r+enemy.r)){b.hit.add(enemy);this.hitEnemy(enemy,b.damage);b.pierce--;if(b.pierce<=0)break}}if(b.pierce<=0){this.projectiles.splice(i,1);continue}}
 for(let i=this.enemyShots.length-1;i>=0;i--){if(this.timeStop>0)break;let b=this.enemyShots[i];b.x+=b.vx*dt;b.y+=b.vy*dt;b.ttl-=dt;if(b.ttl<=0){this.enemyShots.splice(i,1);continue}if(distance2(b.x,b.y,p.x,p.y)<(b.r+p.radius)*(b.r+p.radius)){this.takeDamage(b.damage);this.enemyShots.splice(i,1)}}
 for(let i=this.orbs.length-1;i>=0;i--){let o=this.orbs[i],d=Math.hypot(p.x-o.x,p.y-o.y),reach=(o.vacuum>0?1700:108+this.abilities.magnet*45+save.upgrades.magnet*18+equippedStat('magnet'));o.vacuum=Math.max(0,(o.vacuum||0)-dt);o.phase+=dt*6;if(d<reach&&d>1){let speed=(o.vacuum>0?1100:210)+(reach-d)*(o.vacuum>0?1.8:3);o.x+=(p.x-o.x)/d*speed*dt;o.y+=(p.y-o.y)/d*speed*dt}if(d<24){this.gainXP(o.value);this.orbs.splice(i,1);if(screen==='levelup')break}}
 for(let i=this.particles.length-1;i>=0;i--){let pt=this.particles[i];pt.x+=pt.vx*dt;pt.y+=pt.vy*dt;pt.vx*=.95;pt.vy*=.95;pt.ttl-=dt;if(pt.ttl<=0)this.particles.splice(i,1)}
 for(let i=this.lightningBolts.length-1;i>=0;i--){this.lightningBolts[i].ttl-=dt;if(this.lightningBolts[i].ttl<=0)this.lightningBolts.splice(i,1)}
 for(let i=this.rings.length-1;i>=0;i--){let rr=this.rings[i];rr.t+=dt;if(rr.t>=rr.life)this.rings.splice(i,1)}
 for(let i=this.telegraphs.length-1;i>=0;i--){let t=this.telegraphs[i];if(this.timeStop>0)continue;t.time-=dt;if(t.time<=0){this.ring(t.x,t.y,t.r,'#e95e46',.48);this.emitParticles(t.x,t.y,'#e45a4a',16,130);if(distance2(p.x,p.y,t.x,t.y)<(t.r+p.radius)*(t.r+p.radius))this.takeDamage(t.damage);this.telegraphs.splice(i,1)}}
 this.lastHud-=dt;if(this.lastHud<=0){updateHUD();this.lastHud=.10}
 }
 updateBoss(dt){const b=this.boss;if(!b)return;b.walk+=dt;b.flash=Math.max(0,b.flash-dt);let p=this.player,dx=p.x-b.x,dy=p.y-b.y,d=Math.hypot(dx,dy)||1;if(d>115){b.x+=dx/d*b.speed*dt;b.y+=dy/d*b.speed*dt}if(d<b.r+p.radius-5&&this.time-b.hit>.7){b.hit=this.time;this.takeDamage(29)}
 if(b.hp/b.maxHp<.48&&b.phase===1){b.phase=2;b.speed*=1.35;this.spawnChest(b.x+95,b.y+50,true);phase('MALGOR — SEGUNDA FORMA • BAÚ ESPECIAL');this.ring(b.x,b.y,245,'#ec4455',.9)}
 b.shotCd-=dt;if(b.shotCd<=0){let count=b.phase===2?14:10;for(let i=0;i<count;i++){let a=i*TAU/count+this.time*.65,sp=125+(b.phase===2?40:0);this.enemyShots.push({x:b.x,y:b.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:7,ttl:3.6,damage:18,color:'#fa674f'})}b.shotCd=this.enraged?1.3:(b.phase===2?2:2.9);sound(115,.17,'sawtooth',.028)}
 b.burstCd-=dt;if(b.burstCd<=0){for(let i=0;i<(b.phase===2?3:2);i++){let x=p.x+rand(-105,105),y=p.y+rand(-105,105);this.telegraphs.push({x,y,r:63+(b.phase===2?12:0),time:1.3+i*.15,damage:b.phase===2?40:29})}b.burstCd=this.enraged?2.9:(b.phase===2?4.1:5.5)}
 }
}
function updateHUD(){if(!game)return;let g=game,p=g.player;$('hpFill').style.width=clamp(100*p.hp/p.maxHp,0,100)+'%';$('xpFill').style.width=clamp(100*p.xp/p.xpNext,0,100)+'%';$('hpText').textContent=`${Math.ceil(p.hp)} / ${p.maxHp}`;$('playerLevel').textContent=`NÍVEL ${p.level}`;$('timeText').textContent=g.time<=g.duration?fmtTime(Math.max(0,g.duration-g.time)):'+'+fmtTime(g.time-g.duration);$('killsText').textContent=g.kills;$('classHud').textContent=g.classData.short;$('skillsHud').textContent=Object.entries({guardian:'Drones',storm:'Raios',blade:'Lâminas',spirit:'Espectros',fire:'Fogo'}).filter(([k])=>g.abilities[k]).map(([k,v])=>`${v} ${g.abilities[k]}`).join(' • ');$('frenzyLevel').textContent=`${g.frenzy} / 4`;let lo=g.frenzy===0?0:g.milestones[g.frenzy-1],hi=g.frenzy>=4?g.kills:g.milestones[g.frenzy];$('frenzyFill').style.width=(g.frenzy>=4?100:clamp(100*(g.kills-lo)/(hi-lo),0,100))+'%';$('bossFill').style.width=g.boss?clamp(100*g.boss.hp/g.boss.maxHp,0,100)+'%':'0%';$('dashBtn').classList.toggle('cooldown',g.dashCd>0);$('specialHud').textContent=g.timeStop>0?'◷ ECLIPSE '+Math.ceil(g.timeStop)+'s':g.lastSpecial?'◆ '+g.lastSpecial+' · '+g.specialsUsed+'x':'◆ PROCURE BAÚS ESPECIAIS'}
function circle(x,y,r,fill,stroke,width=1){ctx.beginPath();ctx.arc(x,y,r,0,TAU);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.lineWidth=width;ctx.strokeStyle=stroke;ctx.stroke()}}
function polygon(points,fill,stroke,width=1){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function roundedRect(x,y,w,h,r,fill){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill()}
function drawRune(x,y,r,color,spin=0){ctx.save();ctx.translate(x,y);ctx.rotate(spin);ctx.strokeStyle=color;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.moveTo(-r*.72,-r*.72);ctx.lineTo(r*.72,r*.72);ctx.moveTo(r*.72,-r*.72);ctx.lineTo(-r*.72,r*.72);ctx.moveTo(0,-r*1.2);ctx.lineTo(0,r*1.2);ctx.stroke();for(let j=0;j<6;j++){let a=j*TAU/6;polygon([[Math.cos(a)*r*.83,Math.sin(a)*r*.83],[Math.cos(a+.15)*r*.92,Math.sin(a+.15)*r*.92],[Math.cos(a+.3)*r*.81,Math.sin(a+.3)*r*.81]],color)}ctx.restore()}
function terrain(camX,camY,t,ambient=false){ctx.fillStyle='#13121b';ctx.fillRect(0,0,vw,vh);const left=camX-vw/2,top=camY-vh/2,tile=108;
 ctx.save();ctx.translate(vw/2-camX,vh/2-camY);
 let x0=Math.floor(left/tile)-1,x1=Math.ceil((camX+vw/2)/tile)+1,y0=Math.floor(top/tile)-1,y1=Math.ceil((camY+vh/2)/tile)+1;
 for(let ix=x0;ix<=x1;ix++)for(let iy=y0;iy<=y1;iy++){let x=ix*tile,y=iy*tile,hash=((Math.imul(ix,73856093)^Math.imul(iy,19349663))>>>0)%99;ctx.fillStyle=hash<18?'#1d1721':hash<54?'#18141d':'#1a161f';ctx.fillRect(x+.5,y+.5,tile-1,tile-1);ctx.strokeStyle='#392d323b';ctx.lineWidth=1;ctx.strokeRect(x+4,y+4,tile-8,tile-8);
 if(hash<11){ctx.strokeStyle='#b44d4255';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+11,y+39);ctx.lineTo(x+40,y+51);ctx.lineTo(x+53,y+94);ctx.stroke()}else if(hash>92){circle(x+tile/2,y+tile/2,14,null,'#9b685a38');circle(x+tile/2,y+tile/2,4,'#7d4f4835')}}
 for(let o of decorations){if(Math.abs(o.x-camX)>vw/2+85||Math.abs(o.y-camY)>vh/2+85)continue;ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.rot);let sz=o.size;
 if(o.type===0){drawRune(0,0,sz*.73,'#914e5338')}
 else if(o.type===1){polygon([[-sz,sz/2],[-sz*.4,-sz*.5],[sz*.1,-sz],[sz,sz/2]],'#2c2730','#44313c',1.5);ctx.strokeStyle='#914d4d55';ctx.beginPath();ctx.moveTo(-sz*.3,-sz*.3);ctx.lineTo(sz*.2,sz*.2);ctx.stroke()}
 else if(o.type===2){ctx.strokeStyle='#65404a60';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-sz*.8,-sz*.3);ctx.lineTo(0,sz*.5);ctx.lineTo(sz*.8,-sz*.6);ctx.stroke();circle(0,sz*.5,3,'#71444b')}
 else if(o.type===3){polygon([[-sz,-sz*.3],[-sz*.45,-sz*.8],[sz*.6,sz*.1],[sz*.5,sz*.7]],'#24222d');ctx.strokeStyle='#5d3a46';ctx.strokeRect(-sz*.5,0,sz*.5,2)}
 else{ctx.strokeStyle='#82595441';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,sz*.6,0,Math.PI*1.4);ctx.stroke()}
 ctx.restore()}
 if(ambient){let pulse=(Math.sin(t*.75)+1)/2;drawRune(0,0,150+pulse*12,'#ad45413f',t*.035);drawRune(0,0,244,'#924f4a24',-t*.02)}
 ctx.restore();
 // Overlay simple ember light pooled over the visible floor.
 const glow=ctx.createRadialGradient(vw*.52,vh*.56,70,vw*.52,vh*.56,Math.max(vw,vh)*.80);glow.addColorStop(0,'#67252413');glow.addColorStop(1,'#02020875');ctx.fillStyle=glow;ctx.fillRect(0,0,vw,vh)
}
function enemyShape(e,t,low){let {x,y,r,kind,elite}=e,flash=e.flash>0;ctx.save();ctx.translate(x,y);let wobble=Math.sin(e.walk)*2;
 circle(0,r*.66,r*.94,'#08080d84');ctx.translate(0,wobble);
 if(elite){circle(0,0,r+7,'#8b602021','#e3b56e88',2);if(!low){ctx.shadowColor='#ffb15d';ctx.shadowBlur=16}}
 if(kind==='imp'){
 polygon([[-r*.96,-r*.3],[-r*.85,-r*1.25],[-r*.25,-r*.83]],'#8f393e','#cf6e5a');polygon([[r*.96,-r*.3],[r*.85,-r*1.25],[r*.25,-r*.83]],'#8f393e','#cf6e5a');polygon([[-r,0],[-r*.7,-r*.8],[0,-r*.95],[r*.8,-r*.7],[r,.5*r],[0,r*.95],[-r*.8,.5*r]],flash?'#f7c1a5':'#853e48','#d87965',1.5);circle(-r*.34,-r*.12,2.5,'#ffb869');circle(r*.34,-r*.12,2.5,'#ffb869')
 }else if(kind==='hound'){
 polygon([[-r*.9,-r*.8],[-r*.2,-r*.6],[r*.7,-r*.5],[r*1.3,0],[r*.65,r*.68],[-r*.7,r*.6]],flash?'#eec6bb':'#624f6d','#ac8294',1.5);polygon([[-r*.65,-r*.6],[-r*.9,-r*1.3],[0,-r*.65]],'#a47582');polygon([[r*.55,-r*.5],[r,-r*1.3],[r*.2,-r*.7]],'#9a718a');circle(-r*.2,-r*.1,3,'#ff737f');circle(r*.43,-r*.1,3,'#ff737f');
 }else if(kind==='cultist'){
 polygon([[0,-r*1.1],[-r,0],[-r*.72,r],[r*.72,r],[r,0]],flash?'#d8c3ef':'#55405e','#aa79b9',2);polygon([[0,-r*.95],[-r*.54,-r*.15],[0,r*.2],[r*.54,-r*.15]],'#211a30');circle(-r*.22,0,2.6,'#e6abfa');circle(r*.22,0,2.6,'#e6abfa');ctx.strokeStyle='#ab6ca7';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(r*.8,-r*.6);ctx.lineTo(r*.8,r*.9);ctx.stroke();circle(r*.8,-r*.6,4,'#cb8aff');
 }else{
 polygon([[-r*.7,-r*.8],[-r*1.3,-r*1.15],[-r*.85,0],[-r,r*.8],[r,r*.8],[r*.85,0],[r*1.3,-r*1.15],[r*.7,-r*.8]],flash?'#f0ccad':'#634452','#bf715f',2);circle(0,-r*.06,r*.7,flash?'#f8cfb1':'#a55f52','#da9271',2);polygon([[-r*.3,-r*.45],[0,-r*.8],[r*.3,-r*.45],[0,r*.25]],'#542932');circle(-r*.37,-r*.04,4,'#ffb05c');circle(r*.37,-r*.04,4,'#ffb05c')}
 if(elite){ctx.strokeStyle='#ffca78';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r+4,0,TAU);ctx.stroke();let w= r*2.2;ctx.fillStyle='#160c14';ctx.fillRect(-w/2,-r-14,w,4);ctx.fillStyle='#ffb96e';ctx.fillRect(-w/2,-r-14,w*clamp(e.hp/e.maxHp,0,1),4)}ctx.restore()}
function bossShape(b,t,low){let x=b.x,y=b.y,r=b.r;ctx.save();ctx.translate(x,y+Math.sin(t*2)*3);ctx.rotate(Math.sin(t*1.2)*.03);circle(0,r*.63,r*1.05,'#07060baf');if(!low){ctx.shadowColor='#cf3529';ctx.shadowBlur=28}circle(0,0,r*1.12,'#652c3448','#ce5e53aa',2);ctx.shadowBlur=0;
 // Infernal shoulders and horns.
 polygon([[-r*.6,-r*.45],[-r*1.35,-r*1.55],[-r*.9,-r*1.2],[-r*.7,-r*.2]],'#b88f73','#fb9872',2);polygon([[r*.6,-r*.45],[r*1.35,-r*1.55],[r*.9,-r*1.2],[r*.7,-r*.2]],'#b88f73','#fb9872',2);
 polygon([[-r*1.35,-r*.35],[-r*.78,-r*.73],[0,-r],[r*.78,-r*.73],[r*1.35,-r*.35],[r*1.05,r*.85],[0,r*1.1],[-r*1.05,r*.85]],b.flash>0?'#e6b4a2':'#4e2534','#de6e59',3);
 circle(0,-r*.14,r*.72,b.flash>0?'#e4a795':'#8a3c43','#d77d5c',3);
 polygon([[-r*.55,-r*.55],[-r*.8,-r*1.55],[-r*.17,-r*.8]],'#e1ad85','#ffb67c',2);polygon([[r*.55,-r*.55],[r*.8,-r*1.55],[r*.17,-r*.8]],'#e1ad85','#ffb67c',2);
 polygon([[-r*.7,-r*.12],[-r*.2,-r*.22],[-r*.25,r*.15],[-r*.65,r*.1]],'#210d17');polygon([[r*.7,-r*.12],[r*.2,-r*.22],[r*.25,r*.15],[r*.65,r*.1]],'#210d17');circle(-r*.41,-r*.04,r*.12,'#ffcd75');circle(r*.41,-r*.04,r*.12,'#ffcd75');
 polygon([[-r*.25,r*.38],[0,r*.54],[r*.25,r*.38],[0,r*.85]],'#1a0a16','#f79e75',2);drawRune(0,r*.53,r*.16,b.phase===2?'#ffe291':'#eea47d',t*.4);
 if(b.phase===2){ctx.strokeStyle='#ffb66a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r*.98,t*2,t*2+1.2);ctx.arc(0,0,r*.98,t*2+Math.PI,t*2+Math.PI+1.2);ctx.stroke()}
 ctx.restore()}
function playerShape(g,low){let p=g.player,t=g.anim,r=p.radius,c=CLASSES[g.classId];ctx.save();ctx.translate(p.x,p.y);circle(0,r*.8,17,'#080611a8');if(g.invuln>0&&Math.sin(t*34)>0){ctx.globalAlpha=.65}if(g.demonTime>0){if(!low){ctx.shadowColor='#ff6935';ctx.shadowBlur=30}circle(0,0,25,'#e34d372c','#ff9253',2);ctx.shadowBlur=0;drawRune(0,0,28,'#fa925e86',-t*1.1)}
 ctx.rotate(p.dir+Math.PI/2);polygon([[-13,-5],[-17,19],[0,13],[17,19],[13,-5]],'#281d30','#bd6758',1.6);polygon([[-12,-7],[-15,-17],[0,-23],[15,-17],[12,-7],[8,7],[-8,7]],p.hit>0?'#fff1ce':'#423142',c.color,2);polygon([[-7,-15],[0,-21],[7,-15],[4,-3],[-4,-3]],'#15121a');circle(-4,-11,2,c.color);circle(4,-11,2,c.color);polygon([[-10,-19],[-17,-25],[-11,-12]],'#c6b49c');polygon([[10,-19],[17,-25],[11,-12]],'#c6b49c');ctx.strokeStyle='#ffd09c';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(12,-2);ctx.lineTo(21,-17);ctx.stroke();ctx.restore()}
function drawWeaponEffects(g,low){let p=g.player,t=g.anim;
 if(g.abilities.guardian){let n=Math.min(5,g.abilities.guardian);for(let i=0;i<n;i++){let d=g.guardianPosition(i,n);ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.a+Math.PI/2);if(!low){ctx.shadowColor='#7de4e6';ctx.shadowBlur=13}polygon([[0,-15],[13,-3],[9,12],[0,17],[-9,12],[-13,-3]],'#37515f','#92e9fa',1.8);ctx.shadowBlur=0;circle(0,1,5,'#e7ffff');ctx.restore()}}
if(g.abilities.blade){let lv=g.abilities.blade,count=lv+1,distance=54+lv*8;for(let i=0;i<count;i++){let a=t*(1.9+lv*.1)+i*TAU/count,x=p.x+Math.cos(a)*distance,y=p.y+Math.sin(a)*distance;ctx.save();ctx.translate(x,y);ctx.rotate(a+Math.PI/2);if(!low){ctx.shadowColor='#ff8b74';ctx.shadowBlur=13}polygon([[0,-21],[7,-5],[4,16],[0,21],[-4,16],[-7,-5]],lv===5?'#ffd4ab':'#ec907c','#fff0d7',1.1);ctx.shadowBlur=0;circle(0,7,3,'#9c343d');ctx.restore()}}
 if(g.abilities.spirit){let lv=g.abilities.spirit;for(let i=0;i<Math.min(6,lv+1);i++){let a=t*.9+i*TAU/Math.min(6,lv+1),x=p.x+Math.cos(a)*58,y=p.y+Math.sin(a)*58+Math.sin(t*3+i)*4;ctx.save();ctx.translate(x,y);if(!low){ctx.shadowColor='#ac76ff';ctx.shadowBlur=17}polygon([[-10,6],[-9,-5],[0,-14],[10,-5],[10,6],[3,3],[0,13],[-5,4]],'#6d508b','#e9bcff',1.4);ctx.shadowBlur=0;circle(-4,-3,2,'#f9c9ff');circle(4,-3,2,'#f9c9ff');ctx.restore()}}
 if(g.abilities.fire){let lv=g.abilities.fire;ctx.save();ctx.globalAlpha=.28+Math.sin(t*3)*.08;ctx.lineWidth=2+lv*.3;ctx.strokeStyle='#ff874a';ctx.setLineDash([7,17]);ctx.beginPath();ctx.arc(p.x,p.y,37+lv*5,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.restore()}}
function drawWorld(g){let cam=g.camera,low=save.graphics==='baixo'||(save.graphics==='auto'&&frameAvg>29);terrain(cam.x,cam.y,g.time);ctx.save();ctx.translate(vw/2-cam.x,vh/2-cam.y);let vis=(x,y,extra=90)=>Math.abs(x-cam.x)<vw/2+extra&&Math.abs(y-cam.y)<vh/2+extra;
 for(let t of g.telegraphs){if(!vis(t.x,t.y))continue;circle(t.x,t.y,t.r,'#dd3f3835','#ef5e5bb8',2);ctx.save();ctx.globalAlpha=.24+.24*Math.sin(g.time*19);circle(t.x,t.y,t.r*.7,'#ff483e44');ctx.restore();drawRune(t.x,t.y,t.r*.51,'#ff99997b',g.time*.5)}
 for(let o of g.orbs){if(!vis(o.x,o.y))continue;let bob=Math.sin(o.phase)*2;ctx.save();ctx.translate(o.x,o.y+bob);ctx.rotate(o.phase*.1);if(!low){ctx.shadowColor='#a47dff';ctx.shadowBlur=9}polygon([[0,-o.r*1.25],[o.r,0],[0,o.r*1.25],[-o.r,0]],'#a889ef','#e7c5ff',.8);ctx.restore()}
 for(let c of g.chests){if(!vis(c.x,c.y))continue;let bob=Math.sin(c.phase*2)*4;ctx.save();ctx.translate(c.x,c.y+bob);ctx.rotate(Math.sin(c.phase)*.07);if(!low){ctx.shadowColor=c.rare?'#ffd18e':'#bfa0ff';ctx.shadowBlur=12}polygon([[-16,-12],[16,-12],[17,14],[-17,14]],c.rare?'#583a2c':'#41324b',c.rare?'#ffe2a6':'#c6adf7',2.5);ctx.shadowBlur=0;ctx.fillStyle=c.rare?'#ffdc92':'#c69aff';ctx.fillRect(-3,-12,6,26);circle(0,0,4,'#19121f');ctx.restore()}
 for(let l of g.lightningBolts){if(!vis(l.points[0].x,l.points[0].y,650))continue;ctx.save();ctx.globalAlpha=clamp(l.ttl/l.max,0,1);ctx.lineJoin='round';ctx.lineCap='round';ctx.beginPath();l.points.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.strokeStyle='#6bbaff';ctx.lineWidth=low?3:6;ctx.stroke();ctx.strokeStyle='#e6f8ff';ctx.lineWidth=1.7;ctx.stroke();ctx.restore()}
 for(let r of g.rings){if(!vis(r.x,r.y,r.r))continue;let progress=r.t/r.life;ctx.save();ctx.globalAlpha=1-progress;circle(r.x,r.y,r.r*(.15+progress*.85),null,r.color,Math.max(1,6*(1-progress)));ctx.restore()}
 let onscreen=g.enemies.filter(e=>vis(e.x,e.y,e.r+20)).sort((a,b)=>a.y-b.y);for(let e of onscreen)enemyShape(e,g.anim,low);
 if(g.boss&&vis(g.boss.x,g.boss.y,150))bossShape(g.boss,g.anim,low);
 for(let b of g.projectiles){if(!vis(b.x,b.y))continue;if(!low){ctx.shadowColor=b.color;ctx.shadowBlur=12}circle(b.x,b.y,b.r,b.color,'#ffe3c7',1);ctx.shadowBlur=0}
 for(let b of g.enemyShots){if(!vis(b.x,b.y))continue;circle(b.x,b.y,b.r,'#ed5e59','#ffb584',1);circle(b.x,b.y,2,'#fff2a7')}
 if(g.timeStop>0){ctx.save();ctx.globalAlpha=.2;circle(g.player.x,g.player.y,140,'#9f76ff','#dec6ff',2);ctx.restore()}
 drawWeaponEffects(g,low);playerShape(g,low);
 if(!low)for(let p of g.particles){if(!vis(p.x,p.y))continue;ctx.save();ctx.globalAlpha=clamp(p.ttl/p.max,0,1);circle(p.x,p.y,p.r,p.color);ctx.restore()}
 ctx.restore();
 // Subtle vignette and feedback overlay.
 if(g.player.hit>0){ctx.fillStyle=`rgba(230,38,52,${g.player.hit*.34})`;ctx.fillRect(0,0,vw,vh)}
 if(g.timeStop>0){ctx.strokeStyle='#aa8bff85';ctx.lineWidth=6;ctx.strokeRect(4,4,vw-8,vh-8)}
 if(g.demonTime>0){ctx.strokeStyle='#f4664b65';ctx.lineWidth=8;ctx.strokeRect(0,0,vw,vh)}
}
let menuClock=0;
function drawIntro(dt){menuClock+=dt;terrain(Math.sin(menuClock*.1)*35,Math.cos(menuClock*.1)*25,menuClock,true);
 let t=menuClock;ctx.save();ctx.translate(vw*.5,vh*.51);
 let rr=Math.min(vw*.36,vh*.31,240);
 let gr=ctx.createRadialGradient(0,0,5,0,0,rr*1.5);gr.addColorStop(0,'#b62e2751');gr.addColorStop(.55,'#742d2e2d');gr.addColorStop(1,'transparent');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,0,rr*1.5,0,TAU);ctx.fill();ctx.rotate(t*.065);drawRune(0,0,rr*.85,'#bd5b5b77',t*.02);ctx.rotate(-t*.13);drawRune(0,0,rr*.52,'#c69a6955',-t*.02);ctx.restore();
 // Ash drifting behind menu.
 for(let j=0;j<28;j++){let a=j*2.399,x=((j*63.7+Math.sin(a)*vw*.3+menuClock*(5+j%5))%vw+vw)%vw,y=((j*91.3-menuClock*(11+j%4))%vh+vh)%vh;circle(x,y,1+(j%3)*.5,'#dc90635a')}
}
function frame(ms){let dt=Math.min(.035,Math.max(.001,(ms-lastFrame)/1000||.016));lastFrame=ms;frameAvg=frameAvg*.97+dt*1000*.03;ctx.setTransform(dpr,0,0,dpr,0,0);if(game){if(screen==='playing')game.update(dt);drawWorld(game)}else drawIntro(dt);requestAnimationFrame(frame)}
menu();requestAnimationFrame(frame);
// PWA is optional when opened as a local file; normal game still works on file://.
if('serviceWorker' in navigator&&['https:','http:'].includes(location.protocol)){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(e=>console.warn('PWA indisponível',e)))}
