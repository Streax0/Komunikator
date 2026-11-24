
/* ---------- Card data: name, strength, row (0 close, 1 ranged, 2 siege, -1 special), ability, hero, copies ---------- */
const POOL=[
['Geralt of Rivia',15,0,'',1,1],['Ciri',15,0,'',1,1],['Triss Merigold',7,0,'',1,1],['Yennefer',7,1,'medic',1,1],
['Vernon Roche',10,0,'',1,1],['Philippa Eilhart',10,1,'',1,1],
['Blue Stripes Commando',4,0,'bond',0,3],['Poor Infantry',1,0,'bond',0,3],
['Crinfrid Dragon Hunter',5,1,'bond',0,3],['Catapult',8,2,'bond',0,2],
['Siege Expert',1,2,'morale',0,3],['Dun Banner Medic',5,2,'medic',0,1],
['Dandelion',2,0,'horn',0,1],['Dijkstra',4,0,'spy',0,1],['Thaler',1,2,'spy',0,1],
['Ghoul',1,0,'muster',0,3],['Keira Metz',5,1,'',0,1],['Sheldon Skaggs',4,1,'',0,1],
['Dethmold',6,1,'',0,1],['Ballista',6,2,'',0,1],['Trebuchet',6,2,'',0,2],
['Foot Soldier',1,0,'',0,2],['Siege Tower',6,2,'',0,1],['Sabrina Glevissig',4,1,'',0,1],
["Commander's Horn",0,-1,'horn_c',0,2],['Scorch',0,-1,'scorch',0,1],['Decoy',0,-1,'decoy',0,2],
['Biting Frost',0,-1,'frost',0,1],['Impenetrable Fog',0,-1,'fog',0,1],['Torrential Rain',0,-1,'rain',0,1],['Clear Weather',0,-1,'clear',0,1]];
const WE=['frost','fog','rain','clear'], ICON=['⚔️','🏹','💣'], WNAME=['Frost (close)','Fog (ranged)','Rain (siege)'];
const AB={spy:'Spy',medic:'Medic',bond:'Bond',morale:'Morale +1',horn:'Horn',muster:'Muster',horn_c:'Horn',scorch:'Scorch',decoy:'Decoy',frost:'Frost',fog:'Fog',rain:'Rain',clear:'Clear'};
const TIP={spy:'Spy: placed on the opponent\'s side, you draw 2 cards.',medic:'Medic: revives the best unit from your graveyard.',bond:'Tight Bond: strength multiplies by the number of identical cards in the row.',morale:'Morale: +1 to every other unit in the row.',horn:'Horn: doubles other units in this row.',muster:'Muster: plays every copy from your hand and deck.',horn_c:'Commander\'s Horn: doubles your strongest-benefiting row.',scorch:'Scorch: destroys the strongest non-hero unit(s) on the whole board.',decoy:'Decoy: swap with one of your units, returning it to hand.',frost:'Sets close rows to strength 1.',fog:'Sets ranged rows to strength 1.',rain:'Sets siege rows to strength 1.',clear:'Removes all weather.'};

const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
let uid=0;
const buildPool=()=>POOL.flatMap(([n,s,r,a,h,k])=>Array.from({length:k},()=>({id:uid++,n,s,r,a,h,t:r<0?(WE.includes(a)?'w':'x'):'u'})));
const nm=s=>s?'Opponent':'You';
let G;

/* ---------- Setup ---------- */
function newGame(){
  G={p:[0,1].map(()=>{const d=shuffle(buildPool());return{hand:d.splice(0,10),deck:d.slice(0,18),grave:[],b:[[],[],[]],H:[0,0,0],lives:2,pass:false}}),
     W:[0,0,0],turn:Math.random()<.5?0:1,round:1,mode:null,over:false,busy:false,banner:'',warn:'',log:['A new game begins. Best of three rounds.']};
  render();
  if(G.turn===1)setTimeout(aiMove,1100);
}
const log=m=>{G.log.push(m);if(G.log.length>30)G.log.shift()};

