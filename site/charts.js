// Same drawing functions and data as film/index.html; selection is user-controlled.
const canvas=document.querySelector('#chart'),g=canvas.getContext('2d'),bg=document.createElement('canvas');bg.width=1020;bg.height=800;const b=bg.getContext('2d');
const C=['#8be7cf','#b7a3ed','#83b7e9','#e8c38e'],WHITE='#edf1f3',MUTED='#a0aab9';
let mode=0,selection=[3,-1,1,0,2],goal=72,started=0,elapsed=2,raf=0,ready=false;
const grain=document.createElement('canvas');grain.width=grain.height=128;const ng=grain.getContext('2d'),nd=ng.createImageData(128,128);let seed=7351;for(let i=0;i<nd.data.length;i+=4){seed=(1664525*seed+1013904223)>>>0;const v=seed>>>24;nd.data[i]=nd.data[i+1]=nd.data[i+2]=v;nd.data[i+3]=255;}ng.putImageData(nd,0,0);const grainPattern=g.createPattern(grain,'repeat');
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>1-Math.pow(1-clamp(x),4),lerp=(a,b,p)=>a+(b-a)*p;
function text(s,x,y,size=28,color=WHITE,align='left',serif=false,weight=500){g.fillStyle=color;g.font=serif?`italic ${size}px Georgia`:`${weight} ${size}px SC`;g.textAlign=align;g.textBaseline='middle';g.fillText(s,x,y)}
function rr(x,y,w,h,r=18,fill){g.beginPath();g.roundRect(x,y,w,h,r);if(fill){g.fillStyle=fill;g.fill()}}
function line(x,y,x2,y2,c='#ffffff18',w=1){g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.strokeStyle=c;g.lineWidth=w;g.stroke()}
function dot(x,y,r,c){g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fillStyle=c;g.fill()}
function pill(s,x,y,w=140,color=WHITE){rr(x,y,w,40,20,'#ffffff0d');g.strokeStyle='#ffffff16';g.lineWidth=1;g.stroke();text(s,x+w/2,y+20,18,color,'center')}
function background(t){
 b.fillStyle='#080b10';b.fillRect(0,0,1020,800);
 for(const[x,y,r,c]of [[420+20*Math.sin(t),250,430,'#275b5870'],[850,600,480,'#4d416c7a']]){let grad=b.createRadialGradient(x,y,0,x,y,r);grad.addColorStop(0,c);grad.addColorStop(1,c.slice(0,7)+'00');b.fillStyle=grad;b.fillRect(0,0,1020,800)}
 b.strokeStyle='#afcfe51c';b.lineWidth=2;for(let i=0;i<3;i++){b.beginPath();b.ellipse(680,370,180+i*80,420+i*45,-.72,0,Math.PI*2);b.stroke()}
 g.drawImage(bg,0,0);
}
function glass(){
 g.save();g.shadowColor='#00000080';g.shadowBlur=48;g.shadowOffsetY=28;rr(0,0,850,660,30,'#090d1380');g.restore();
 g.save();rr(0,0,850,660,30);g.clip();g.save();g.setTransform(1,0,0,1,0,0);g.filter='blur(26px)';g.drawImage(bg,0,0);g.restore();
 let fill=g.createLinearGradient(0,0,850,660);fill.addColorStop(0,'#ffffff0d');fill.addColorStop(.4,'#10151bb0');fill.addColorStop(1,'#141820bc');g.fillStyle=fill;g.fillRect(0,0,850,660);
 let sheen=g.createLinearGradient(0,0,850,660);sheen.addColorStop(0,'#d9f2ff0c');sheen.addColorStop(.46,'#ffffff00');sheen.addColorStop(1,'#cdbaff09');g.fillStyle=sheen;g.fillRect(0,0,850,660);g.globalAlpha=.045;g.fillStyle=grainPattern;g.fillRect(0,0,850,660);g.restore();
 let edge=g.createLinearGradient(0,0,850,660);edge.addColorStop(0,'#d2e8f94f');edge.addColorStop(.35,'#ffffff12');edge.addColorStop(.8,'#ffffff24');edge.addColorStop(1,'#d8c5ff38');rr(0,0,850,660,30);g.strokeStyle=edge;g.lineWidth=1.5;g.stroke();
 line(34,1,790,1,'#ffffff20');
}
function shell(label,value,unit=''){glass();text(label,42,46,23,MUTED);text(value,42,109,60,WHITE,'left',false,700);const tw=g.measureText(value).width;text(unit,60+tw,117,21,MUTED);pill('DEMO / 本月',655,33,151);line(42,160,808,160)}
function footer(left,right=''){line(42,570,808,570);text(left,42,615,22,MUTED);text(right,808,615,21,C[0],'right')}
function tooltip(s,x,y,w=142){rr(x,y,w,46,14,'#e7f1ef');text(s,x+w/2,y+23,20,'#132521','center')}
function cursor(){}
function funnel(u){
 shell('CONVERSION / 转化漏斗','15','% 总转化');const vals=[12000,7200,3600,1800],names=['访问','加购','结账','购买'];
 for(let i=0;i<4;i++){let p=ease((u+.08-i*.08)/.62),x=66+i*180,h=280*vals[i]/12000*p,next=280*vals[Math.min(3,i+1)]/12000*p;let grad=g.createLinearGradient(x,220,x+170,490);grad.addColorStop(0,C[i]+'e8');grad.addColorStop(1,C[i]+'88');
 g.beginPath();g.moveTo(x,355-h/2);g.lineTo(x+80,355-h/2);g.bezierCurveTo(x+120,355-h/2,x+130,355-next/2,x+174,355-next/2);g.lineTo(x+174,355+next/2);g.bezierCurveTo(x+130,355+next/2,x+120,355+h/2,x+80,355+h/2);g.lineTo(x,355+h/2);g.closePath();g.globalAlpha=selection[0]===i?1:.45;g.fillStyle=grad;g.fill();g.globalAlpha=1;g.strokeStyle=C[i]+'90';g.lineWidth=1.5;g.stroke();
 if(u>.45){rr(x+37,333,96,40,20,'#080d17ab');text([100,60,30,15][i]+'%',x+85,353,22,WHITE,'center')}
 rr(x,500,170,52,12,'#ffffff06');dot(x+17,519,4,C[i]);text(names[i],x+30,518,18,MUTED);text(vals[i].toLocaleString('en-US'),x+150,535,23,WHITE,'right',false,700);
 }
 footer(['访问 12,000','加购 7,200 · 上步转化 60%','结账 3,600 · 上步转化 50%','购买 1,800 · 上步转化 50%'][selection[0]],'总转化 15%');cursor(725,388,u);
}
function ribbon(x1,y1,x2,y2,h,c,alpha,p){g.save();g.globalAlpha=alpha;g.beginPath();g.rect(180,175,460*p,380);g.clip();g.beginPath();g.moveTo(x1,y1);g.bezierCurveTo(x1+210,y1,x2-210,y2,x2,y2);g.lineTo(x2,y2+h);g.bezierCurveTo(x2-210,y2+h,x1+210,y1+h,x1,y1+h);g.closePath();let grad=g.createLinearGradient(x1,0,x2,0);grad.addColorStop(0,c+'95');grad.addColorStop(1,c+'45');g.fillStyle=grad;g.fill();g.strokeStyle=c+'70';g.lineWidth=1;g.stroke();g.restore()}
function bez(a,b,c,d,t){return (1-t)**3*a+3*(1-t)**2*t*b+3*(1-t)*t*t*c+t**3*d}
function sankey(u){
 shell('TRAFFIC / 流量去向','100','千次');let p=ease((u+.1)/.75),focus=selection[1];
 const bands=[[220,220,100.8,0],[320.8,428,67.2,0],[428,320.8,67.2,1],[495.2,495.2,44.8,1]];
 for(const[y1,y2,h,c]of bands){let alpha=focus>=0&&c!==focus?.24:1;ribbon(214,y1,622,y2,h,C[c],alpha,p);if(u>.5){for(let k=0;k<3;k++){let q=((u*.24+k*.31+c*.17)%1)*p,x=bez(214,424,412,622,q),y=bez(y1+h/2,y1+h/2,y2+h/2,y2+h/2,q);g.globalAlpha=alpha;dot(x,y,2.5,C[c]);g.globalAlpha=1}}}
 for(let i=0;i<2;i++){let y=i?428:220,h=i?112:168;rr(196,y,18,h,9,C[i]);rr(622,y,18,h,9,'#c5d3dc6b');text(i?'社交':'搜索',172,y+38,25,focus>=0&&i!==focus?'#697383':WHITE,'right');text(i?'40':'60',172,y+72,23,C[i],'right');text(i?'购买':'阅读',660,y+38,25);text(i?'40%':'60%',660,y+74,27,C[i]);}
 footer(focus===0?'聚焦搜索：阅读 36 · 购买 24':focus===1?'聚焦社交：阅读 24 · 购买 16':'带宽表示数量，流入等于流出','100 → 100');cursor(256+150*ease((u-.65)/.5),285,u);
}
function arc(cx,cy,r,a1,a2,width,color){g.beginPath();g.arc(cx,cy,r,a1,a2);g.strokeStyle=color;g.lineWidth=width;g.lineCap='round';g.stroke()}
function rings(u){
 shell('PROJECT / 项目进度','3','个目标');const vals=[86,68,42],labels=['设计','开发','测试'],focus=selection[2],cx=296,cy=369;
 vals.forEach((v,i)=>{let r=151-i*39,p=ease((u+.12-i*.09)/.8);arc(cx,cy,r,-Math.PI/2,Math.PI*1.5,20,'#ffffff09');arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*v/100*p,20,i===focus?C[i]:C[i]+'60');let a=-Math.PI/2+Math.PI*2*v/100*p;dot(cx+Math.cos(a)*r,cy+Math.sin(a)*r,4,'#f4f8f5');let y=276+i*93;if(i===focus){rr(522,y-30,270,64,15,'#ffffff0c');g.strokeStyle=C[i]+'30';g.lineWidth=1;g.stroke()}dot(545,y,5,C[i]);text(labels[i],566,y,25,i===focus?WHITE:MUTED);text(v+'%',767,y,30,C[i],'right',false,700)});
 text(Math.round(vals[focus]*ease((u+.15)/.8))+'%',cx,360,53,WHITE,'center',false,700);text(labels[focus],cx,407,22,MUTED,'center');footer('每个圆环，独立的 100% 目标','多项进度');cursor(670,280+93*ease((u-.6)/.5),u);
}
function gauge(u){
 let p=ease((u+.06)/1),v=goal*p;shell('TARGET / 本月目标',Math.round(goal*10*p).toString(),'/ 1,000');let cx=425,cy=460,r=212;
 arc(cx,cy,r,Math.PI,Math.PI*2,35,'#ffffff0b');for(let i=0;i<10;i++){let a=Math.PI+i*Math.PI/10+.014,end=Math.min(Math.PI+(i+1)*Math.PI/10-.014,Math.PI+Math.PI*v/100);if(end>a)arc(cx,cy,r,a,end,35,i<5?C[0]:C[2])}
 for(let i=0;i<=10;i++){let a=Math.PI+i*Math.PI/10;line(cx+Math.cos(a)*245,cy+Math.sin(a)*245,cx+Math.cos(a)*(i%5?253:261),cy+Math.sin(a)*(i%5?253:261),'#cedae66a',2)}
 let a=Math.PI+Math.PI*v/100;line(cx+Math.cos(a)*146,cy+Math.sin(a)*146,cx+Math.cos(a)*194,cy+Math.sin(a)*194,'#e4f1ee',4);dot(cx+Math.cos(a)*194,cy+Math.sin(a)*194,4,'#f4faf8');text(Math.round(v)+'%',425,357,75,WHITE,'center',false,700);text('目标达成',425,415,23,MUTED,'center');text('0',197,506,22,MUTED,'center');text('100%',657,506,22,MUTED,'center');footer('已完成 '+(goal*10)+'  /  剩余 '+(1000-goal*10),'距目标 '+(100-goal)+'%');
}
const areaData=[[12,15,13,20,22,27],[8,11,10,14,17,19],[4,6,5,8,9,12]];
function area(u){
 const p=ease((u+.1)/.85),k=selection[4],sum=areaData.reduce((s,a)=>s+a[k],0);shell('CHANNELS / 渠道贡献',sum.toString(),'K 访问');
 const x=i=>100+i*132,y=v=>508-v/60*280;[0,20,40,60].forEach(v=>{line(100,y(v),760,y(v),'#ffffff10');text(v+'K',80,y(v),18,MUTED,'right')});
 g.save();g.beginPath();g.rect(90,200,690*p,320);g.clip();let base=[0,0,0,0,0,0];areaData.forEach((data,j)=>{let top=data.map((v,i)=>v+base[i]);g.beginPath();top.forEach((v,i)=>i?g.lineTo(x(i),y(v)):g.moveTo(x(i),y(v)));for(let i=5;i>=0;i--)g.lineTo(x(i),y(base[i]));g.closePath();let grad=g.createLinearGradient(0,215,0,510);grad.addColorStop(0,C[j]+'90');grad.addColorStop(1,C[j]+'22');g.fillStyle=grad;g.fill();g.beginPath();top.forEach((v,i)=>i?g.lineTo(x(i),y(v)):g.moveTo(x(i),y(v)));g.strokeStyle=C[j];g.lineWidth=2;g.stroke();base=top});g.restore();
 for(let i=0;i<6;i++)text('0'+(i+1),x(i),535,20,MUTED,'center');if(u>.75){line(x(k),200,x(k),508,'#e5f6f066',2);let total=0;areaData.forEach((a,j)=>{total+=a[k];dot(x(k),y(total),5,C[j])});tooltip('合计 '+sum+'K',Math.min(646,Math.max(72,x(k)-70)),Math.max(172,y(sum)-65),148);cursor(x(k)+9,y(sum)+20,u)}
 footer('直接 '+areaData[0][k]+'  /  搜索 '+areaData[1][k]+'  /  社交 '+areaData[2][k],'单位：千次');
}
const charts=[funnel,sankey,rings,gauge,area];
const info=[
 ['CONVERSION','Funnel','漏斗看转化','哪一步，人变少了？','滑过阶段，查看人数与转化。','12,000 → 7,200 → 3,600 → 1,800。','漏斗图，左右方向键选择阶段'],
 ['DESTINATION','Flow','流向看去处','从哪里来，往哪里去。','滑过来源或色带，隔离一组流向。','流入 100，流出 100。','桑基图，左右方向键选择来源'],
 ['PROGRESS','Rings','多环看进度','多个目标，各走多远。','触碰圆环或图例，聚焦一个目标。','各自以 100% 为目标，不是份额相加。','进度环，左右方向键切换设计、开发、测试'],
 ['GOAL','Gauge','仪表看达成','离目标，还差多少。','拖动滑块，或点按圆弧调整进度。','目标固定 1,000，数值和圆弧同步。','仪表盘，左右方向键每次调整百分之一'],
 ['COMPOSITION','Layers','面积看构成','总量变化，谁在推动？','沿月份移动，查看各渠道贡献。','同一刻度，三个渠道逐层相加。','堆叠面积图，左右方向键切换月份']
];
function readout(){let s='';
 if(mode===0)s=['访问 12,000 · 初始人数','加购 7,200 · 上步转化 60%','结账 3,600 · 上步转化 50%','购买 1,800 · 总转化 15%'][selection[0]];
 if(mode===1)s=selection[1]===-1?'全部来源 · 阅读 60% / 购买 40%':selection[1]===0?'搜索 60 → 阅读 36 / 购买 24':'社交 40 → 阅读 24 / 购买 16';
 if(mode===2)s=['设计 86%','开发 68%','测试 42%'][selection[2]]+' · 独立目标';
 if(mode===3)s='已完成 '+(goal*10)+' / 1,000 · 剩余 '+(1000-goal*10);
 if(mode===4){let k=selection[4];s='0'+(k+1)+' 月 · '+areaData.reduce((v,a)=>v+a[k],0)+'K 合计';}
 let out=document.querySelector('#readout');if(out.textContent!==s)out.textContent=s;
 document.querySelector('#goal-value').textContent=goal+'%';document.querySelector('#goal').value=goal;
}
function draw(){if(!ready)return;background(elapsed);g.save();g.translate(85,70);charts[mode](elapsed);g.restore();readout()}
function animate(now){elapsed=Math.min(2,(now-started)/1000);draw();if(elapsed<2)raf=requestAnimationFrame(animate);else raf=0;}
function replay(){cancelAnimationFrame(raf);if(matchMedia('(prefers-reduced-motion: reduce)').matches){elapsed=2;draw();return;}started=performance.now();raf=requestAnimationFrame(animate)}
function setMode(n){mode=n;document.querySelectorAll('[role=tab]').forEach((el,i)=>{el.setAttribute('aria-selected',String(n===i));el.tabIndex=n===i?0:-1});document.querySelector('#chart-panel').setAttribute('aria-labelledby','tab-'+n);['kicker','chart-title','chart-subtitle','description','instruction','data-note'].forEach((id,i)=>document.getElementById(id).textContent=info[n][i]);canvas.setAttribute('aria-label',info[n][6]);document.querySelector('#goal-control').hidden=n!==3;document.querySelector('#all-flows').hidden=n!==1;replay();readout()}
function step(delta){if(mode===3)goal=Math.max(0,Math.min(100,goal+delta));else if(mode===1){selection[1]=((selection[1]+1+delta+3)%3)-1;}else{let n=[4,0,3,0,6][mode];selection[mode]=(selection[mode]+delta+n)%n;}draw()}
function point(e){const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*1020/r.width-85,y=(e.clientY-r.top)*800/r.height-70;if(x<0||x>850||y<170||y>565)return;
 if(mode===0)selection[0]=Math.max(0,Math.min(3,Math.floor((x-66)/180)));
 if(mode===1){if(x<215)selection[1]=y<408?0:1;else if(x<=622){let lo=0,hi=1;for(let i=0;i<12;i++){let mid=(lo+hi)/2;if(bez(214,424,412,622,mid)<x)lo=mid;else hi=mid;}let q=(lo+hi)/2,cur=3*(1-q)*q*q+q**3;const bands=[[220,220,100.8,0],[320.8,428,67.2,0],[428,320.8,67.2,1],[495.2,495.2,44.8,1]];let hit=bands.findLast(([a,z,h])=>y>=a+(z-a)*cur&&y<=a+(z-a)*cur+h);if(hit)selection[1]=hit[3];}}
 if(mode===2){if(x>500)selection[2]=Math.max(0,Math.min(2,Math.round((y-276)/93)));else{let r=Math.hypot(x-296,y-369);if(r<58||r>171)return;selection[2]=Math.max(0,Math.min(2,Math.round((151-r)/39)));}}
 if(mode===3){if(e.type==='pointermove'&&!e.buttons)return;let dx=x-425,dy=y-460,r=Math.hypot(dx,dy);if(dy>0||r<120||r>280)return;goal=Math.round((Math.atan2(dy,dx)+Math.PI)/Math.PI*100);}
 if(mode===4)selection[4]=Math.max(0,Math.min(5,Math.round((x-100)/132)));
 draw();
}
canvas.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'||e.buttons)point(e)});canvas.addEventListener('pointerdown',e=>{point(e);canvas.focus({preventScroll:true})});canvas.addEventListener('keydown',e=>{const d={ArrowLeft:-1,ArrowRight:1,ArrowUp:1,ArrowDown:-1}[e.key];if(d!==undefined){e.preventDefault();step(d)}});
const tabs=[...document.querySelectorAll('[role=tab]')];tabs.forEach((el,i)=>{el.onclick=()=>setMode(i);el.onkeydown=e=>{let n=e.key==='ArrowRight'?(i+1)%5:e.key==='ArrowLeft'?(i+4)%5:e.key==='Home'?0:e.key==='End'?4:null;if(n!==null){e.preventDefault();setMode(n);tabs[n].focus()}}});
document.querySelector('#previous').onclick=()=>step(-1);document.querySelector('#next').onclick=()=>step(1);document.querySelector('#replay').onclick=replay;document.querySelector('#all-flows').onclick=()=>{selection[1]=-1;draw()};document.querySelector('#goal').oninput=e=>{goal=Number(e.target.value);draw()};
window.chartsReady=Promise.all([document.fonts.load('500 30px SC'),document.fonts.load('700 60px SC')]).then(()=>document.fonts.ready).then(()=>{ready=true;setMode(0)});
