import * as THREE from './vendor/three.module.js';

function softEdgeShape(width, depth, softness = .1) {
  const halfW=width/2,halfD=depth/2,r=Math.min(width,depth)*softness;
  const shape=new THREE.Shape();
  shape.moveTo(-halfW+r,-halfD);
  shape.bezierCurveTo(-halfW*.34,-halfD-r*.08,halfW*.22,-halfD+r*.04,halfW-r,-halfD);
  shape.quadraticCurveTo(halfW,-halfD,halfW,-halfD+r);
  shape.bezierCurveTo(halfW+r*.04,-halfD*.2,halfW-r*.04,halfD*.34,halfW,halfD-r);
  shape.quadraticCurveTo(halfW,halfD,halfW-r,halfD);
  shape.bezierCurveTo(halfW*.18,halfD+r*.06,-halfW*.24,halfD-r*.04,-halfW+r,halfD);
  shape.quadraticCurveTo(-halfW,halfD,-halfW,halfD-r);
  shape.bezierCurveTo(-halfW-r*.04,halfD*.18,-halfW+r*.04,-halfD*.22,-halfW,-halfD+r);
  shape.quadraticCurveTo(-halfW,-halfD,-halfW+r,-halfD);
  shape.closePath();return shape;
}

function mappedShapeGeometry(shape,width,depth,segments=12) {
  const geometry=new THREE.ShapeGeometry(shape,segments),position=geometry.attributes.position,uv=geometry.attributes.uv;
  for(let i=0;i<position.count;i++)uv.setXY(i,(position.getX(i)+width/2)/width,(position.getY(i)+depth/2)/depth);
  uv.needsUpdate=true;return geometry;
}

function softLayer(shape,material,thickness,y,bevel=.009) {
  const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:true,bevelSegments:3,bevelSize:bevel,bevelThickness:bevel,curveSegments:12}),material);
  mesh.rotation.x=-Math.PI/2;mesh.position.y=y;mesh.castShadow=true;mesh.receiveShadow=true;return mesh;
}

export function makeMapTexture() {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 400;
  const c = canvas.getContext('2d'); c.fillStyle = '#e7d5ad'; c.fillRect(0, 0, 512, 400);
  c.strokeStyle = 'rgba(49,95,120,.14)'; c.lineWidth = 2;
  for (let y = 28; y < 390; y += 25) { c.beginPath(); c.moveTo(0, y); c.bezierCurveTo(150, y - 7, 330, y + 8, 512, y - 3); c.stroke(); }
  c.save(); c.translate(176, 30); c.scale(1.06, 1.1);
  const outline=[[83,3],[113,14],[126,42],[155,57],[145,83],[171,109],[152,139],[163,165],[141,190],[132,228],[107,237],[100,275],[76,294],[65,270],[43,252],[37,222],[17,206],[25,179],[7,158],[25,131],[18,105],[42,86],[38,59],[62,44]];
  c.beginPath();c.moveTo(outline[0][0],outline[0][1]);for(const [x,y] of outline.slice(1))c.lineTo(x,y);c.closePath();c.fillStyle='#c4ad7f';c.fill();c.strokeStyle='#315b45';c.lineWidth=4;c.stroke();
  c.save();c.beginPath();c.moveTo(outline[0][0],outline[0][1]);for(const [x,y] of outline.slice(1))c.lineTo(x,y);c.closePath();c.clip();
  c.strokeStyle='rgba(49,91,69,.72)';c.lineWidth=1.45;c.lineCap='round';
  const borders=[[[62,44],[86,57],[123,55]],[[42,61],[76,71],[112,75],[145,82]],[[28,94],[73,102],[118,99],[156,105]],[[21,122],[62,130],[103,126],[151,137]],[[22,151],[64,156],[111,151],[160,163]],[[26,179],[64,181],[102,177],[142,188]],[[38,207],[78,208],[119,201]],[[49,235],[80,237],[110,228]],[[62,263],[89,267],[101,252]],[[58,62],[56,94],[67,125]],[[91,56],[92,87],[99,118],[96,151]],[[126,54],[120,88],[129,118],[121,148]],[[147,82],[139,105],[149,135],[141,163]],[[70,153],[77,183],[75,210]],[[110,151],[112,179],[105,205],[108,233]],[[136,163],[128,188],[132,218]],[[75,209],[95,220],[105,239]],[[113,228],[126,241],[126,260]],[[126,239],[148,238],[163,228]],[[142,187],[162,192],[175,204]],[[147,215],[165,211],[180,221]]];
  for(const line of borders){c.beginPath();c.moveTo(line[0][0],line[0][1]);for(const [x,y] of line.slice(1))c.lineTo(x,y);c.stroke();}
  c.fillStyle='#315f78';c.font='bold 7px Arial';c.textAlign='center';c.textBaseline='middle';for(const [label,x,y] of [['RR',78,25],['AP',145,57],['AM',64,105],['PA',120,101],['AC',19,155],['RO',51,178],['TO',129,160],['MA',156,92],['PI',157,119],['CE',169,93],['RN',178,80],['PB',181,96],['PE',184,110],['AL',183,124],['SE',179,137],['BA',158,173],['MT',99,190],['GO',130,199],['DF',146,193],['MS',111,224],['MG',149,218],['ES',179,206],['RJ',168,230],['SP',144,244],['PR',145,260],['SC',134,276],['RS',117,289]])c.fillText(label,x,y);
  c.restore();
  c.fillStyle='rgba(63,143,160,.72)';c.beginPath();c.moveTo(138,86);c.lineTo(148,131);c.lineTo(144,174);c.lineTo(128,213);c.lineTo(115,236);c.lineTo(107,229);c.lineTo(120,185);c.lineTo(130,142);c.closePath();c.fill();
  c.fillStyle='#b96f53';c.beginPath();c.arc(130,190,7,0,Math.PI*2);c.fill();c.restore();
  c.strokeStyle='#b96f53';c.lineWidth=4;c.beginPath();c.arc(430,66,23,0,Math.PI*2);c.moveTo(430,34);c.lineTo(430,98);c.moveTo(398,66);c.lineTo(462,66);c.stroke();
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;return texture;
}

