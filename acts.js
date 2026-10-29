// Спільна шапка + меню + стрічка актів
const ROOT = document.body.dataset.root || "";
const PAGE = document.body.dataset.page || "";
const TYPES = {rozporyadzhennya:"Розпорядження","protokolne-rishennya":"Протокольне рішення КСО"};
const MENU = [["index.html","Головна"],["rozporyadzhennya.html","Розпорядження"],["protokolni.html","Протокольні рішення КСО"],["search.html","Пошук"],["about.html","Про реєстр"],["admin/new-act.html","＋ Створити акт"]];
const MONTHS = ["січня","лютого","березня","квітня","травня","червня","липня","серпня","вересня","жовтня","листопада","грудня"];
const fmtDate = d => { const [y,m,day]=d.split("-"); return `${+day} ${MONTHS[+m-1]} ${y} року`; };

const hdr = document.getElementById("hdr");
if (hdr) hdr.innerHTML = `<img src="${ROOT}img/coa-kyiv.webp" alt="Герб Києва"><div><h1>Єдиний реєстр актів начальника КМВА — голови КМДА</h1><small>Київська міська військова адміністрація · Київська міська державна адміністрація</small></div>`;
const nav = document.getElementById("nav");
if (nav) nav.innerHTML = MENU.map(([u,t]) => `<a href="${ROOT}${u}"${PAGE&&u.startsWith(PAGE)?' class="on"':''}>${t}</a>`).join("");

function itemHtml(a){
  const st = a.status==="chynnyi" ? '<span class="badge">Чинний</span>' : '<span class="badge off">Втратив чинність</span>';
  return `<div class="item"><a href="${ROOT}${a.url}">${TYPES[a.type]||a.type} № ${a.number} «${a.title}»</a>
  <div class="meta">Дата публікації: ${fmtDate(a.date)} | ${TYPES[a.type]} | ${a.topic||"—"} | ${st}</div></div>`;
}

const feed = document.getElementById("feed");
if (feed) fetch(ROOT+"data/acts.json").then(r=>r.json()).then(all=>{
  const only = feed.dataset.type;
  const list = all.filter(a=>!only||a.type===only).sort((a,b)=>b.date.localeCompare(a.date)||b.number-a.number);
  const q = document.getElementById("q"), st = document.getElementById("st");
  const draw = () => {
    const s = (q?.value||"").toLowerCase(), f = st?.value||"";
    const r = list.filter(a=>(!s||(a.title+a.number+(a.topic||"")).toLowerCase().includes(s))&&(!f||a.status===f));
    feed.innerHTML = r.map(itemHtml).join("") || "<p>Нічого не знайдено.</p>";
  };
  q?.addEventListener("input",draw); st?.addEventListener("change",draw); draw();
}).catch(()=>feed.innerHTML="<p>Не вдалося завантажити data/acts.json (відкрийте сайт через GitHub Pages).</p>");
