import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowLeft, ArrowRight, BookOpen, Compass, Fish, Mail, Map, Menu, Sprout, Users, Waves, X } from 'lucide-react';
import logo from '../assets/logo-instituto-caicara.png';
import fallbackMap from '../assets/mapa-brasil-esquematico.svg';
import seaweedArt from '../assets/algas-aquarela.png';
import coastArt from '../assets/litoral-aquarela.png';
import sunArt from '../assets/sol-aquarela.png';
import fishArt from '../assets/peixe-aquarela.png';
import canoeArt from '../assets/canoa-rede-aquarela.png';
import foliageArt from '../assets/folhagem-aquarela.png';
import ChestScene from './ChestScene.jsx';
import './styles.css';
import './box.css';
import './game.css';
import './institution.css';

const sections = [
  { id:'quem-somos', title:'Quem somos', intro:'Identidade, missão, visão e valores.', icon:Sprout, tone:'green', number:'01' },
  { id:'equipe', title:'Nossa equipe', intro:'As pessoas e áreas de conhecimento do Instituto.', icon:Users, tone:'sand', number:'02' },
  { id:'atuacao', title:'Nossa atuação', intro:'Os temas que orientam o trabalho institucional.', icon:BookOpen, tone:'blue', number:'03' },
  { id:'territorio', title:'Nosso território', intro:'Cultura caiçara e litoral paranaense.', icon:Map, tone:'ochre', number:'04' },
  { id:'materiais', title:'Materiais', intro:'Publicações e conteúdos para conhecer e compartilhar.', icon:Compass, tone:'sage', number:'05' },
  { id:'contato', title:'Contato', intro:'Canais oficiais e formas de participação.', icon:Mail, tone:'clay', number:'06' },
];
const team = [
  ['Alisson Mangini','Presidente','Gestão da Informação; especialização em Sustentabilidade e ESG.'],
  ['Bryan Muller','Relações institucionais','Oceanografia; mestrado em Sistemas Costeiros e Oceânicos.'],
  ['Iully Ferretto','Administração','Oceanógrafa; especialista em Educação; mestranda em Meio Ambiente e Desenvolvimento pela UFPR.'],
  ['Nicolle Uyetaqui','Jurídico','Advogada; mestre em Direito Socioambiental e Sustentabilidade.'],
];
const identity = [
  ['MISSÃO','Resgatar, preservar e valorizar a identidade e a cultura caiçara, mediando saberes e promovendo educação sobre sustentabilidade e vida marinha.'],
  ['VISÃO','Ser referência em uma educação construída por diferentes formas de saber, com valorização territorial do litoral paranaense.'],
  ['VALORES','Valorização territorial · cultura e educação para a sustentabilidade e a vida marinha · mediação · ética e justiça social.'],
];
const axes = ['Cultura e identidade caiçara','Valorização territorial','Educação para sustentabilidade e vida marinha','Mediação entre comunidades, ciência e instituições'];
const regions = {
  PR:{name:'Paraná',localities:'Ilha do Maciel (Pontal do Paraná); Guaraqueçaba, Paranaguá e Morretes.',text:'O litoral paranaense reúne comunidades com histórias e práticas próprias. O IPHAN registra o Fandango Caiçara ligado à pesca, à roça, ao extrativismo e ao mutirão; o IDR-Paraná documenta a comunidade da Ilha do Maciel.',source:'IDR-Paraná · Ilha do Maciel / IPHAN · Fandango Caiçara',url:'https://www.idrparana.pr.gov.br/Noticia/IDR-Parana-fortalece-o-turismo-de-base-comunitaria-na-Ilha-do-Maciel',source2:'IPHAN · Fandango Caiçara',url2:'https://sicg.iphan.gov.br/sicg/bemImaterial/rel/126/',photo:'https://www.parana.pr.gov.br/sites/default/arquivos_restritos/files/imagem/2026-03/ilhamaciel8.jpg',photoAlt:'Canoa e vida comunitária na Ilha do Maciel, litoral do Paraná.',photoCredit:'Registro da Ilha do Maciel · IDR-Paraná',photoSource:'https://www.idrparana.pr.gov.br/Noticia/IDR-Parana-fortalece-o-turismo-de-base-comunitaria-na-Ilha-do-Maciel'},
  SP:{name:'São Paulo',localities:'Cananéia e Iguape; o registro do Fandango cita também pequenos trechos de Ilha Comprida e Peruíbe.',text:'No litoral sul paulista, o Fandango Caiçara articula música, dança, trabalho comunitário, religiosidade e memória. As práticas variam entre localidades e grupos.',source:'IPHAN · Registro do Fandango Caiçara',url:'https://sicg.iphan.gov.br/sicg/bemImaterial/rel/126/',photo:'https://www.pesca.sp.gov.br/web/image/2489-52beadd1/cananeia-caioferrari-8-533x800.jpg?access_token=cfd40466-ca27-4770-a266-7a65ef33b7a7',photoAlt:'Barcos de pescadores em Cananéia, litoral sul paulista.',photoCredit:'Foto: Caio Ferrari · imagem publicada pelo Instituto de Pesca de São Paulo',photoSource:'https://www.pesca.sp.gov.br/blog/ip-na-midia-16/mare-boa-para-pesca-artesanal-7473'},
  RJ:{name:'Rio de Janeiro',localities:'Paraty: Praia do Sono, Trindade e Praia Grande da Cajaíba, entre outras comunidades documentadas.',text:'Em Paraty, registros institucionais descrevem relações entre pesca artesanal, agricultura, construção de canoas, Mata Atlântica e conhecimentos transmitidos entre gerações.',source:'ICMBio · Praia Grande da Cajaíba',url:'https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/unidade-de-conservacao/unidades-de-biomas/marinho/lista-de-ucs/apa-de-cairucu/povos-e-comunidades-tradicionais-2/praia-grande-da-cajaiba',source2:'Paisagens Caiçaras · Praia do Sono',url2:'https://paisagenscaicaras.wordpress.com/2022/05/24/praia-do-sono/',photo:'https://paisagenscaicaras.wordpress.com/wp-content/uploads/2022/05/3db3532f-ed78-40bb-928f-e49404d589e2-alan-conceiu00e7u00e3o.jpg',photoAlt:'Registro fotográfico da pesca artesanal na comunidade caiçara da Praia do Sono, em Paraty.',photoCredit:'Foto: Alan Conceição · projeto Paisagens Caiçaras',photoSource:'https://paisagenscaicaras.wordpress.com/2022/05/24/praia-do-sono/'},
  SC:{name:'Santa Catarina',localities:'Litoral norte catarinense.',text:'No litoral norte catarinense, a cultura caiçara se expressa em modos de vida ligados à costa, à memória e aos saberes tradicionais.',source:'IPHAN · Paisagens Caiçaras',url:'https://www.gov.br/iphan/pt-br/superintendencias/parana/2-edicao-paisagens-caicaras',photo:null,photoAlt:'',photoCredit:'',photoSource:null}
};
const details = {
  'quem-somos': { kicker:'Identidade institucional', text:'O Instituto Raiz Caiçara valoriza a identidade e a cultura das comunidades caiçaras do Paraná e aproxima diferentes formas de saber.' },
  equipe:{ kicker:'Pessoas e trajetórias', text:'A equipe reúne profissionais com experiências em Gestão da Informação, Oceanografia, Educação, Meio Ambiente e Direito Socioambiental.' },
  atuacao:{ kicker:'Temas que orientam o trabalho', text:'Cultura caiçara, valorização territorial, educação para a sustentabilidade e vida marinha, além do diálogo entre saberes comunitários, científicos e institucionais.' },
  territorio:{ kicker:'Território e memória', text:'Explore referências costeiras de diferentes estados e conheça relações entre cultura, memória e território.' },
  materiais:{ kicker:'Cultura para compartilhar', text:'Histórias, saberes e referências da cultura caiçara e dos territórios costeiros.' },
  contato:{ kicker:'Vamos conversar?', text:'Use a seção Junte-se a nós para manifestar interesse em participar ou apresentar uma proposta de parceria.' },
};