export function makeWindowArtTexture() {
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 520;
  const c = canvas.getContext('2d'); c.strokeStyle = 'rgba(49,91,69,.74)'; c.fillStyle = 'rgba(49,91,69,.68)'; c.lineWidth = 9; c.lineCap = 'round'; c.lineJoin = 'round';
  for (const side of [0, 1024]) {
    const dir = side === 0 ? 1 : -1; c.beginPath(); c.moveTo(side, 142); c.bezierCurveTo(side + dir * 70, 114, side + dir * 120, 100, side + dir * 170, 60); c.stroke();
    for (const [x, y, flip] of [[52, 122, 1], [100, 94, -1], [146, 61, 1]]) { c.beginPath(); c.ellipse(side + dir * x, y, 28, 12, flip * -.42, 0, Math.PI * 2); c.fill(); }
  }
  c.strokeStyle = 'rgba(63,143,160,.82)'; c.lineWidth = 11; c.beginPath(); c.moveTo(220, 486); c.bezierCurveTo(340, 462, 390, 502, 512, 480); c.bezierCurveTo(634, 458, 684, 501, 804, 478); c.stroke();
  c.strokeStyle = 'rgba(185,111,83,.72)'; c.lineWidth = 8; c.beginPath(); c.arc(512, 35, 34, 0, Math.PI); c.stroke();
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 8; return texture;
}

