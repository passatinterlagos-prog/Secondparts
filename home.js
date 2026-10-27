/* Prima pagina: selector marca / model / piesa, filtre si etichete */
function hOpts(sel,items,ph){var v=sel.value;sel.innerHTML='<option value="">'+ph+'</option>'+items.map(function(n){return '<option>'+esc(n)+'</option>'}).join("");if(items.indexOf(v)>-1)sel.value=v}
function hModels(brand){var L=catAll()[brand]||[];return L.map(function(e){return e.n})}
function hMod(sel,brand,ph){hOpts(sel,hModels(brand),ph);sel.disabled=!brand}
function homeFill(){
  var br=Object.keys(catAll()).sort(function(a,b){return a.localeCompare(b,"ro")});
  hOpts($("hb"),br,"Alege marca auto");hMod($("hm"),$("hb").value,"Alege modelul");
  hOpts($("hp"),cats,"Alege piesa");
  hOpts($("fb"),br,"Toate mărcile");hMod($("fm"),$("fb").value,"Toate modelele");
}
function hbChange(){var m=$("hm");m.value="";hMod(m,$("hb").value,"Alege modelul")}
function fbChange(){var m=$("fm");m.value="";hMod(m,$("fb").value,"Toate modelele");render()}
function togglePsel(){var o=!$("psel").classList.contains("open");$("psel").classList.toggle("open",o);$("pdb").setAttribute("aria-expanded",o)}
function toggleF(){var p=$("fpanel"),o=p.hidden;p.hidden=!o;$("fbtn").setAttribute("aria-expanded",o)}
function homeReset(){$("fb").value="";hMod($("fm"),"","Toate modelele");$("hb").value="";hMod($("hm"),"","Alege modelul");$("hp").value=""}
function closePsel(){$("psel").classList.remove("open");$("pdb").setAttribute("aria-expanded",false)}
function psGo(){
  var b=$("hb").value,m=$("hm").value,p=$("hp").value;
  if(!b&&!p){toast("Alege cel puțin marca sau piesa");return}
  $("q").value="";$("hq").value="";$("fc").value=p;
  $("fb").value=b;hMod($("fm"),b,"Toate modelele");$("fm").value=m;
  closePsel();show("list");render();$("list").scrollIntoView();
}
/* etichetele filtrelor active, fiecare se scoate cu o atingere */
function homeChips(){
  var f=[["q","Text: "+$("q").value.trim(),$("q").value.trim()],["fb",$("fb").value,$("fb").value],["fm",$("fm").value,$("fm").value],["fc",$("fc").value,$("fc").value]].filter(function(x){return x[2]});
  $("chips").innerHTML=f.length?f.map(function(x){return '<button type="button" aria-label="Scoate filtrul '+esc(x[1])+'" onclick="clrF(\''+x[0]+'\')">'+esc(x[1])+' <span aria-hidden="true">×</span></button>'}).join("")+'<button type="button" class="clr" onclick="clrF(\'all\')">Șterge filtrele</button>':"";
  $("fn").textContent=f.length?"("+f.length+")":"";$("fbtn").classList.toggle("on",f.length>0);
}
function clrF(k){
  if(k==="all"||k==="q"){$("q").value="";$("hq").value=""}
  if(k==="all"||k==="fc"){$("fc").value="";$("hp").value=""}
  if(k==="all"||k==="fb"){$("fb").value="";hMod($("fm"),"","Toate modelele");$("hb").value="";hMod($("hm"),"","Alege modelul")}
  if(k==="fm"){$("fm").value="";$("hm").value=""}
  render();
}
/* lista de marci se completeaza si dupa ce vin modelele adaugate din Admin */
(function(){var o=catFillBrands;catFillBrands=function(){o();homeFill()}})();
homeFill();

/* atingere in afara panourilor: se inchid singure */
document.addEventListener("click",function(e){
  var t=e.target;if(!t||!t.closest)return;
  if($("psel").classList.contains("open")&&!t.closest("#psel,#pdb"))closePsel();
  var fp=$("fpanel");if(!fp.hidden&&!t.closest("#fpanel,#fbtn,.bar2,#chips")){fp.hidden=true;$("fbtn").setAttribute("aria-expanded",false)}
});
/* navigare: buton Inapoi + butonul Inapoi al telefonului */
var PG={req:["Cere o piesă","Spune-ne ce mașină ai și ce piesă cauți, iar noi te sunăm."],
 catalog:["Mărci și modele","Adaugă sau corectează modelele care apar la completarea automată din formulare."],
 mine:["Anunțurile mele","Editează, marchează ca vândute sau șterge piesele publicate."],
 stats:["Statistici","Câte piese ai în stoc, cât valorează și ce văd vizitatorii."],
 orders:["Comenzi primite","Comenzile și cererile trimise de clienți, de procesat sau terminate."],
 login:["Autentificare admin","Intră în cont ca să vinzi piese și să gestionezi anunțurile."],
 add:["Vinde o piesă","Completează numele, descrierea, pozele, marca, modelul și prețul. Restul e opțional."]};
var BKSVG='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
function pageBanner(w){
  var b=$("pgb"),hb=$("hbk"),n=!!(history.state&&history.state.n>0);
  if(hb){hb.hidden=!n;hb.parentNode.classList.toggle("hasbk",n)}
  if(w==="list"){b.hidden=true;return}
  var p=PG[w]||["",""],t=p[0],d=p[1];
  if(w==="add"&&typeof editId!=="undefined"&&editId){t="Editează anunțul";d="Modifică datele piesei și salvează."}
  b.innerHTML='<div class="pgh"><h2 class="pgt">'+esc(t)+'</h2><button type="button" class="bkb" data-tip="Înapoi la pagina anterioară" onclick="goBack()">'+BKSVG+' Înapoi</button></div><p>'+esc(d)+'</p>';
  b.hidden=false;
}
function navTrack(w,pop){
  try{
    var s=history.state||{};
    if(!pop){if(s.v!==w)history.pushState({v:w,n:(s.n||0)+1},"")}
    else if(s.v!==w)history.replaceState({v:w,n:s.n||0},"");
  }catch(e){}
  pageBanner(w);
}
function goBack(){var s=history.state;if(s&&s.n>0)history.back();else show("list")}
window.addEventListener("popstate",function(e){show((e.state&&e.state.v)||"list",true)});
try{if(!history.state)history.replaceState({v:"list",n:0},"")}catch(e){}