const UF_BY_IBGE={11:'RO',12:'AC',13:'AM',14:'RR',15:'PA',16:'AP',17:'TO',21:'MA',22:'PI',23:'CE',24:'RN',25:'PB',26:'PE',27:'AL',28:'SE',29:'BA',31:'MG',32:'ES',33:'RJ',35:'SP',41:'PR',42:'SC',43:'RS',50:'MS',51:'MT',52:'GO',53:'DF'};
const UF_NAMES={RO:'Rondônia',AC:'Acre',AM:'Amazonas',RR:'Roraima',PA:'Pará',AP:'Amapá',TO:'Tocantins',MA:'Maranhão',PI:'Piauí',CE:'Ceará',RN:'Rio Grande do Norte',PB:'Paraíba',PE:'Pernambuco',AL:'Alagoas',SE:'Sergipe',BA:'Bahia',MG:'Minas Gerais',ES:'Espírito Santo',RJ:'Rio de Janeiro',SP:'São Paulo',PR:'Paraná',SC:'Santa Catarina',RS:'Rio Grande do Sul',MS:'Mato Grosso do Sul',MT:'Mato Grosso',GO:'Goiás',DF:'Distrito Federal'};
function BrazilStateMap({region,onSelect}){
 const [features,setFeatures]=useState([]),[failed,setFailed]=useState(false);
 useEffect(()=>{const controller=new AbortController();fetch('https://servicodados.ibge.gov.br/api/v3/malhas/estados?formato=application/vnd.geo+json&qualidade=minima',{signal:controller.signal}).then(response=>{if(!response.ok)throw new Error('mapa indisponível');return response.json();}).then(data=>{const rows=Array.isArray(data)?data:data.features||[];if(!rows.length)throw new Error('malha vazia');setFeatures(rows);}).catch(error=>{if(error.name!=='AbortError')setFailed(true);});return()=>controller.abort();},[]);
 const prepared=useMemo(()=>{if(!features.length)return[];const minLon=-75,maxLon=-33,minLat=-35,maxLat=6,project=([lon,lat])=>[10+(lon-minLon)/(maxLon-minLon)*300,10+(maxLat-lat)/(maxLat-minLat)*290];return features.map(feature=>{const raw=String(feature.properties?.id??feature.properties?.codarea??feature.id??'').replace(/\D/g,'').slice(0,2),uf=UF_BY_IBGE[raw]||feature.properties?.sigla||'',geometry=feature.geometry,polygons=geometry?.type==='Polygon'?[geometry.coordinates]:geometry?.type==='MultiPolygon'?geometry.coordinates:[],rings=polygons.map(poly=>poly[0]).filter(ring=>ring?.length>2),paths=rings.map(ring=>ring.map((point,index)=>{const [x,y]=project(point);return(index?'L':'M')+x.toFixed(1)+' '+y.toFixed(1);}).join(' ')+' Z'),points=rings.flat();let x=160,y=155;if(points.length){const mean=points.reduce((sum,point)=>[sum[0]+point[0],sum[1]+point[1]],[0,0]);[x,y]=project([mean[0]/points.length,mean[1]/points.length]);}return{uf,paths,x,y};}).filter(item=>item.uf&&item.paths.length);},[features]);
 const activeCodes=['PR','SP','RJ','SC'];
 if(!prepared.length)return <div className="painted-map map-fallback" aria-label="Mapa ilustrado do Brasil e de estados da costa sul e sudeste"><img src={fallbackMap} alt="Mapa esquemático do Brasil com Paraná, São Paulo, Rio de Janeiro e Santa Catarina destacados." loading="lazy"/><div className="map-state-pills" aria-label="Explorar referências por estado"><span>Explorar:</span>{activeCodes.map(code=><button type="button" key={code} onClick={()=>onSelect(code)} className={region===code?'selected':''} aria-label={'Explorar referências caiçaras em '+UF_NAMES[code]}>{code}</button>)}</div><small className="map-credit">Mapa esquemático · referências costeiras por estado</small><span className="sr-only" role="status">{failed?'Mapa ilustrado disponível.':'Mapa ilustrado disponível enquanto os limites oficiais carregam.'}</span></div>;
 return <div className="painted-map" aria-label="Mapa interativo do Brasil por estado"><svg viewBox="0 0 320 310" role="img" aria-label="Limites estaduais do Brasil. Estados do litoral caiçara em destaque.">{prepared.map((item,index)=>{const selected=region===item.uf,present=activeCodes.includes(item.uf),cls='map-state-shape'+(present?' present':'')+(selected?' selected':'');return <g key={item.uf||index} className={cls} role={present?'button':undefined} tabIndex={present?0:-1} aria-label={present?(UF_NAMES[item.uf]+': explorar referências caiçaras'):UF_NAMES[item.uf]} onClick={present?()=>onSelect(item.uf):undefined} onKeyDown={present?event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onSelect(item.uf);}}:undefined}><title>{UF_NAMES[item.uf]+(present?' · explorar referências costeiras':'')}</title>{item.paths.map((d,i)=><path key={i} d={d}/>)}<text x={item.x} y={item.y}>{item.uf}</text></g>;})}</svg><div className="map-state-pills" aria-label="Explorar referências por estado"><span>Explorar:</span>{activeCodes.map(code=><button type="button" key={code} onClick={()=>onSelect(code)} className={region===code?'selected':''} aria-label={'Explorar referências caiçaras em '+UF_NAMES[code]}>{code}</button>)}</div><small className="map-credit">Divisões estaduais: malha do IBGE. Destaques indicam referências costeiras, não o estado inteiro.</small></div>;
}