function makeCardTexture() {
  const canvas=document.createElement('canvas');canvas.width=384;canvas.height=480;const c=canvas.getContext('2d');
  c.fillStyle='#efe1c0';c.fillRect(0,0,384,480);c.strokeStyle='rgba(49,91,69,.45)';c.lineWidth=8;c.strokeRect(15,15,354,450);
  c.fillStyle='#d3a84f';c.beginPath();c.arc(280,110,35,0,Math.PI*2);c.fill();
  c.fillStyle='#315b45';c.beginPath();c.moveTo(40,310);c.bezierCurveTo(95,230,135,275,190,290);c.bezierCurveTo(240,220,290,255,345,300);c.lineTo(345,385);c.lineTo(40,385);c.closePath();c.fill();
  c.fillStyle='#3f8fa0';c.beginPath();c.moveTo(30,370);c.bezierCurveTo(95,335,140,390,200,360);c.bezierCurveTo(260,330,300,380,355,350);c.lineTo(355,430);c.lineTo(30,430);c.closePath();c.fill();
  c.fillStyle='#b96f53';c.beginPath();c.ellipse(180,210,63,26,0,0,Math.PI*2);c.fill();c.beginPath();c.moveTo(120,210);c.lineTo(82,180);c.lineTo(85,240);c.closePath();c.fill();
  c.fillStyle='#f5e7c7';c.beginPath();c.arc(215,205,5,0,Math.PI*2);c.fill();c.fillStyle='#315b45';c.font='bold 22px Georgia';c.textAlign='center';c.fillText('MEMÓRIA',192,77);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;return texture;
}
function makePlaqueTexture() {
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=190;const c=canvas.getContext('2d');
  const g=c.createLinearGradient(0,0,0,190);g.addColorStop(0,'#ddb06b');g.addColorStop(1,'#a96639');c.fillStyle=g;c.fillRect(0,0,512,190);
  for(let y=18;y<180;y+=24){c.strokeStyle='rgba(74,39,20,.20)';c.lineWidth=2;c.beginPath();c.moveTo(0,y);c.bezierCurveTo(150,y-7,320,y+8,512,y-4);c.stroke();}
  c.strokeStyle='#e4c78d';c.lineWidth=7;c.beginPath();c.moveTo(54,19);c.quadraticCurveTo(25,19,25,48);c.lineTo(25,141);c.quadraticCurveTo(25,171,54,171);c.lineTo(458,171);c.quadraticCurveTo(487,171,487,141);c.lineTo(487,48);c.quadraticCurveTo(487,19,458,19);c.closePath();c.stroke();c.fillStyle='#fff0cf';c.textAlign='center';c.font='bold 26px \"Bree Serif\"';c.fillText('INSTITUTO RAIZ',256,57);c.font='40px \"Origin Ethnic\"';c.fillText('CAIÇARA',256,112);c.font='16px \"Bree Serif\"';c.fillText('TERRITÓRIO · MEMÓRIA · COMUNIDADE',256,151);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;return texture;
}

export function makeTreasureMaterials(mapTexture) {
  return {
    canoe: new THREE.MeshStandardMaterial({ color: '#315f78', roughness: .66, metalness: .02 }),
    canoeInner: new THREE.MeshStandardMaterial({ color: '#c99858', roughness: .78 }),
    objectWood: new THREE.MeshStandardMaterial({ color: '#b66f3d', roughness: .77 }),
    net: new THREE.LineBasicMaterial({ color: '#d9c49a', transparent: true, opacity: .96 }),
    rope: new THREE.MeshStandardMaterial({ color: '#ba8b50', roughness: .92 }),
    ochre: new THREE.MeshStandardMaterial({ color: '#d3a84f', roughness: .62 }),
    mapPaper: new THREE.MeshStandardMaterial({ color: '#e7d5ad', roughness: .95, side: THREE.DoubleSide }),
    mapInk: new THREE.MeshStandardMaterial({ map: mapTexture, roughness: .95, side: THREE.DoubleSide }),
    fishTurquoise: new THREE.MeshStandardMaterial({ color: '#3f9eaa', roughness: .72, metalness: .01 }),
    fishTerracotta: new THREE.MeshStandardMaterial({ color: '#c76f43', roughness: .74, metalness: .01 }),
    scaleTurquoise: new THREE.MeshStandardMaterial({ color: '#e0bb63', roughness: .7 }),
    scaleOrange: new THREE.MeshStandardMaterial({ color: '#e4a34d', roughness: .72 }),
    fishFin: new THREE.MeshStandardMaterial({ color: '#315f78', roughness: .73 }),
    fishFinWarm: new THREE.MeshStandardMaterial({ color: '#b96f53', roughness: .73 }),
    fishEye: new THREE.MeshStandardMaterial({ color: '#392b20', roughness: .52 }),
    fishEyeLight: new THREE.MeshStandardMaterial({ color: '#f2dfb8', roughness: .55 }),
    fishGroove: new THREE.LineBasicMaterial({ color: '#28747d', transparent: true, opacity: .8 }),
    cardPaper: new THREE.MeshStandardMaterial({ color: '#ead8b1', roughness: .92, side: THREE.DoubleSide }),
    cardArt: new THREE.MeshStandardMaterial({ color: '#fff1d2', roughness: .88, map: makeCardTexture(), side: THREE.DoubleSide }),
    compassMetal: new THREE.MeshStandardMaterial({ color: '#70563a', roughness: .48, metalness: .54 }),
    compassFace: new THREE.MeshStandardMaterial({ color: '#ead8b1', roughness: .84 }),
    basketFiber: new THREE.MeshStandardMaterial({ color: '#bf9557', roughness: .96 }),
    leaf: new THREE.MeshStandardMaterial({ color: '#54774d', roughness: .84, side: THREE.DoubleSide }),
    leafLight: new THREE.MeshStandardMaterial({ color: '#95a96a', roughness: .86, side: THREE.DoubleSide }),
    crabShell: new THREE.MeshStandardMaterial({ color: '#c8754e', roughness: .7 }),
    plaqueFace: new THREE.MeshStandardMaterial({ color: '#fff0cf', roughness: .89, map: makePlaqueTexture() }),
    book: new THREE.MeshStandardMaterial({ color: '#315b45', roughness: .8 }),
    pages: new THREE.MeshStandardMaterial({ color: '#efe2c4', roughness: .9 }),
    letter: new THREE.MeshStandardMaterial({ color: '#f0dfb7', roughness: .94 }),
    letterFlap: new THREE.MeshStandardMaterial({ color: '#d9c49a', roughness: .94, side: THREE.DoubleSide }),
    seal: new THREE.MeshStandardMaterial({ color: '#b96f53', roughness: .54 }),
  };
}

