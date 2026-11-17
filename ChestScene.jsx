import React, { useEffect, useRef, useState } from 'react';
import * as THREE from './vendor/three.module.js';
import { makeMapTexture, makeWindowArtTexture, makeTreasureMaterials, makeTreasureObject } from './treasureObjects.js';
import closedChestImage from '../assets/chest-closed.webp';
import openChestImage from '../assets/chest-open.webp';

function makeWoodTexture() {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
  const c = canvas.getContext('2d');
  const grad = c.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#c27a3d'); grad.addColorStop(.48, '#a85e2e'); grad.addColorStop(1, '#8d4d27');
  c.fillStyle = grad; c.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 320; i++) {
    const y = Math.random() * 512, x = Math.random() * 512, length = 18 + Math.random() * 430;
    c.strokeStyle = Math.random() > .52 ? 'rgba(72,37,18,.10)' : 'rgba(255,218,151,.11)';
    c.lineWidth = Math.random() * 2 + .35; c.beginPath(); c.moveTo(x, y);
    c.bezierCurveTo(x + length * .25, y + (Math.random() - .5) * 7, x + length * .7, y + (Math.random() - .5) * 4, x + length, y + (Math.random() - .5) * 7); c.stroke();
  }
  for (let i = 0; i < 20; i++) {
    c.strokeStyle = 'rgba(81,43,21,.12)'; c.lineWidth = 1.1; c.beginPath();
    c.ellipse(Math.random() * 512, Math.random() * 512, 9 + Math.random() * 18, 2 + Math.random() * 5, .05, 0, Math.PI * 2); c.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.anisotropy = 8; return texture;
}

function woodMaterial(texture, color = '#ffffff', roughness = .74) {
  return new THREE.MeshStandardMaterial({ map: texture, color, roughness, metalness: .02 });
}

function boxMesh(geometry, material, x, y, z, parent, cast = true) {
  const mesh = new THREE.Mesh(geometry, material); mesh.position.set(x, y, z); mesh.castShadow = cast; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}

function curvedShell(width, radius, texture, material) {
  const points = [], uvs = [], indices = [], along = 36, around = 32;
  for (let i = 0; i <= around; i++) {
    const a = Math.PI * i / around;
    for (let j = 0; j <= along; j++) {
      const x = -width / 2 + width * j / along;
      points.push(x, radius * Math.sin(a), radius * (1 + Math.cos(a)));
      uvs.push(j / along, i / around);
    }
  }
  for (let i = 0; i < around; i++) for (let j = 0; j < along; j++) {
    const a = i * (along + 1) + j, b = a + along + 1; indices.push(a, a + 1, b, b, a + 1, b + 1);
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); geo.setIndex(indices); geo.computeVertexNormals();
  return new THREE.Mesh(geo, material);
}

const treasureItems=[
  {id:'quem-somos',title:'Canoa',kind:'boat',hint:'Quem somos · identidade, missão e valores.'},
  {id:'territorio',title:'Mapa do Brasil',kind:'map',hint:'Nosso território · estados, litoral e comunidades caiçaras.'},
  {id:'atuacao',title:'Peixe azul-turquesa',kind:'fishBlue',hint:'Nossa atuação · relação com o mar, a pesca e a vida costeira.'},
  {id:'atuacao',title:'Peixe terracota',kind:'fishTerracotta',hint:'Nossa atuação · cultura, pesca e biodiversidade litorânea.'},
  {id:'materiais',title:'Cartões ilustrados',kind:'cards',hint:'Materiais · imagens, paisagens e memória caiçara.'},
  {id:'equipe',title:'Rede de pesca',kind:'net',hint:'Nossa equipe · a trama sugere colaboração e saberes compartilhados.'},
  {id:'territorio',title:'Bússola',kind:'compass',hint:'Nosso território · orientação e relação com a costa.'},
  {id:'territorio',title:'Cestaria',kind:'basket',hint:'Nosso território · saberes manuais e cultura material.'},
  {id:'atuacao',title:'Caranguejo',kind:'crab',hint:'Nossa atuação · biodiversidade dos ambientes costeiros.'},
  {id:'territorio',title:'Ramo de folhas',kind:'sprig',hint:'Nosso território · vegetação e paisagem litorânea.'},
  {id:'quem-somos',title:'Placa Raiz Caiçara',kind:'plaque',hint:'Quem somos · nome e identidade do Instituto.'},
  {id:'materiais',title:'Caderno',kind:'book',hint:'Materiais · publicações e conteúdos do Instituto.'},
  {id:'contato',title:'Carta',kind:'mail',hint:'Contato · formas de conversar e participar.'}
];

