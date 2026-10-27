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

/* masina la dezmembrat: acelasi formular, completat pentru o masina intreaga */
var DZ_CHIPS=["Uși","Capotă","Aripi","Bară față","Bară spate","Faruri","Stopuri","Portbagaj","Motor","Cutie de viteze","Interior","Scaune","Bord","Oglinzi","Jante"];
var PG_ADD0=PG.add;
function dzLbl(inp,t){var l=inp&&inp.closest?inp.closest("label"):null;if(l&&l.firstChild&&l.firstChild.nodeType===3)l.firstChild.nodeValue=t}
function dzMode(on){
  var f=$("f");if(!f)return;
  var E=f.elements,c=E["cat"],t=E["titlu"],d=E["desc"],p=E["pret"];
  if(on){c.value=CAR}else if(c.value===CAR){c.value=""}
  p.required=!on;if(E["oem"])E["oem"].required=false;
  t.placeholder=on?"Ex: Dezmembrez VW Passat B8 2.0 TDI":"Ex: Far stânga Golf 7";
  if(on&&!t.value)t.value="Dezmembrez ";
  dzLbl(t,on?"Titlul anunțului *":"Numele piesei *");
  d.placeholder=on?"Ex: Vând uși, capotă, aripi, faruri, bară față, motor, cutie, interior":"Stare, defecte, ce include...";
  dzLbl(d,on?"Ce piese vinzi de la mașină (uși, capotă etc.)":"Descriere");
  if(on&&!d.value)d.value="Vând ";else if(!on&&d.value==="Vând ")d.value="";
  var cl=c.closest("label");if(cl)cl.hidden=on;
  dzLbl(E["anDe"],on?"An fabricație":"An de la / fabricație");
  var pl=E["anPana"]&&E["anPana"].closest("label");if(pl)pl.hidden=on;
  var at=$("addtitle");if(at)at.textContent=on?"Adaugă la dezmembrat":"Vinde o piesă";
  dzLbl(p,on?"Preț (nu e obligatoriu)":"Preț *");
  var lg=function(id,txt){var e=document.querySelector("#"+id+" legend");if(e)e.textContent=txt};
  lg("fs-part",on?"Mașina":"Ce vinzi");lg("fs-compat",on?"Ce mașină dezmembrezi":"Pentru ce mașină");lg("fs-price",on?"Preț (nu e obligatoriu)":"Preț");
  var box=$("dzchips");
  if(!box){
    box=document.createElement("div");box.id="dzchips";box.className="wide dzc";
    box.innerHTML=DZ_CHIPS.map(function(x){return '<button type="button">'+x+'</button>'}).join("");
    d.closest("label").insertAdjacentElement("afterend",box);
    box.addEventListener("click",function(e){
      var b=e.target.closest?e.target.closest("button"):null;if(!b)return;
      var ta=f.elements["desc"],v=ta.value.replace(/[,\s]+$/,""),w=b.textContent;
      if(v.toLowerCase().indexOf(w.toLowerCase())>-1)return;
      ta.value=v?(/^vând$/i.test(v)?v+" ":v+", ")+w.toLowerCase():w;
    });
  }
  box.hidden=!on;
  PG.add=on?["Adaugă la dezmembrat","Alege marca, modelul și anul (ex: VW Passat 2016), apoi scrie ce piese vinzi: uși, capotă, faruri, motor etc."]:PG_ADD0;
  if(!$("add").hidden)pageBanner("add");
}
(function(){
  var n=window.newAd,e=window.edit;
  if(typeof n==="function"){
    window.newAd=function(){var r=n.apply(this,arguments);dzMode(false);return r};
    window.newDezm=function(){var r=n.apply(this,arguments);dzMode(true);return r};
  }else{window.newDezm=function(){show("add");dzMode(true)}}
  if(typeof e==="function"){
    window.edit=function(id){var r=e.apply(this,arguments);
      Promise.resolve(r).then(function(){var x=data.filter(function(a){return a._id===id})[0];dzMode(!!(x&&x.cat===CAR))});
      return r};
  }
})();

/* Garantie / Retur / Factura / VIN: la atingere se arata descrierea */
(function(){
  var L=document.querySelectorAll(".trust2 .w>div");
  Array.prototype.forEach.call(L,function(d){d.setAttribute("role","button");d.setAttribute("tabindex","0");d.setAttribute("aria-expanded","false")});
  function tg(d){var o=d.classList.toggle("open");d.setAttribute("aria-expanded",o)}
  document.addEventListener("click",function(e){var d=e.target.closest?e.target.closest(".trust2 .w>div"):null;if(d)tg(d)});
  document.addEventListener("keydown",function(e){if((e.key==="Enter"||e.key===" ")&&e.target.matches&&e.target.matches(".trust2 .w>div")){e.preventDefault();tg(e.target)}});
})();