function makeFish(materials, warm = false) {
  const group = new THREE.Group(), bodyMat = warm ? materials.fishTerracotta : materials.fishTurquoise, finMat = warm ? materials.fishFinWarm : materials.fishFin, scaleMat = warm ? materials.scaleOrange : materials.scaleTurquoise;
  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), bodyMat); body.scale.set(.47, .205, .20); body.position.y = .235; group.add(body);
  const makeFin = (points, material, z = 0) => { const shape = new THREE.Shape(); shape.moveTo(points[0][0], points[0][1]); for (const [x,y] of points.slice(1)) shape.lineTo(x,y); shape.closePath(); const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.045,bevelEnabled:true,bevelSegments:3,bevelSize:.018,bevelThickness:.012,curveSegments:10}),material); mesh.position.z=z; mesh.castShadow=true; group.add(mesh); return mesh; };
  makeFin([[-.34,.23],[-.65,.39],[-.57,.23],[-.66,.08],[-.34,.17]], finMat, -.02);
  makeFin([[-.12,.37],[.02,.52],[.23,.42],[.34,.35],[.06,.37]], warm ? materials.scaleOrange : materials.scaleTurquoise, -.012);
  makeFin([[-.03,.12],[.12,.015],[.26,.13],[.1,.16]], finMat, -.01);
  const pectoral = makeFin([[.03,.23],[.24,.29],[.17,.10]], warm ? materials.scaleOrange : materials.scaleTurquoise, .12); pectoral.rotation.y = -.28;
  const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(.039,14,10),materials.fishEyeLight); eyeWhite.position.set(.29,.28,.178); group.add(eyeWhite);
  const eye = new THREE.Mesh(new THREE.SphereGeometry(.019,12,8),materials.fishEye); eye.position.set(.30,.282,.208); group.add(eye);
  const gill = new THREE.Mesh(new THREE.TorusGeometry(.088,.012,6,24,Math.PI*1.25),materials.ochre); gill.position.set(.16,.235,.183); gill.rotation.z=.25; group.add(gill);
  for (let row=0;row<4;row++) for (let col=0;col<7;col++) { const x=-.27+col*.085+(row%2)*.035,z=-.135+row*.085,inside=1-(x/.47)**2-(z/.20)**2; if(inside<=.07)continue; const scale=new THREE.Mesh(new THREE.SphereGeometry(.052,10,8),scaleMat); scale.scale.set(.76,.12,.58); scale.position.set(x,.235+.205*Math.sqrt(inside)+.004,z); group.add(scale); }
  for(const x of [-.18,-.07,.04]) { const pts=[new THREE.Vector3(x,.40,-.02),new THREE.Vector3(x+.055,.43,-.02),new THREE.Vector3(x+.11,.40,-.02)]; const groove=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),materials.fishGroove); group.add(groove); }
  return group;
}