/* ---------- Scoring ---------- */
function val(s,r,c){
  if(c.h)return c.s;
  const P=G.p[s],row=P.b[r];let v=G.W[r]?1:c.s;
  if(c.a==='bond')v*=row.filter(x=>x.n===c.n).length;
  v+=row.filter(x=>x.a==='morale'&&x!==c).length;
  if(P.H[r]||row.some(x=>x.a==='horn'&&x!==c))v*=2;
  return v;
}
const rowSc=(s,r)=>G.p[s].b[r].reduce((t,c)=>t+val(s,r,c),0);
const tot=s=>rowSc(s,0)+rowSc(s,1)+rowSc(s,2);

function draw(s,n){const P=G.p[s];while(n--&&P.deck.length)P.hand.push(P.deck.pop())}
function hornRow(s){
  let best=0,bv=-1;
  for(let r=0;r<3;r++){if(G.p[s].H[r])continue;
    const v=G.p[s].b[r].filter(c=>!c.h).reduce((t,c)=>t+val(s,r,c),0);
    if(v>bv){bv=v;best=r}}
  return best;
}
function scorchList(){
  const L=[];
  for(const s of[0,1])for(let r=0;r<3;r++)for(const c of G.p[s].b[r])if(!c.h)L.push({s,r,c,v:val(s,r,c)});
  const M=Math.max(0,...L.map(x=>x.v));
  return M>=1?L.filter(x=>x.v===M):[];
}

/* ---------- Playing cards ---------- */
function deploy(s,c){
  const P=G.p[s],O=G.p[1-s];
  if(c.a==='spy'){O.b[c.r].push(c);draw(s,2);log(`${nm(s)} drew 2 cards from the spy.`)}
  else P.b[c.r].push(c);
  if(c.a==='medic'){
    const g=P.grave.filter(x=>x.t==='u'&&!x.h).sort((a,b)=>b.s-a.s)[0];
    if(g){P.grave.splice(P.grave.indexOf(g),1);log(`${nm(s)} revives ${g.n}.`);deploy(s,g)}
  }
  if(c.a==='muster'){
    for(const z of[P.hand,P.deck])for(let i=z.length-1;i>=0;i--)if(z[i].n===c.n)P.b[c.r].push(z.splice(i,1)[0]);
  }
}
function play(s,i){
  const P=G.p[s],c=P.hand.splice(i,1)[0];
  log(`${nm(s)} plays ${c.n}.`);
  if(c.t==='u')deploy(s,c);
  else{
    if(c.t==='w'){if(c.a==='clear')G.W=[0,0,0];else G.W[WE.indexOf(c.a)]=1}
    else if(c.a==='horn_c')P.H[hornRow(s)]=1;
    else if(c.a==='scorch')scorchList().forEach(x=>{const o=G.p[x.s];o.b[x.r].splice(o.b[x.r].indexOf(x.c),1);o.grave.push(x.c);log(`${x.c.n} is destroyed.`)});
    P.grave.push(c);
  }
  next(s);
}
function doPass(s){G.p[s].pass=true;log(`${nm(s)} passes.`);next(s)}

function next(s){
  const P=G.p[s],O=G.p[1-s];
  if(!P.hand.length&&!P.pass){P.pass=true;log(`${nm(s)} ran out of cards and passes.`)}
  if(P.pass&&O.pass)return endRound();
  G.turn=O.pass?s:1-s;
  render();
  if(G.turn===1)setTimeout(aiMove,1100);
}

function endRound(){
  const a=tot(0),b=tot(1),w=a>b?0:b>a?1:-1;
  G.busy=true;
  G.banner=(w<0?'Round drawn':w?'Opponent wins the round':'You win the round')+` (${a} : ${b})`;
  log(`Round ${G.round}: ${a} to ${b}. ${w<0?'Draw':w?'Opponent wins':'You win'}.`);
  if(w<0)G.p.forEach(p=>p.lives--);else G.p[1-w].lives--;
  render();
  setTimeout(()=>{
    G.p.forEach(p=>{p.b.forEach(r=>p.grave.push(...r.splice(0)));p.H=[0,0,0];p.pass=false});
    G.W=[0,0,0];G.busy=false;G.banner='';
    const d=G.p.map(p=>p.lives<=0);
    if(d[0]||d[1]){G.over=true;G.result=d[0]&&d[1]?'Draw':d[0]?'Defeat':'Victory';return render()}
    G.round++;
    if(w>=0){draw(w,1);G.turn=w;log(`${nm(w)} draws a card for winning.`)}else G.turn=G.round%2?0:1;
    if(!G.p[G.turn].hand.length)return doPass(G.turn);
    render();
    if(G.turn===1)setTimeout(aiMove,1100);
  },2800);
}

