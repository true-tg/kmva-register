const $=id=>document.getElementById(id), ed=$("ed");
document.querySelectorAll(".bar button[data-cmd]").forEach(b=>b.onclick=()=>{document.execCommand(b.dataset.cmd);ed.focus()});
const fromSrc=()=>{if(ed.dataset.src){ed.innerHTML=ed.textContent;ed.dataset.src="";}};
$("htmlBtn").onclick=()=>{ if(ed.dataset.src){fromSrc();} else{ed.textContent=ed.innerHTML;ed.dataset.src="1";} };
// Вставка з Word: лишаємо тільки чисті абзаци
ed.addEventListener("paste",e=>{
  e.preventDefault();
  const t=(e.clipboardData.getData("text/plain")||"").trim();
  document.execCommand("insertHTML",false,t.split(/\n+/).map(l=>"<p>"+l.replace(/&/g,"&amp;").replace(/</g,"&lt;")+"</p>").join(""));
});
$("d").valueAsDate=new Date();
$("make").onclick=()=>{
  fromSrc();
  const n=$("n").value.trim(), d=$("d").value, t=$("t").value, ti=$("ti").value.trim(), s=$("s").value, tp=$("tp").value;
  if(!n||!d||!ti||!ed.textContent.trim()){alert("Заповніть номер, дату, назву й текст.");return;}
  const kind=t==="rozporyadzhennya"?"РОЗПОРЯДЖЕННЯ":"ПРОТОКОЛЬНЕ РІШЕННЯ КОМІТЕТУ СТРАТЕГІЧНОЇ ОБОРОНИ";
  const file=(t==="rozporyadzhennya"?"":"pr-")+d+"-"+n+".html";
  const body=ed.innerHTML.replace(/<div>/g,"<p>").replace(/<\/div>/g,"</p>");
  const page=`<!DOCTYPE html>
<html lang="uk"><head><meta charset="utf-8"><title>${kind} № ${n}</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="../css/style.css"><link rel="stylesheet" href="../css/print.css"></head>
<body data-root="../" data-page="">
<header id="hdr"></header>
<div class="wrap"><nav id="nav"></nav><main>
<div class="sheet">
${s==="chynnyi"?"":'<div class="off-note">Втратив чинність</div>'}
<div class="c org">КИЇВСЬКА МІСЬКА ВІЙСЬКОВА АДМІНІСТРАЦІЯ<br>Київська міська державна адміністрація</div>
<div class="c kind">${kind}</div>
<div class="no" id="dt" data-date="${d}"> № ${n}</div>
<p class="c" style="text-indent:0">${ti}</p>
${body}
<div class="sign">Начальник військової адміністрації [Ім'я Прізвище]</div>
</div>
<div class="tools"><button onclick="window.print()">🖨️ Версія для друку</button> · <a href="../index.html">← До реєстру</a></div>
</main></div>
<script src="../js/acts.js"><\/script>
<script>const e=document.getElementById("dt");e.textContent=fmtDate(e.dataset.date)+e.textContent;<\/script>
</body></html>`;
  $("fn").textContent="acts/"+file;
  $("html").value=page;
  $("json").value=JSON.stringify({number:n,date:d,type:t,status:s,topic:tp,title:ti,url:"acts/"+file},null,2)+",";
  $("out").style.display="block";
};
$("dl").onclick=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([$("html").value],{type:"text/html"}));a.download=$("fn").textContent.split("/")[1];a.click();};