function makeCanoe(materials) {
  const group = new THREE.Group(), hull = new THREE.Group(); hull.rotation.x = -Math.PI / 2;
  const shape = new THREE.Shape(); shape.moveTo(-.72, 0); shape.quadraticCurveTo(-.5, -.18, 0, -.17); shape.quadraticCurveTo(.5, -.18, .72, 0); shape.quadraticCurveTo(.5, .16, 0, .12); shape.quadraticCurveTo(-.5, .16, -.72, 0); shape.closePath();
  const hullMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: .1, bevelEnabled: true, bevelSegments: 3, bevelSize: .025, bevelThickness: .022, curveSegments: 16 }), materials.canoe); hullMesh.castShadow = true; hull.add(hullMesh);
  const inner = new THREE.Mesh(new THREE.ShapeGeometry(shape), materials.canoeInner); inner.position.z = .106; hull.add(inner); group.add(hull);
  for (const x of [-.38, 0, .38]) { const seat = new THREE.Mesh(new THREE.BoxGeometry(.07, .045, .28), materials.objectWood); seat.position.set(x, .09, 0); group.add(seat); }
  const trim = new THREE.Mesh(new THREE.TorusGeometry(.085, .014, 6, 20), materials.ochre); trim.rotation.y = Math.PI / 2; trim.position.set(-.67, .09, 0); group.add(trim);
  return group;
}

function makeFishingNet(materials) {
  const group = new THREE.Group(), points = [], cols = 10, rows = 7;
  const pointAt = (u, v) => new THREE.Vector3(u * .48, .025 + Math.abs(u) * .17 + Math.abs(v) * .12, v * .32);
  for (let row = 0; row <= rows; row++) {
    const v = -1 + row * 2 / rows;
    for (let col = 0; col <= cols; col++) {
      const u = -1 + col * 2 / cols, p = pointAt(u, v);
      if (col < cols) points.push(p, pointAt(u + 2 / cols, v));
      if (row < rows) points.push(p, pointAt(u, v + 2 / rows));
    }
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points), mesh = new THREE.LineSegments(geometry, materials.net); group.add(mesh);
  const ropePoints = Array.from({ length: 9 }, (_, i) => pointAt(-1 + i / 4, -1));
  const rope = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ropePoints), 18, .018, 6, false), materials.rope); group.add(rope);
  for (const i of [-4, -2, 0, 2, 4]) { const bead = new THREE.Mesh(new THREE.SphereGeometry(.045, 10, 8), materials.ochre); bead.position.copy(pointAt(i / 4, -1)); group.add(bead); }
  return group;
}

function makeMapObject(materials) {
  const group=new THREE.Group();
  group.add(softLayer(softEdgeShape(.94,.76,.16),materials.mapPaper,.026,.018,.012));
  const ink=new THREE.Mesh(mappedShapeGeometry(softEdgeShape(.86,.67,.15),.86,.67,14),materials.mapInk);ink.rotation.x=-Math.PI/2;ink.position.y=.059;ink.castShadow=false;group.add(ink);
  for(const z of [-.34,.34]){const roller=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.94,16),materials.objectWood);roller.rotation.z=Math.PI/2;roller.position.set(0,.045,z);group.add(roller);}
  return group;
}

function makeFishObject(materials,warm=false) { const group=new THREE.Group(),fish=makeFish(materials,warm);fish.rotation.y=warm?.08:-.06;group.add(fish);return group; }

function makeIllustratedCards(materials) {
  const group=new THREE.Group();
  for(let i=0;i<3;i++){
    const card=new THREE.Group();card.position.set((i-1)*.10,i*.025,(1-i)*.075);card.rotation.y=(i-1)*-.13;card.rotation.z=(i-1)*.018;
    card.add(softLayer(softEdgeShape(.58,.70,.18),materials.cardPaper,.034,.012,.012));
    const art=new THREE.Mesh(mappedShapeGeometry(softEdgeShape(.53,.64,.18),.53,.64,14),materials.cardArt);art.rotation.x=-Math.PI/2;art.position.y=.061;art.castShadow=false;card.add(art);
    group.add(card);
  }return group;
}