function App(){
  const [boxOpen,setBoxOpen]=useState(false), [active,setActive]=useState(''), [soundOn,setSoundOn]=useState(true), [region,setRegion]=useState('PR');
  const [navOpen,setNavOpen]=useState(false),[contactNotice,setContactNotice]=useState('');
  const [accessibilityOpen,setAccessibilityOpen]=useState(false),[textScale,setTextScale]=useState(1),[highContrast,setHighContrast]=useState(false);
  const [searchQuery,setSearchQuery]=useState(''),[searchStatus,setSearchStatus]=useState('');
  const searchInputRef=useRef(null),audioRef=useRef(null);
  useEffect(()=>{
    document.documentElement.style.zoom=String(textScale);
    document.documentElement.classList.toggle('high-contrast',highContrast);
    return()=>{document.documentElement.style.zoom='';document.documentElement.classList.remove('high-contrast');};
  },[textScale,highContrast]);
  useEffect(()=>{
    const handleShortcuts=event=>{
      if(!event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
      if(event.key==='1'){event.preventDefault();document.getElementById('main-content')?.focus();}
      if(event.key==='2'){event.preventDefault();setNavOpen(true);requestAnimationFrame(()=>document.querySelector('#main-navigation a')?.focus());}
      if(event.key==='3'){event.preventDefault();setAccessibilityOpen(true);requestAnimationFrame(()=>searchInputRef.current?.focus());}
      if(event.key==='4'){event.preventDefault();document.getElementById('site-footer')?.focus();}
    };
    document.addEventListener('keydown',handleShortcuts);
    return()=>document.removeEventListener('keydown',handleShortcuts);
  },[]);
  useEffect(()=>{
    const nodes=[...document.querySelectorAll('.scroll-reveal')];
    if(!('IntersectionObserver' in window)){nodes.forEach(node=>node.classList.add('is-visible'));return;}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('reveal-pending');entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.01,rootMargin:'0px 0px -10% 0px'});
    nodes.forEach(node=>{if(node.getBoundingClientRect().top>window.innerHeight)node.classList.add('reveal-pending');observer.observe(node);});
    return()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    const heroImage=document.querySelector('.hero-image');
    if(!heroImage||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    let frame=0;
    const update=()=>{frame=0;const top=heroImage.parentElement.getBoundingClientRect().top;const shift=Math.max(0,Math.min(34,-top*.055));heroImage.style.setProperty('--hero-scroll-shift',`${shift}px`);};
    const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update);};
    update();window.addEventListener('scroll',onScroll,{passive:true});
    return()=>{window.removeEventListener('scroll',onScroll);if(frame)cancelAnimationFrame(frame);};
  },[]);
  const soundContext=()=>{const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return null;const ctx=audioRef.current||new Ctx();audioRef.current=ctx;if(ctx.state==='suspended')ctx.resume();return ctx;};
  const chestSound=()=>{if(!soundOn)return;try{const ctx=soundContext();if(!ctx)return;const now=ctx.currentTime;const buf=ctx.createBuffer(1,ctx.sampleRate*.7,ctx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);const n=ctx.createBufferSource();n.buffer=buf;const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(560,now);f.frequency.exponentialRampToValueAtTime(88,now+.58);const g=ctx.createGain();g.gain.setValueAtTime(.0001,now);g.gain.linearRampToValueAtTime(.14,now+.06);g.gain.exponentialRampToValueAtTime(.0001,now+.65);n.connect(f).connect(g).connect(ctx.destination);n.start(now);n.stop(now+.7);const o=ctx.createOscillator(),og=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(96,now+.48);o.frequency.exponentialRampToValueAtTime(44,now+.76);og.gain.setValueAtTime(.0001,now+.46);og.gain.linearRampToValueAtTime(.14,now+.5);og.gain.exponentialRampToValueAtTime(.0001,now+.78);o.connect(og).connect(ctx.destination);o.start(now+.46);o.stop(now+.8);}catch{}}
  const objectSound=()=>{if(!soundOn)return;try{const ctx=soundContext();if(!ctx)return;const now=ctx.currentTime;const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(470,now);o.frequency.exponentialRampToValueAtTime(180,now+.13);g.gain.setValueAtTime(.0001,now);g.gain.linearRampToValueAtTime(.08,now+.008);g.gain.exponentialRampToValueAtTime(.0001,now+.16);o.connect(g).connect(ctx.destination);o.start(now);o.stop(now+.17);const b=ctx.createBuffer(1,ctx.sampleRate*.1,ctx.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*(1-i/a.length);const n=ctx.createBufferSource();n.buffer=b;const ng=ctx.createGain();ng.gain.setValueAtTime(.035,now+.04);ng.gain.exponentialRampToValueAtTime(.0001,now+.15);n.connect(ng).connect(ctx.destination);n.start(now+.04);n.stop(now+.16);}catch{}}
  const openChest=()=>{if(!boxOpen)chestSound();setBoxOpen(true);};
  const closeChest=()=>{setBoxOpen(false);setActive('');};
  const home=()=>{setNavOpen(false);closeChest();window.scrollTo({top:0,behavior:'smooth'});};
  const findChest=()=>document.getElementById('box-stage')?.scrollIntoView({behavior:'smooth',block:'start'});
  const scrollToSection=id=>{setNavOpen(false);document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});};
  const prepareInterestEmail=(event,kind)=>{event.preventDefault();const form=new FormData(event.currentTarget);const lines=[...form.entries()].filter(([name])=>name!=='consent').map(([name,value])=>name+': '+value).join('\n');const subject=kind==='participation'?'Interesse em participar do Instituto Raiz Caiçara':'Conversa sobre possível parceria ou serviço';const opening=kind==='participation'?'Gostaria de manifestar meu interesse em me aproximar e participar das atividades do Instituto.':'Gostaria de conversar sobre uma possível parceria ou serviço relacionado aos eixos institucionais.';const body='Olá,\n\n'+opening+'\n\n'+lines;setContactNotice('Uma mensagem foi preparada no seu aplicativo de e-mail. Revise os dados, inclua o destinatário e envie quando estiver pronta.');window.location.href='mailto:?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);};
  const submitSearch=event=>{event.preventDefault();const query=searchQuery.trim().toLocaleLowerCase('pt-BR');if(!query){setSearchStatus('Digite um termo para buscar.');return;}const candidates=[...document.querySelectorAll('#main-content h1,#main-content h2,#main-content h3,#main-content h4,#main-content p,#main-content a,#main-content button,#main-content label')].filter(node=>node.getClientRects().length);const match=candidates.find(node=>node.textContent.toLocaleLowerCase('pt-BR').includes(query));if(!match){setSearchStatus('Nenhum resultado encontrado.');return;}const section=match.closest('section')||match;section.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});const target=match.matches('h1,h2,h3,h4')?match:section;target.setAttribute('tabindex','-1');requestAnimationFrame(()=>target.focus({preventScroll:true}));setSearchStatus('Resultado encontrado: '+match.textContent.trim().replace(/\s+/g,' ').slice(0,90));};
  const chooseSection=id=>{if(!boxOpen)return;objectSound();setActive(id);};
  const backToObjects=()=>{objectSound();setActive('');};
  const current=sections.find(s=>s.id===active);

  return <div className="site-shell">
    <a className="skip-link" href="#main-content">Pular para o conteúdo principal</a>
    <header className="site-header">
      <button className="wordmark" onClick={home} aria-label="Instituto Raiz Caiçara, início">
        <img className="wordmark-logo" src={logo} alt="" width="1774" height="887"/>
      </button>
      <nav className={navOpen?'top-nav is-open':'top-nav'} id="main-navigation" tabIndex="-1" aria-label="Navegação principal" onKeyDown={event=>{if(event.key==='Escape'&&navOpen){setNavOpen(false);document.getElementById('menu-toggle')?.focus();}}}>
        <a href="#box-stage" onClick={()=>setNavOpen(false)}>Box</a>
        <a href="#quem-somos" onClick={()=>setNavOpen(false)}>O Instituto</a>
        <a href="#atuacao" onClick={()=>setNavOpen(false)}>Atuação</a>
        <a href="#comunidade" onClick={()=>setNavOpen(false)}>Comunidades</a>
        <a href="#equipe" onClick={()=>setNavOpen(false)}>Equipe</a>
      </nav>
      <div className="header-actions">
        <details className="accessibility-tools" open={accessibilityOpen} onToggle={event=>setAccessibilityOpen(event.currentTarget.open)}>
          <summary className="accessibility-summary" aria-label="Abrir recursos de acessibilidade"><span className="accessibility-icon" aria-hidden="true">Aa</span><span className="accessibility-label">Acessibilidade</span></summary>
          <div className="accessibility-panel" role="region" aria-label="Recursos de acessibilidade">
            <h2>Acessibilidade</h2>
            <div className="font-controls"><span>Tamanho do texto</span><button type="button" onClick={()=>setTextScale(value=>Math.max(.9,Math.round((value-.1)*10)/10))} aria-label="Diminuir tamanho do texto">A−</button><output aria-live="polite">{Math.round(textScale*100)}%</output><button type="button" onClick={()=>setTextScale(value=>Math.min(1.4,Math.round((value+.1)*10)/10))} aria-label="Aumentar tamanho do texto">A+</button><button type="button" onClick={()=>{setTextScale(1);setHighContrast(false);}} aria-label="Restaurar tamanho e cores padrão">Padrão</button></div>
            <button className="contrast-toggle" type="button" onClick={()=>setHighContrast(value=>!value)} aria-pressed={highContrast}>{highContrast?'Desativar alto contraste':'Ativar alto contraste'}</button>
            <p className="shortcut-help"><strong>Atalhos:</strong> Alt+1 conteúdo · Alt+2 menu · Alt+3 busca · Alt+4 rodapé</p>
            <form className="site-search" role="search" onSubmit={submitSearch}>
              <label htmlFor="site-search-input">Buscar no site</label>
              <div><input ref={searchInputRef} id="site-search-input" type="search" value={searchQuery} onChange={event=>setSearchQuery(event.target.value)} placeholder="Ex.: território"/><button type="submit">Buscar</button></div>
              <p role="status" aria-live="polite">{searchStatus}</p>
            </form>
            <p className="libras-help">Para traduzir o conteúdo em Libras, use o botão flutuante VLibras.</p>
          </div>
        </details>
        <button id="menu-toggle" className="mobile-menu-toggle" type="button" onClick={()=>setNavOpen(v=>!v)} aria-label={navOpen?'Fechar menu':'Abrir menu'} aria-expanded={navOpen} aria-controls="main-navigation">{navOpen?<X size={18}/>:<Menu size={18}/>}</button>
        <button className="nav-contact" onClick={()=>scrollToSection('participar')}>Junte-se a nós <ArrowRight size={14}/></button>
      </div>
    </header>
    <main id="main-content" tabIndex="-1">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-image" role="img" aria-label="Ilustração artística de pessoas caiçaras em atividade numa canoa, com pesca artesanal, moradias e Mata Atlântica ao fundo"/><div className="hero-wash" aria-hidden="true"/>
        <img className="hero-decoration hero-sun-art" src={sunArt} alt="" aria-hidden="true" loading="lazy"/>
        <img className="hero-decoration hero-foliage-art" src={foliageArt} alt="" aria-hidden="true" loading="lazy"/>
        <div className="hero-content">
          <p className="eyebrow"><span className="eyebrow-line"/>Cultura · território · litoral paranaense</p>
          <h1 id="hero-title">Cultura,<br/>território<br/><em>e vida marinha.</em></h1>
          <p className="hero-copy">Conheça o Instituto Raiz Caiçara, sua missão e os saberes que aproximam comunidades, ciência e vivência comunitária.</p>
          <div className="hero-actions"><button className="primary-link" onClick={()=>scrollToSection('quem-somos')}>Conheça o Instituto <ArrowDown size={17}/></button><button className="secondary-link" onClick={findChest}>Explore o baú <ArrowRight size={15}/></button></div>
        </div>
        <div className="hero-caption"><span>INSTITUTO RAIZ CAIÇARA</span><i/>Litoral do Paraná</div>
        <div className="hero-seal">território<br/><span>·</span> memória<br/><span>·</span> comunidade</div>
      </section>
      <p className="hero-image-credit">Ilustração de capa criada com inteligência artificial</p>
      <section id="box-stage" className={`box-stage scroll-reveal ${boxOpen?'is-open':''}`} aria-labelledby="explore-title"><div className="section-heading"><div><p className="eyebrow">Uma memória caiçara reunida em objetos</p><h2 id="explore-title">{boxOpen?'Olhe o que há dentro.':'Encontre a fechadura.'}</h2></div><span className="heading-note">{boxOpen?'GIRE O BAÚ · ESCOLHA UM OBJETO':'GIRE PARA ESPIAR OS OBJETOS · CLIQUE NA FECHADURA'}</span></div>
        <div className={`box-experience ${boxOpen?'is-open':''}`}><div className="ocean-ornaments" aria-hidden="true"><svg className="ornament-fish fish-one" viewBox="0 0 110 52"><path d="M9 26C23 5 57 4 78 25 58 47 24 47 9 26Zm69-1 22-16-5 17 5 17-22-16"/><circle cx="29" cy="22" r="2.5"/><path d="M40 12q4 7 0 13m12-15q4 8 0 16m12-12q4 7 0 14"/></svg><svg className="ornament-fish fish-two" viewBox="0 0 110 52"><path d="M9 26C23 5 57 4 78 25 58 47 24 47 9 26Zm69-1 22-16-5 17 5 17-22-16"/><circle cx="29" cy="22" r="2.5"/><path d="M40 12q4 7 0 13m12-15q4 8 0 16m12-12q4 7 0 14"/></svg><img className="ocean-watercolor ocean-fish-art" src={fishArt} alt="" loading="lazy"/><img className="ocean-watercolor ocean-algae-art" src={seaweedArt} alt="" loading="lazy"/><svg className="ornament-kelp kelp-left" viewBox="0 0 90 240"><path d="M45 240C33 194 66 166 48 128 31 92 57 60 41 8M43 196C17 182 10 159 8 139 30 145 43 162 43 179M49 146c23-18 31-39 29-59-20 8-30 25-31 42M42 96C19 80 15 58 20 40c17 12 24 28 25 45"/></svg><svg className="ornament-kelp kelp-right" viewBox="0 0 90 240"><path d="M45 240C33 194 66 166 48 128 31 92 57 60 41 8M43 196C17 182 10 159 8 139 30 145 43 162 43 179M49 146c23-18 31-39 29-59-20 8-30 25-31 42M42 96C19 80 15 58 20 40c17 12 24 28 25 45"/></svg><i className="bubble bubble-a"/><i className="bubble bubble-b"/><i className="bubble bubble-c"/><i className="bubble bubble-d"/><span className="sea-spark spark-a">✳</span><span className="sea-spark spark-b">✦</span></div><p id="box-controls-help" className="sr-only">Use as setas do teclado para girar o baú. Pressione Enter para abrir. Depois de abrir, pressione Enter para acessar a lista dos objetos.</p><ChestScene opened={boxOpen} onOpen={openChest} onSelect={chooseSection}/>{!boxOpen&&<div className="scene-hint"><span className="scene-lock-icon" aria-hidden="true">⌑</span><span>Clique na fechadura para abrir</span><small>Arraste ou use as setas · Enter abre a fechadura</small></div>}
          {boxOpen&&<div className={`box-inside ${active?'show-detail':''}`}>
            {!current?<><div className="inside-prompt"><span className="prompt-mark">✳</span><div className="prompt-copy"><p className="eyebrow">Baú aberto · Instituto Raiz Caiçara</p><h3>Escolha um objeto dentro do baú</h3><p>O objeto abre uma ficha aqui mesmo, sem tirar você do baú.</p></div><div className="box-controls"><button className="sound-toggle" onClick={()=>setSoundOn(v=>!v)} aria-pressed={soundOn} aria-label={soundOn?'Desligar sons':'Ligar sons'}>{soundOn?'♫ Som ligado':'♫ Som desligado'}</button><button className="close-box" onClick={closeChest}>Fechar o baú <X size={15}/></button></div><p className="inside-instruction">Clique em um objeto ou use a lista acessível · arraste ou use as setas para girar</p></div><div className="sr-object-list" role="navigation" aria-label="Acessar conteúdo por objeto">{sections.map(s=><button key={s.id} onClick={()=>{chooseSection(s.id);requestAnimationFrame(()=>document.getElementById('box-item-detail-heading')?.focus());}}>{s.title}</button>)}</div></>:<><div className="detail-topline"><button className="back-link" onClick={event=>{backToObjects();if(event.detail===0)requestAnimationFrame(()=>document.querySelector('.sr-object-list button')?.focus());}}><ArrowLeft size={15}/> Voltar aos objetos</button><span>OBJETO {current.number} / 06</span><button className="sound-toggle compact" onClick={()=>setSoundOn(v=>!v)} aria-pressed={soundOn} aria-label={soundOn?'Desligar sons':'Ligar sons'}>{soundOn?'♫':'♩'}</button></div><section className="box-item-detail" key={active} aria-live="polite" aria-labelledby="box-item-detail-heading"><p className="eyebrow">{details[active].kicker}</p><h3 id="box-item-detail-heading" tabIndex="-1">{current.title}</h3><p className="detail-summary">{details[active].text}</p>
              {active==='quem-somos'&&<div className="identity-values">{identity.map(([label,copy])=><article key={label}><span>{label}</span><p>{copy}</p></article>)}</div>}
              {active==='equipe'&&<div className="team-grid">{team.map(([name,role,bio])=><article className="team-card" key={name}><div className="team-photo-placeholder" aria-hidden="true"><span>{name.split(' ').map(part=>part[0]).slice(0,2).join('')}</span><i>✳</i></div><span>{role}</span><h4>{name}</h4><p>{bio}</p></article>)}</div>}
              {active==='atuacao'&&<><div className="axis-list">{axes.map((text,i)=><div key={text}><b>0{i+1}</b><span>{text}</span></div>)}</div><figure className="fishing-photo"><img src="https://www.parana.pr.gov.br/sites/default/arquivos_restritos/files/imagem/2026-03/ilhamaciel8.jpg" alt="Registro fotográfico da comunidade caiçara da Ilha do Maciel, no litoral paranaense"/><figcaption>Pesca, canoas e vida comunitária na Ilha do Maciel, Pontal do Paraná. Foto: IDR-Paraná · <a href="https://www.parana.pr.gov.br/aen/Noticia/IDR-Parana-fortalece-o-turismo-de-base-comunitaria-na-Ilha-do-Maciel-em-Pontal-do" target="_blank" rel="noreferrer">ver publicação oficial</a>.</figcaption></figure><div className="fish-note"><Fish size={18}/><span>Na Ilha do Maciel, a pesca se relaciona à vida comunitária, ao trabalho e ao território.</span></div></>}
              {active==='territorio'&&<><div className="territory-explorer"><BrazilStateMap region={region} onSelect={setRegion}/><article className="region-card"><p className="eyebrow">Cultura e território · escolha um estado</p><h4>{regions[region].name}</h4><p>{regions[region].text}</p><p className="region-localities"><strong>Localidades:</strong> {regions[region].localities}</p><a href={regions[region].url} target="_blank" rel="noreferrer">Fonte: {regions[region].source} <ArrowRight size={13}/></a>{regions[region].url2&&<a href={regions[region].url2} target="_blank" rel="noreferrer">Fonte: {regions[region].source2} <ArrowRight size={13}/></a>}<small>Os destaques indicam referências costeiras e não delimitam territórios comunitários.</small></article></div>{regions[region].photo&&<figure className="fishing-photo"><img src={regions[region].photo} alt={regions[region].photoAlt}/><figcaption>{regions[region].photoCredit} · <a href={regions[region].photoSource} target="_blank" rel="noreferrer">ver registro e contexto</a></figcaption></figure>}<div className="fish-note"><Fish size={18}/><span>Pesca artesanal, memória e território se encontram de formas próprias em cada comunidade caiçara.</span></div></>}
              {active==='materiais'&&<div className="reading-shelf"><p>Conheça registros públicos sobre cultura, território e vida costeira:</p><a href="https://sicg.iphan.gov.br/sicg/bemImaterial/rel/126/" target="_blank" rel="noreferrer"><BookOpen size={19}/><span><strong>Fandango Caiçara</strong><small>Registro de patrimônio cultural · IPHAN</small></span><ArrowRight size={17}/></a><a href="https://www.idrparana.pr.gov.br/Noticia/IDR-Parana-fortalece-o-turismo-de-base-comunitaria-na-Ilha-do-Maciel" target="_blank" rel="noreferrer"><Waves size={19}/><span><strong>Ilha do Maciel</strong><small>Comunidade e litoral paranaense · IDR-Paraná</small></span><ArrowRight size={17}/></a><p className="reading-shelf-note">Cada referência abre em uma nova página.</p></div>}
              {active==='contato'&&<div className="project-note"><Mail size={19}/><div><strong>Escolha como se aproximar</strong><p>Pessoas, empresas e organizações podem usar os formulários de interesse no fim desta página.</p><button className="text-link" onClick={()=>{backToObjects();requestAnimationFrame(()=>scrollToSection('participar'));}}>Ir para Junte-se a nós <ArrowRight size={15}/></button></div></div>}
            </section></>}
          </div>}
        </div>
        <p className="box-footnote"><span>✳</span> Memória, território e cultura reunidos em cada objeto.</p>
      </section>
      <section className="intro-band scroll-reveal"><p className="eyebrow">Um convite para percorrer</p><div className="intro-row"><h2>Conhecer de perto<br/>o que nos <em>conecta.</em></h2><p>Abra o baú e explore os objetos; depois, percorra a página para conhecer a identidade, as pessoas e os temas que orientam o Instituto.</p></div></section>
      <section className="institution-section institute-overview scroll-reveal" id="quem-somos" aria-labelledby="about-title">
        <div className="section-kicker"><span>01</span> O Instituto</div>
        <div className="institution-intro-grid">
          <h2 id="about-title">UMA RAIZ QUE<br/><em>APROXIMA SABERES</em></h2>
          <div className="institution-lead"><p>O Instituto Raiz Caiçara tem como missão resgatar, preservar e valorizar a identidade e a cultura das comunidades caiçaras do Paraná.</p><p>Sua visão aproxima conhecimento tradicional caiçara, ciência e vivência comunitária, com atenção à valorização territorial do litoral paranaense.</p><button className="text-link" onClick={findChest}>Explore a apresentação no baú <ArrowRight size={15}/></button></div>
        </div>
        <div className="identity-grid">{identity.map(([label,copy],index)=><article className="identity-card" key={label}><span className="identity-index">0{index+1}</span><h3>{label}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className="institution-section action-section scroll-reveal" id="atuacao" aria-labelledby="action-title">
        <div className="section-kicker"><span>02</span> O que orienta a atuação</div>
        <div className="section-title-row"><h2 id="action-title">TEMAS QUE SE<br/><em>ENCONTRAM</em></h2><p>Cultura caiçara, valorização territorial, educação para sustentabilidade e vida marinha e diálogo entre saberes orientam a atuação do Instituto.</p></div>
        <div className="pillar-grid">
          <article><div className="pillar-icon"><Sprout size={22}/></div><span>01</span><h3>Cultura e identidade</h3><p>Valorização da identidade e da cultura caiçara, com atenção às comunidades do Paraná.</p></article>
          <article><div className="pillar-icon"><Map size={22}/></div><span>02</span><h3>Território</h3><p>Reconhecimento da terra, do mar e da história como parte do patrimônio vivo.</p></article>
          <article><div className="pillar-icon"><Fish size={22}/></div><span>03</span><h3>Educação e vida marinha</h3><p>Educação para a sustentabilidade e para a vida marinha, ligada à valorização territorial.</p></article>
          <article><div className="pillar-icon"><Users size={22}/></div><span>04</span><h3>Mediação entre saberes</h3><p>Diálogo entre comunidades, conhecimento científico, instituições, pesquisadores e poder público.</p></article>
        </div>
        <div className="culture-ribbon"><span className="culture-ribbon-mark" aria-hidden="true">✳</span><div><strong>Saberes que atravessam gerações</strong><p>Pesca artesanal, canoas, festas, música e relação com a Mata Atlântica compõem expressões diversas da cultura caiçara. Cada comunidade guarda histórias e práticas próprias.</p></div><span className="culture-ribbon-wave" aria-hidden="true">〰</span></div>
      </section>

      <section className="institution-section community-section scroll-reveal" id="comunidade" aria-labelledby="community-title">
        <div className="community-image"><img src="https://www.parana.pr.gov.br/sites/default/arquivos_restritos/files/imagem/2026-03/ilhamaciel8.jpg" alt="Canoa e paisagem na comunidade da Ilha do Maciel, litoral do Paraná" loading="lazy" decoding="async" width="1200" height="800"/><small>Registro da Ilha do Maciel · IDR-Paraná</small></div>
        <div className="community-copy"><div className="section-kicker"><span>03</span> Comunidade caiçara</div><h2 id="community-title">TERRA, MAR<br/><em>E MEMÓRIA</em></h2><p>As comunidades caiçaras têm uma relação histórica com o litoral, a pesca artesanal, a agricultura, o extrativismo e os saberes da Mata Atlântica. A cultura se manifesta de formas próprias em cada lugar.</p><p>No litoral do Paraná, território, trabalho e memória seguem conectados ao cotidiano de quem vive junto ao mar.</p><a className="text-link" href="https://www.idrparana.pr.gov.br/Noticia/IDR-Parana-fortalece-o-turismo-de-base-comunitaria-na-Ilha-do-Maciel" target="_blank" rel="noreferrer">Conheça a Ilha do Maciel <ArrowRight size={15}/></a></div>
      </section>

      <section className="watercolor-gallery scroll-reveal" aria-labelledby="watercolor-title"><div className="watercolor-gallery-heading"><p className="section-kicker"><span>✳</span> Paisagem, trabalho e biodiversidade</p><h2 id="watercolor-title">TRAÇOS DO<br/><em>LITORAL</em></h2><p>Ilustrações em aquarela inspiradas no mar, na pesca artesanal e na paisagem costeira.</p></div><div className="watercolor-gallery-grid"><figure className="watercolor-card coast-card"><img src={coastArt} alt="Ilustração em aquarela de uma enseada, moradia, vegetação e mar" loading="lazy"/><figcaption>Paisagem costeira</figcaption></figure><figure className="watercolor-card canoe-card"><img src={canoeArt} alt="Ilustração em aquarela de uma canoa tradicional com rede e boias" loading="lazy"/><figcaption>Pesca e navegação</figcaption></figure><figure className="watercolor-card fish-card"><img src={fishArt} alt="Ilustração em aquarela de um peixe azul e terracota" loading="lazy"/><figcaption>Vida marinha</figcaption></figure><img className="gallery-leaf-art" src={foliageArt} alt="" aria-hidden="true" loading="lazy"/></div></section>

      <section className="institution-section team-section scroll-reveal" id="equipe" aria-labelledby="team-title">
        <div className="section-kicker"><span>04</span> Pessoas e áreas de conhecimento</div>
        <div className="section-title-row"><h2 id="team-title">QUEM FAZ<br/><em>PARTE DO INSTITUTO</em></h2><p>Experiências em Gestão da Informação, Oceanografia, Educação, Meio Ambiente e Direito Socioambiental se encontram no Instituto.</p></div>
        <div className="public-team-grid">{team.map(([name,role,bio])=><article className="public-team-card" key={name}><div className="team-monogram" aria-hidden="true">{name.split(' ').map(part=>part[0]).slice(0,2).join('')}</div><p className="team-role">{role}</p><h3>{name}</h3><p>{bio}</p></article>)}</div>
        <div className="team-values-strip"><span>Ciência</span><i>✳</i><span>Educação</span><i>✳</i><span>Conhecimentos tradicionais</span><i>✳</i><span>Território</span></div>
      </section>

      <section className="institution-section participation-section scroll-reveal" id="participar" aria-labelledby="participation-title">
        <div className="section-kicker"><span>05</span> Junte-se a nós</div>
        <div className="participation-heading"><h2 id="participation-title">UMA CONVERSA PODE<br/><em>ABRIR CAMINHOS</em></h2><p>Conte como gostaria de se aproximar do Instituto ou apresente uma proposta da sua organização.</p></div>
        <div className="participation-grid">
          <article className="interest-panel">
            <div className="interest-heading"><Users size={22}/><span>Para pessoas</span></div>
            <h3>Quero fazer parte</h3><p>Conte quem você é, de onde vem e como gostaria de se aproximar do Instituto.</p>
            <form onSubmit={event=>prepareInterestEmail(event,'participation')}>
              <label>Seu nome<input name="Nome" autoComplete="name" required/></label>
              <label>Seu e-mail<input type="email" name="E-mail" autoComplete="email" required/></label>
              <label>Cidade ou comunidade<input name="Cidade ou comunidade" autoComplete="address-level2" required/></label>
              <label>Como gostaria de se aproximar?<select name="Interesse" defaultValue="" required><option value="" disabled>Selecione uma opção</option><option>Quero conhecer formas de participação</option><option>Quero apoiar ou colaborar</option><option>Tenho interesse em atividades educativas</option><option>Outro assunto</option></select></label>
              <label className="consent-row"><input type="checkbox" name="consent" required/><span>Autorizo incluir estes dados no rascunho de mensagem que vou revisar e enviar.</span></label>
              <button className="form-submit" type="submit">Preparar mensagem <ArrowRight size={15}/></button>
            </form>
          </article>
          <article className="interest-panel business-panel">
            <div className="interest-heading"><BookOpen size={22}/><span>Para empresas e organizações</span></div>
            <h3>Vamos conversar sobre uma parceria?</h3><p>Apresente sua necessidade para que o Instituto avalie uma possível conversa, parceria ou serviço relacionado aos seus eixos.</p>
            <form onSubmit={event=>prepareInterestEmail(event,'organization')}>
              <label>Seu nome<input name="Nome" autoComplete="name" required/></label>
              <label>Empresa ou organização<input name="Empresa ou organização" autoComplete="organization" required/></label>
              <label>Seu e-mail<input type="email" name="E-mail" autoComplete="email" required/></label>
              <label>Assunto<select name="Assunto" defaultValue="" required><option value="" disabled>Selecione uma opção</option><option>Possível parceria institucional</option><option>Conversa sobre um serviço</option><option>Educação e vida marinha</option><option>Pesquisa e troca de conhecimentos</option><option>Outro assunto</option></select></label>
              <label>Conte brevemente o que sua organização procura<textarea name="Mensagem" rows="3" required/></label>
              <label className="consent-row"><input type="checkbox" name="consent" required/><span>Autorizo incluir estes dados no rascunho de mensagem que vou revisar e enviar.</span></label>
              <button className="form-submit" type="submit">Preparar mensagem <ArrowRight size={15}/></button>
            </form>
          </article>
        </div>
        <div className="contact-process-note"><Mail size={17}/><p><strong>Sua privacidade importa.</strong> Ao preparar a mensagem, seu aplicativo de e-mail será aberto para que você revise o conteúdo e escolha o destinatário. Este site não armazena nem transmite os dados do formulário.</p></div>
        {contactNotice&&<p className="contact-status" role="status">{contactNotice}</p>}
      </section>
      <section className="closing-note scroll-reveal"><div className="closing-ornament"><Waves size={39} strokeWidth={1.2}/></div><p>Conheça os saberes que <em>conectam território e mar.</em></p><button onClick={findChest}>Voltar ao baú <ArrowRight size={15}/></button></section>
    </main>
    <footer className="site-footer" id="site-footer" tabIndex="-1"><button className="footer-brand" onClick={home} aria-label="Voltar ao início — Instituto Raiz Caiçara"><img src={logo} alt="" width="1774" height="887"/></button><span>Identidade, território e cultura caiçara · Litoral do Paraná</span><button onClick={home}>Início ↑</button></footer>
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