/* ---------- Human input ---------- */
function humanPlay(i){
  if(G.busy||G.over||G.turn!==0||G.p[0].pass)return;
  G.warn='';
  if(G.mode!==null){const was=G.mode;G.mode=null;if(was===i)return render()}
  const c=G.p[0].hand[i];if(!c)return;
  if(c.a==='decoy'){
    if(!G.p[0].b.some(r=>r.some(x=>!x.h))){G.warn='You have no unit to swap with the Decoy.';return render()}
    G.mode=i;return render();
  }
  play(0,i);
}
function decoyPick(r,i){
  const P=G.p[0],t=P.b[r][i];if(!t||t.h||G.mode===null)return;
  const d=P.hand[G.mode];P.b[r].splice(i,1);P.hand[G.mode]=t;P.grave.push(d);G.mode=null;
  log(`You swap ${t.n} back to your hand with a Decoy.`);next(0);
}

/* ---------- Opponent AI ---------- */
function gain(c){
  const P=G.p[1];
  if(c.t==='u'){
    if(c.a==='spy')return -c.s;
    let g=c.s;
    if(c.a==='medic')g+=Math.max(0,...P.grave.filter(x=>x.t==='u'&&!x.h).map(x=>x.s));
    if(c.a==='muster')g=c.s*(1+[...P.hand,...P.deck].filter(x=>x.n===c.n).length);
    return g;
  }
  if(c.a==='scorch')return scorchList().reduce((t,x)=>t+(x.s?-x.v:x.v),0);
  const adv=tot(1)-tot(0),oW=G.W.slice(),oH=P.H.slice();
  if(c.t==='w'){if(c.a==='clear')G.W=[0,0,0];else G.W[WE.indexOf(c.a)]=1}else P.H[hornRow(1)]=1;
  const g=tot(1)-tot(0)-adv;G.W=oW;P.H=oH;return g;
}
function aiMove(){
  const P=G.p[1],O=G.p[0];
  if(G.over||G.busy||G.turn!==1)return;
  if(!P.hand.length)return doPass(1);
  const adv=tot(1)-tot(0);
  const hs=P.hand.map((c,i)=>({c,i,g:gain(c)})).filter(x=>x.c.a!=='decoy');
  if(O.pass){
    if(adv>0)return doPass(1);
    const need=-adv+1,ok=hs.filter(x=>x.g>=need).sort((a,b)=>a.g-b.g)[0];
    if(ok)return play(1,ok.i);
    const sum=hs.reduce((t,x)=>t+Math.max(0,x.g),0);
    if(sum>=need)return play(1,hs.sort((a,b)=>b.g-a.g)[0].i);
    return doPass(1);
  }
  if(adv>(G.round===1?10:16)&&P.hand.length<=O.hand.length+2)return doPass(1);
  if(adv<-12&&P.lives===2&&P.hand.length<=O.hand.length-2)return doPass(1);
  const sp=hs.find(x=>x.c.a==='spy');if(sp)return play(1,sp.i);
  const big=hs.filter(x=>x.c.t!=='u'&&x.g>=8).sort((a,b)=>b.g-a.g)[0];if(big)return play(1,big.i);
  const un=hs.filter(x=>x.c.t==='u'&&!x.c.h).sort((a,b)=>a.g-b.g)[0];if(un)return play(1,un.i);
  const he=hs.filter(x=>x.c.h).sort((a,b)=>a.g-b.g)[0];if(he)return play(1,he.i);
  doPass(1);
}