function makeCompass(materials) {
  const group=new THREE.Group();const body=new THREE.Mesh(new THREE.CylinderGeometry(.23,.21,.09,32),materials.compassMetal);body.position.y=.07;group.add(body);const face=new THREE.Mesh(new THREE.CylinderGeometry(.19,.19,.018,32),materials.compassFace);face.position.y=.125;group.add(face);const rim=new THREE.Mesh(new THREE.TorusGeometry(.205,.018,8,32),materials.ochre);rim.rotation.x=Math.PI/2;rim.position.y=.13;group.add(rim);
  const needleShape=new THREE.Shape();needleShape.moveTo(0,.16);needleShape.lineTo(.045,0);needleShape.lineTo(0,-.16);needleShape.lineTo(-.045,0);needleShape.closePath();const needle=new THREE.Mesh(new THREE.ShapeGeometry(needleShape),materials.fishFin);needle.rotation.x=-Math.PI/2;needle.position.y=.15;group.add(needle);const south=new THREE.Mesh(new THREE.ShapeGeometry(needleShape),materials.seal);south.rotation.set(-Math.PI/2,0,Math.PI);south.position.y=.151;group.add(south);const pin=new THREE.Mesh(new THREE.SphereGeometry(.025,12,8),materials.iron||materials.compassMetal);pin.position.y=.17;group.add(pin);return group;
}

function makeBasket(materials) {
  const group=new THREE.Group();const body=new THREE.Mesh(new THREE.CylinderGeometry(.19,.12,.2,16,1,true),materials.basketFiber);body.position.y=.115;group.add(body);const bottom=new THREE.Mesh(new THREE.CircleGeometry(.12,20),materials.rope);bottom.rotation.x=-Math.PI/2;bottom.position.y=.02;group.add(bottom);
  for(const y of [.045,.09,.135,.18,.22]){const ring=new THREE.Mesh(new THREE.TorusGeometry(y===.22?.19:.12+(y-.02)*.34,.014,6,24),materials.ochre);ring.rotation.x=Math.PI/2;ring.position.y=y;group.add(ring);}
  for(let i=0;i<12;i++){const a=i*Math.PI/6,pts=[new THREE.Vector3(.125*Math.cos(a),.025,.125*Math.sin(a)),new THREE.Vector3(.15*Math.cos(a),.10,.15*Math.sin(a)),new THREE.Vector3(.19*Math.cos(a),.22,.19*Math.sin(a))];group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),10,.009,5,false),materials.basketFiber));}return group;
}

function makeCrab(materials) {
  const group=new THREE.Group();const shell=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),materials.crabShell);shell.scale.set(.22,.09,.16);shell.position.y=.105;group.add(shell);const belly=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),materials.ochre);belly.scale.set(.17,.035,.12);belly.position.y=.07;group.add(belly);
  for(let side of [-1,1])for(let i=0;i<4;i++){const x=side*(.12+i*.025),z=(i-1.5)*.075,pts=[new THREE.Vector3(side*.14,.09,z*.5),new THREE.Vector3(side*.24,.045,z),new THREE.Vector3(side*(.29+i*.018),.025,z*1.25)];group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),8,.012,5,false),materials.seal));}
  for(let side of [-1,1]){const arm=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(side*.13,.12,.08),new THREE.Vector3(side*.24,.17,.15),new THREE.Vector3(side*.28,.2,.17)]),8,.018,6,false),materials.seal);group.add(arm);const claw=new THREE.Mesh(new THREE.SphereGeometry(.06,12,10),materials.ochre);claw.position.set(side*.29,.2,.17);claw.scale.set(1,.7,.8);group.add(claw);const eyeStem=new THREE.Mesh(new THREE.CylinderGeometry(.009,.013,.065,8),materials.objectWood);eyeStem.position.set(side*.085,.19,.07);group.add(eyeStem);const eye=new THREE.Mesh(new THREE.SphereGeometry(.025,10,8),materials.fishEye);eye.position.set(side*.085,.23,.07);group.add(eye);}return group;
}