export default function ChestScene({ opened, onOpen, onSelect }) {
  const hostRef = useRef(null), apiRef = useRef(null), openedRef = useRef(opened), onOpenRef = useRef(onOpen), onSelectRef = useRef(onSelect);
  const [hovered, setHovered] = useState(null), tooltipRef = useRef(null), hoverKeyRef = useRef('');
  const [sceneReady, setSceneReady] = useState(false);
  useEffect(() => { openedRef.current = opened; if (!opened) { hoverKeyRef.current = ''; setHovered(null); } }, [opened]);
  useEffect(() => { onOpenRef.current = onOpen; }, [onOpen]);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

  useEffect(() => {
    const host = hostRef.current; if (!host) return;
    const scene = new THREE.Scene(); scene.background = null;
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 80); camera.position.set(0, 3.25, 8.1); camera.lookAt(0, 1.05, 0);
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' }); }
    catch { setSceneReady(false); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8)); renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = 'chest-canvas'; renderer.domElement.tabIndex = 0; renderer.domElement.setAttribute('role', 'group');
    renderer.domElement.setAttribute('aria-label', 'Baú tridimensional do Instituto Raiz Caiçara. Use as setas para girar e Enter para abrir a fechadura.');
    renderer.domElement.setAttribute('aria-describedby', 'box-controls-help');
    host.appendChild(renderer.domElement);
    const contextLost = event => { event.preventDefault(); setSceneReady(false); };
    renderer.domElement.addEventListener('webglcontextlost', contextLost);

    const hemi = new THREE.HemisphereLight(0xfff0cf, 0x4a3926, 2.15); scene.add(hemi);
    const keyLight = new THREE.DirectionalLight(0xffe0ab, 3.25); keyLight.position.set(-4, 8, 6); keyLight.castShadow = true; keyLight.shadow.mapSize.set(1024, 1024); keyLight.shadow.camera.left = -7; keyLight.shadow.camera.right = 7; keyLight.shadow.camera.top = 7; keyLight.shadow.camera.bottom = -5; keyLight.shadow.bias = -.0003; scene.add(keyLight);
    const fill = new THREE.DirectionalLight(0xb4d2c0, 1.1); fill.position.set(5, 3.5, -4); scene.add(fill);
    const rim = new THREE.PointLight(0xd3a84f, 1.7, 9); rim.position.set(0, 2.6, -.4); scene.add(rim);

    const floorMat = new THREE.MeshStandardMaterial({ color:'#79a69b', roughness:.98, transparent:true, opacity:.34, depthWrite:false });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(3.45,72),floorMat); floor.rotation.x=-Math.PI/2; floor.position.y=-.035; floor.receiveShadow=true; scene.add(floor);
    const root = new THREE.Group(); root.rotation.y = -.18; scene.add(root);
    const grain = makeWoodTexture(); const wood = woodMaterial(grain), lightWood = woodMaterial(grain, '#e4b174', .72), innerWood = woodMaterial(grain, '#765033', .92);
    const darkWood = woodMaterial(grain, '#8c552e');
    const iron = new THREE.MeshStandardMaterial({ color: '#463b30', roughness: .4, metalness: .72 });
    const ironLight = new THREE.MeshStandardMaterial({ color: '#8b7254', roughness: .35, metalness: .8 });
    const W = 4.65, D = 2.8, H = 1.72, front = D / 2;

    // Hollow body: layered walls leave the interior visible when the lid lifts.
    boxMesh(new THREE.BoxGeometry(W - .18, .14, D - .16), innerWood, 0, .18, 0, root);
    // Interior contínuo: os objetos repousam juntos sobre o mesmo fundo de madeira.
    boxMesh(new THREE.BoxGeometry(W, H, .18), wood, 0, .98, front - .08, root);
    // O painel traseiro mais baixo deixa os seis objetos visíveis quando a caixa abre.
    boxMesh(new THREE.BoxGeometry(W, .72, .18), darkWood, 0, .48, -front + .08, root);
    boxMesh(new THREE.BoxGeometry(.18, H, D - .25), darkWood, -W / 2 + .09, .98, 0, root);
    boxMesh(new THREE.BoxGeometry(.18, H, D - .25), darkWood, W / 2 - .09, .98, 0, root);
    boxMesh(new THREE.BoxGeometry(W - .26, .1, .12), innerWood, 0, .35, -front + .22, root, false);
    boxMesh(new THREE.BoxGeometry(.12, .1, D - .3), innerWood, -W / 2 + .22, .35, 0, root, false);
    boxMesh(new THREE.BoxGeometry(.12, .1, D - .3), innerWood, W / 2 - .22, .35, 0, root, false);

    // Hand-finished horizontal boards and corner posts on the front and visible sides.
    for (let i = 0; i < 3; i++) {
      const y = .46 + i * .49;
      boxMesh(new THREE.BoxGeometry(W - .16, .43, .055), i === 1 ? lightWood : wood, 0, y, front + .045, root);
      boxMesh(new THREE.BoxGeometry(.055, .43, D - .18), i === 1 ? lightWood : wood, -W / 2 - .015, y, 0, root);
      boxMesh(new THREE.BoxGeometry(.055, .43, D - .18), i === 1 ? lightWood : wood, W / 2 + .015, y, 0, root);
    }
    for (const x of [-W / 2 + .15, W / 2 - .15]) {
      boxMesh(new THREE.BoxGeometry(.28, H + .16, .18), lightWood, x, .98, front + .08, root);
      boxMesh(new THREE.BoxGeometry(.18, H + .16, .28), lightWood, x < 0 ? -W/2 - .01 : W/2 + .01, .98, 0, root);
      for (const y of [.42, 1.52]) {
        boxMesh(new THREE.BoxGeometry(.32, .12, .075), iron, x, y, front + .19, root);
        for (const bx of [-.1, .1]) boxMesh(new THREE.SphereGeometry(.035, 12, 10), ironLight, x + bx, y, front + .235, root);
      }
    }
    // Metal edge rails and a real lock plate.
    boxMesh(new THREE.BoxGeometry(W + .04, .12, .16), lightWood, 0, 1.83, front + .02, root);
    boxMesh(new THREE.BoxGeometry(W + .04, .12, .16), lightWood, 0, 1.83, -front + .02, root);
    for (const x of [-W/2, W/2]) boxMesh(new THREE.BoxGeometry(.14, .12, D), lightWood, x, 1.83, 0, root);
    const lockTargets=[];
    const lockPlate=boxMesh(new THREE.BoxGeometry(.34,.52,.09),iron,0,1.36,front+.19,root);
    const lockBar=boxMesh(new THREE.BoxGeometry(.52,.13,.11),iron,0,1.6,front+.2,root); lockTargets.push(lockPlate,lockBar);
    const keyhole=new THREE.Mesh(new THREE.CircleGeometry(.045,18),new THREE.MeshBasicMaterial({color:'#201a14'}));keyhole.position.set(0,1.28,front+.244);root.add(keyhole);lockTargets.push(keyhole);
    for(const x of [-.22,.22]){const rivet=new THREE.Mesh(new THREE.SphereGeometry(.045,12,10),ironLight);rivet.position.set(x,1.59,front+.27);root.add(rivet);}

    const artTexture=makeWindowArtTexture(),artMaterial=new THREE.MeshBasicMaterial({map:artTexture,transparent:true,alphaTest:.025,side:THREE.DoubleSide,depthWrite:false});
    const glassMaterial=new THREE.MeshStandardMaterial({color:'#b7c7b5',roughness:.78,metalness:.015,transparent:true,opacity:.72,side:THREE.DoubleSide,depthWrite:false});
    const pivot=new THREE.Group();pivot.position.set(0,1.82,-front);root.add(pivot);const lidWidth=W+.12;
    const glassPane=new THREE.Mesh(new THREE.PlaneGeometry(lidWidth-.34,D-.34),glassMaterial);glassPane.rotation.x=-Math.PI/2;glassPane.position.set(0,.012,front);pivot.add(glassPane);
    const frameMat=woodMaterial(grain,'#9b6238',.76);for(const z of [.08,D-.08])boxMesh(new THREE.BoxGeometry(lidWidth,.16,.16),frameMat,0,.015,z,pivot);for(const x of [-lidWidth/2+.08,lidWidth/2-.08])boxMesh(new THREE.BoxGeometry(.16,.16,D-.16),frameMat,x,.015,front,pivot);
    const paintedPanel=new THREE.Mesh(new THREE.PlaneGeometry(lidWidth-.34,D-.34),artMaterial);paintedPanel.rotation.x=-Math.PI/2;paintedPanel.position.set(0,.018,front);pivot.add(paintedPanel);
    for(const x of [-1.5,0,1.5]){boxMesh(new THREE.BoxGeometry(.14,.12,.26),iron,x,-.01,.11,pivot);boxMesh(new THREE.BoxGeometry(.14,.22,.075),iron,x,-.07,D-.015,pivot);for(const z of [.055,.16]){const rivet=new THREE.Mesh(new THREE.SphereGeometry(.028,10,8),ironLight);rivet.position.set(x,-.005,z);pivot.add(rivet);}}
    const mapTexture=makeMapTexture(),objectMaterials=makeTreasureMaterials(mapTexture);
    const pickTargets=[];
    const treasureLayout=[
      [-1.3,.25,-.72,-.08,.9],[-.52,.25,.02,-.16,.82],[.32,.25,-.67,-.08,.9],[1.18,.25,.1,.2,.82],
      [.1,.25,-.12,-.1,.78],[-.02,.25,.7,.1,.88],[1.82,.25,-.75,.08,.76],[-1.84,.25,.66,-.12,.78],
      [1.64,.25,.6,.12,.64],[1.72,.25,1.0,-.08,.56],[-.16,.25,1.0,-.08,.72],[-1.08,.25,.52,-.18,.7],[.72,.25,.78,.18,.66]
    ];
    treasureItems.forEach((item,index)=>{
      const group=makeTreasureObject(item,objectMaterials),[x,y,z,rotation,scale]=treasureLayout[index];
      group.position.set(x,y,z);group.rotation.y=rotation;group.scale.setScalar(scale*1.2);root.add(group);
      pickTargets.push(group);
    });

    const initialCamera = new THREE.Vector3(0, 4.9, 8.1), closeCamera = new THREE.Vector3(0, 7.0, 4.4);
    const initialTarget = new THREE.Vector3(0, 1.0, 0), closeTarget = new THREE.Vector3(0, .92, -.08);
    const state = { progress: 0, target: openedRef.current ? 1 : 0, dragging: null, frame: 0, disposed: false };
    apiRef.current = { root, camera, state };

    let portrait = false;
    const resize = () => { const width = host.clientWidth, height = host.clientHeight; if (!width || !height) return; renderer.setSize(width, height, false); camera.aspect = width / height; portrait = width < height; camera.fov = portrait ? 54 : 38; initialCamera.set(0, portrait ? 6.0 : 4.9, portrait ? 9.6 : 8.1); closeCamera.set(0, portrait ? 8.3 : 7.0, portrait ? 5.0 : 4.4); camera.updateProjectionMatrix(); };
    const observer = new ResizeObserver(resize); observer.observe(host); resize();
    const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();raycaster.params.Line.threshold=.045;
    const setPointerFromEvent=e=>{const rect=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-rect.left)/rect.width)*2-1;pointer.y=-((e.clientY-rect.top)/rect.height)*2+1;raycaster.setFromCamera(pointer,camera);return rect;};
    const screenBounds=(corners,rect)=>{const pts=corners.map(p=>{const q=p.clone().project(camera);return{x:rect.left+(q.x+1)*rect.width/2,y:rect.top+(1-q.y)*rect.height/2};});return{x0:Math.min(...pts.map(p=>p.x)),x1:Math.max(...pts.map(p=>p.x)),y0:Math.min(...pts.map(p=>p.y)),y1:Math.max(...pts.map(p=>p.y))};};
    const containsPoint=(bounds,e,pad=1)=>e.clientX>=bounds.x0-pad&&e.clientX<=bounds.x1+pad&&e.clientY>=bounds.y0-pad&&e.clientY<=bounds.y1+pad;
    const lockAtScreen=e=>{const rect=renderer.domElement.getBoundingClientRect();const pts=[[-.42,1.04,front+.25],[.42,1.04,front+.25],[-.42,1.72,front+.25],[.42,1.72,front+.25]].map(([x,y,z])=>root.localToWorld(new THREE.Vector3(x,y,z)));return containsPoint(screenBounds(pts,rect),e,8);};
    const objectAtScreen=e=>{const rect=renderer.domElement.getBoundingClientRect();let candidate=null,best=Infinity;const candidates=[];root.updateMatrixWorld(true);for(const group of pickTargets){const b=new THREE.Box3().setFromObject(group);if(b.isEmpty())continue;const pts=[];for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z])pts.push(new THREE.Vector3(x,y,z));const bounds=screenBounds(pts,rect);if(containsPoint(bounds,e,5))candidates.push({group,bounds});}const preferred=candidates.filter(item=>item.group.userData.kind!=='net');for(const {group,bounds} of preferred.length?preferred:candidates){const cx=(bounds.x0+bounds.x1)/2,cy=(bounds.y0+bounds.y1)/2,score=((e.clientX-cx)/(Math.max(1,bounds.x1-bounds.x0)))**2+((e.clientY-cy)/(Math.max(1,bounds.y1-bounds.y0)))**2;if(score<best){best=score;candidate=group;}}return candidate;};
    const objectAtPointer=e=>{setPointerFromEvent(e);const hits=raycaster.intersectObjects(pickTargets,true);const groups=hits.map(hit=>{let group=hit.object;while(group&&!group.userData.section)group=group.parent;return group;}).filter(Boolean);const selected=groups.find(group=>group.userData.kind!=='net')||groups[0];return selected||objectAtScreen(e);};
    const updateHover=(group,e)=>{
      const key=group?.userData.objectKey||'';
      if(!key){if(hoverKeyRef.current){hoverKeyRef.current='';setHovered(null);}return;}
      const rect=host.getBoundingClientRect(),maxLeft=Math.max(12,rect.width-258),maxTop=Math.max(12,rect.height-88);
      const left=Math.max(12,Math.min(e.clientX-rect.left+14,maxLeft)),top=Math.max(12,Math.min(e.clientY-rect.top+14,maxTop));
      if(key!==hoverKeyRef.current){hoverKeyRef.current=key;setHovered({title:group.userData.label,hint:group.userData.hint,left,top});}
      else if(tooltipRef.current){tooltipRef.current.style.left=left+'px';tooltipRef.current.style.top=top+'px';}
    };
    const pickLock=e=>{const rect=setPointerFromEvent(e);return raycaster.intersectObjects(lockTargets,false).length>0||lockAtScreen(e);};
    const pickObject = e => {
      const selected=objectAtPointer(e);
      if(selected)onSelectRef.current?.(selected.userData.section);
      return Boolean(selected);
    };
    const down = e => { state.dragging = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false }; renderer.domElement.setPointerCapture(e.pointerId); renderer.domElement.style.cursor = 'grabbing'; };
    const move = e => {
      const d = state.dragging;
      if (!d || d.id !== e.pointerId) {
        if (openedRef.current) { const hoveredObject=objectAtPointer(e);updateHover(hoveredObject,e);renderer.domElement.style.cursor=hoveredObject?'pointer':'grab'; }
        else { updateHover(null,e);const overLock=pickLock(e);renderer.domElement.style.cursor=overLock?'pointer':'grab'; }
        return;
      }
      const dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) d.moved = true;
      root.rotation.y += dx * .012; root.rotation.x = THREE.MathUtils.clamp(root.rotation.x + dy * .004, -.18, .18);
      d.x = e.clientX; d.y = e.clientY;
    };
    const up = e => {
      const d = state.dragging; if (!d) return;
      if (!d.moved) { if (!openedRef.current) { if (pickLock(e)) onOpenRef.current?.(); } else pickObject(e); }
      state.dragging = null; renderer.domElement.style.cursor = 'grab';
    };
    const leave=()=>updateHover(null);
    const keyHandler = e => {
      if (e.key === 'ArrowLeft') root.rotation.y -= .22;
      else if (e.key === 'ArrowRight') root.rotation.y += .22;
      else if (e.key === 'ArrowUp') root.rotation.x = THREE.MathUtils.clamp(root.rotation.x - .08, -.18, .18);
      else if (e.key === 'ArrowDown') root.rotation.x = THREE.MathUtils.clamp(root.rotation.x + .08, -.18, .18);
      else if ((e.key === 'Enter' || e.key === ' ') && !openedRef.current) onOpenRef.current?.();
      else if ((e.key === 'Enter' || e.key === ' ') && openedRef.current) { const firstObject = host.parentElement?.querySelector('.sr-object-list button'); if (firstObject) firstObject.focus(); else return; }
      else return;
      e.preventDefault();
    };
    const canvas = renderer.domElement; canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up); canvas.addEventListener('pointerleave', leave); canvas.addEventListener('keydown', keyHandler); canvas.style.cursor = 'grab'; canvas.style.touchAction = 'pan-y';

    setSceneReady(true);
    let last = performance.now();
    const animate = now => {
      if (state.disposed) return;
      state.frame = requestAnimationFrame(animate); const dt = Math.min((now - last) / 1000, .05); last = now;
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) state.progress = state.target; else { const t = 1 - Math.exp(-dt / .31); state.progress += (state.target - state.progress) * t; }
      const p = THREE.MathUtils.smoothstep(state.progress, 0, 1);
      pivot.rotation.x = -1.88 * p;
      // The collected objects stay grounded while the lid and camera animate.

      camera.position.lerpVectors(initialCamera, closeCamera, p); camera.fov = portrait ? 54 + 6*p : 38 + 8*p; camera.updateProjectionMatrix(); const target = new THREE.Vector3().lerpVectors(initialTarget, closeTarget, p); camera.lookAt(target);

      renderer.render(scene, camera);
    };
    state.frame = requestAnimationFrame(animate);
    return () => { state.disposed = true; cancelAnimationFrame(state.frame); observer.disconnect(); canvas.removeEventListener('webglcontextlost', contextLost); canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up); canvas.removeEventListener('pointerleave', leave); canvas.removeEventListener('keydown', keyHandler); renderer.dispose(); grain.dispose(); artTexture.dispose(); mapTexture.dispose(); artMaterial.dispose(); glassMaterial.dispose(); objectMaterials.cardArt.map.dispose(); objectMaterials.plaqueFace.map.dispose(); Object.values(objectMaterials).forEach(material=>material.dispose()); frameMat.dispose(); host.removeChild(canvas); apiRef.current = null; };
  }, []);

  useEffect(() => { if (apiRef.current) apiRef.current.state.target = opened ? 1 : 0; }, [opened]);
  return <>
    <div className={`chest-3d-scene ${sceneReady?'scene-ready':'scene-fallback'}`} ref={hostRef}>
      {!sceneReady&&<div className="chest-static-fallback"><img src={opened?openChestImage:closedChestImage} alt=""/><button type="button" onClick={onOpen} aria-label="Abrir o baú" tabIndex={opened?-1:0}/></div>}
    </div>
    {hovered && <div className="object-hover-label" ref={tooltipRef} style={{left:hovered.left,top:hovered.top}} role="status">
      <strong>{hovered.title}</strong><span>{hovered.hint}</span>
    </div>}
  </>;
}