/* ---------- Rendering ---------- */
function cardH(c,v,attrs='',cls=''){
  const vc=c.t!=='u'||c.h?'':v>c.s?'up':v<c.s?'down':'';
  const lab=(c.t==='u'?ICON[c.r]+' ':'')+(AB[c.a]||'');
  return `<div class="card ${c.t} r${c.r} ${c.h?'hero':''} ${cls}" ${attrs} title="${c.n}${c.t==='u'?' ('+c.s+')':''}${TIP[c.a]?' - '+TIP[c.a]:''}">${c.t==='u'?`<b class="${vc}">${v}</b>`:''}<span>${c.n}</span><em>${lab}</em></div>`;
}
function rowH(s,r){
  const P=G.p[s];
  return `<div class="row ${G.W[r]?'w'+r:''}"><div class="rl">${ICON[r]}</div><div class="rs">${rowSc(s,r)}</div><div class="hs">${P.H[r]?'📯':''}</div><div class="cards">${
    P.b[r].map((c,i)=>cardH(c,val(s,r,c),s===0&&G.mode!==null&&!c.h?`data-a="dec" data-r="${r}" data-i="${i}"`:'',s===0&&G.mode!==null&&!c.h?'tgt':'')).join('')}</div></div>`;
}
function info(s){
  const P=G.p[s];
  return `<div class="pl ${G.turn===s&&!G.over?'act':''}"><h3><span>${nm(s)}</span><span>${'❤️'.repeat(Math.max(P.lives,0))}${'🖤'.repeat(2-Math.max(P.lives,0))}</span></h3><div class="big">${tot(s)}</div><small>🃏 ${P.hand.length} in hand · 📚 ${P.deck.length} in deck${P.pass?' · passed':''}</small></div>`;
}
function render(){
  const mine=G.turn===0&&!G.over&&!G.busy&&!G.p[0].pass;
  const status=G.warn||(G.mode!==null?'Decoy: click one of your units to take it back (click the Decoy again to cancel).':G.over?'':G.busy?'':G.p[0].pass?'You passed. The opponent is finishing the round.':mine?'Your turn. Click a card to play it.':'The opponent is thinking...');
  const wx=G.W.some(x=>x)?'☁️ '+G.W.map((x,i)=>x?WNAME[i]:'').filter(Boolean).join(', '):'☀️ Clear skies';
  $app.className=mine?'':'off';
  $app.innerHTML=`<aside><h1>Gwent</h1>${info(1)}${info(0)}<div id="wx">${wx}</div>
    <div>Round ${G.round}</div>
    <button data-a="pass" ${mine?'':'disabled'}>Pass</button>
    <div id="log">${G.log.slice(-6).map(l=>`<div>${l}</div>`).join('')}</div>
    <details><summary>How to play</summary>
    <p>Win two of three rounds. Each turn, play one card or pass. Once both players pass, the higher total wins the round and the loser loses a life.</p>
    <p>Gold-edged cards are heroes: no weather, boosts or Scorch affect them. Hover any card for its ability.</p></details></aside>
    <main><div class="board">${[2,1,0].map(r=>rowH(1,r)).join('')}<div class="mid"></div>${[0,1,2].map(r=>rowH(0,r)).join('')}</div>
    <div id="status">${status}</div>
    <div id="hand">${G.p[0].hand.map((c,i)=>cardH(c,c.s,`data-a="play" data-i="${i}"`,G.mode===i?'sel':'')).join('')}</div></main>
    ${G.banner?`<div class="ov"><div>${G.banner}</div></div>`:''}
    ${G.over?`<div class="ov"><div><h2>${G.result}</h2>${G.result==='Victory'?'The Wild Hunt retreats.':G.result==='Defeat'?'The opponent takes the table.':'Neither side yields.'}<br><br><button data-a="again">Play again</button></div></div>`:''}`;
}
const $app=document.getElementById('app');
$app.addEventListener('click',e=>{
  const el=e.target.closest('[data-a]');if(!el)return;
  const a=el.dataset.a;
  if(a==='play')humanPlay(+el.dataset.i);
  else if(a==='dec')decoyPick(+el.dataset.r,+el.dataset.i);
  else if(a==='pass'){if(G.turn===0&&!G.busy&&!G.over&&!G.p[0].pass){G.mode=null;G.warn='';doPass(0)}}
  else if(a==='again')newGame();
});
newGame();