function makeSprig(materials) {
  const group=new THREE.Group();const stem=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-.22,.02,0),new THREE.Vector3(-.05,.12,0),new THREE.Vector3(.12,.26,0),new THREE.Vector3(.28,.31,0)]),16,.012,6,false),materials.basketFiber);group.add(stem);
  for(const [x,y,z,rot,mat] of [[-.13,.11,-.02,-.65,materials.leaf],[.03,.2,.035,.5,materials.leafLight],[.11,.25,-.05,-.45,materials.leaf],[.25,.3,.03,.55,materials.leafLight],[.31,.32,-.04,-.4,materials.leaf]]){const leaf=new THREE.Mesh(new THREE.SphereGeometry(1,16,10),mat);leaf.scale.set(.11,.025,.055);leaf.position.set(x,y,z);leaf.rotation.y=rot;group.add(leaf);}return group;
}

function makePlaque(materials) {
  const group=new THREE.Group();group.add(softLayer(softEdgeShape(.84,.35,.2),materials.objectWood,.075,.018,.025));
  const face=new THREE.Mesh(mappedShapeGeometry(softEdgeShape(.75,.27,.2),.75,.27,14),materials.plaqueFace);face.rotation.x=-Math.PI/2;face.position.y=.122;group.add(face);
  for(const x of [-.32,.32]){const stud=new THREE.Mesh(new THREE.SphereGeometry(.022,10,8),materials.compassMetal);stud.position.set(x,.13,0);group.add(stud);}return group;
}

function makeBookObject(materials) {
  const group=new THREE.Group();
  for(const [y,tilt] of [[.005,-.08],[.145,.06]]){
    const book=new THREE.Group();book.position.set(tilt,y,0);book.rotation.y=tilt;
    book.add(softLayer(softEdgeShape(.68,.46,.17),materials.book,.035,.012,.012));
    book.add(softLayer(softEdgeShape(.59,.38,.16),materials.pages,.066,.037,.008));
    book.add(softLayer(softEdgeShape(.68,.46,.17),materials.book,.035,.091,.012));
    const spineCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.30,.07,-.18),new THREE.Vector3(-.33,.07,0),new THREE.Vector3(-.30,.07,.18)]);
    book.add(new THREE.Mesh(new THREE.TubeGeometry(spineCurve,12,.025,8,false),materials.ochre));group.add(book);
  }return group;
}

function makeLetterObject(materials) {
  const group=new THREE.Group();group.add(softLayer(softEdgeShape(.72,.48,.2),materials.letter,.035,.018,.012));
  const flapShape=new THREE.Shape();flapShape.moveTo(-.31,.17);flapShape.bezierCurveTo(-.22,.10,-.08,-.005,0,-.055);flapShape.bezierCurveTo(.09,.005,.22,.105,.31,.17);flapShape.quadraticCurveTo(.20,.23,0,.20);flapShape.quadraticCurveTo(-.21,.23,-.31,.17);flapShape.closePath();
  const flap=new THREE.Mesh(new THREE.ShapeGeometry(flapShape,12),materials.letterFlap);flap.rotation.x=-Math.PI/2;flap.position.y=.069;group.add(flap);
  const seal=new THREE.Mesh(new THREE.SphereGeometry(.058,16,10),materials.seal);seal.scale.set(1,.38,.9);seal.position.set(0,.078,.015);group.add(seal);return group;
}

export function makeTreasureObject(item, materials) {
  const makers = { boat: () => makeCanoe(materials), net: () => makeFishingNet(materials), map: () => makeMapObject(materials), fishBlue: () => makeFishObject(materials,false), fishTerracotta: () => makeFishObject(materials,true), cards: () => makeIllustratedCards(materials), compass: () => makeCompass(materials), basket: () => makeBasket(materials), crab: () => makeCrab(materials), sprig: () => makeSprig(materials), plaque: () => makePlaque(materials), book: () => makeBookObject(materials), mail: () => makeLetterObject(materials) };
  const group = makers[item.kind](); group.userData.section = item.id; group.userData.label = item.title; group.userData.hint = item.hint; group.userData.kind = item.kind; group.userData.objectKey = item.kind + ':' + item.title;
  group.traverse(child => { child.castShadow = true; child.receiveShadow = true; });
  return group;
}
