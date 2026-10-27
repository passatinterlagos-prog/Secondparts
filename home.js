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
function psGo(){
  var b=$("hb").value,m=$("hm").value,p=$("hp").value;
  if(!b&&!p){toast("Alege cel puțin marca sau piesa");return}
  $("q").value="";$("hq").value="";$("fc").value=p;
  $("fb").value=b;hMod($("fm"),b,"Toate modelele");$("fm").value=m;
  show("list");render();$("list").scrollIntoView();
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
