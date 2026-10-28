/* Actiuni de admin: login, publicare/editare, vandut, stergere, comenzi */
var photos=[],kept=[],editId="",ords=[];
function thumbs(){
  var th=$("thumbs");th.innerHTML="";
  kept.forEach(function(u,i){th.insertAdjacentHTML("beforeend",'<span class="tb"><img src="'+esc(u)+'" alt=""><button type="button" onclick="rmKept('+i+')">×</button></span>')});
  photos.forEach(function(b,i){th.insertAdjacentHTML("beforeend",'<span class="tb"><img src="'+URL.createObjectURL(b)+'" alt=""><button type="button" onclick="rmNew('+i+')">×</button></span>')});
}
function rmKept(i){kept.splice(i,1);thumbs()}
function rmNew(i){photos.splice(i,1);thumbs()}
$("pics").addEventListener("change",function(e){
  var files=Array.prototype.slice.call(e.target.files,0,Math.max(0,4-kept.length-photos.length));
  files.forEach(function(f){var im=new Image();im.onload=function(){
    var s=Math.min(1,1200/Math.max(im.width,im.height)),c=document.createElement("canvas");
    c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext("2d").drawImage(im,0,0,c.width,c.height);
    c.toBlob(function(b){if(b&&kept.length+photos.length<4){photos.push(b);thumbs()}},"image/jpeg",.8)};im.onerror=function(){toast("Poza nu poate fi citită. Folosește JPG sau PNG.")};im.src=URL.createObjectURL(f)});
  e.target.value="";
});
function oemReq(){document.querySelector('[name=oem]').required=false;$("oemstar").textContent="(opțional)"}
oemReq();
/* butonul "publica si adauga alta" apare doar la anunt nou, nu la dezmembrare si nu la editare */
function agBtn(){var b=$("subagain"),c=document.querySelector("#f [name=cat]");if(b)b.hidden=!!editId||!!(c&&c.value===CAR)}
document.querySelector("#f [name=cat]").addEventListener("change",agBtn);
var KEEP=["marca","model","anDe","anPana","motor","comb","masinaTitlu","vin","moneda","garantie","livrare","vanzator","tel","loc"];
function resetForm(){editId="";kept=[];photos=[];$("f").reset();$("more").open=false;thumbs();$("addtitle").textContent="Vinde o piesă";$("subbtn").textContent="Publică anunțul";oemReq();if(typeof dzMode==="function")dzMode(false);agBtn()}
function newAd(){resetForm();show("add")}
/* reducere: scrii pretul normal, apesi "Reducere 20%", pretul scade, iar cel vechi ramane taiat pe anunt */
function reduce(p){
  var E=$("f").elements,pr=parseFloat(E.pret.value),pv=parseFloat(E.pretVechi.value),base=pv>0?pv:pr;
  if(!(base>0)){toast("Scrie întâi prețul piesei");return}
  if(!p){E.pret.value=base;E.pretVechi.value="";return}
  E.pretVechi.value=base;E.pret.value=Math.round(base*(1-p/100)*100)/100;
}
function find(id){return data.filter(function(d){return d._id===id})[0]}
function edit(id){
  var x=find(id);if(!x)return;resetForm();editId=id;kept=(x.poze||[]).slice();
  var f=$("f");Object.keys(x).forEach(function(k){var el=f.elements[k];if(!el||k==="poze")return;if(el.type==="checkbox")el.checked=!!x[k];else el.value=x[k]});
  thumbs();oemReq();$("addtitle").textContent="Editează anunțul";$("subbtn").textContent="Salvează modificările";agBtn();show("add");
}
/* copie a unui anunt existent (fara poze), ca sa nu retastezi marca, modelul, motorul, garantia etc. */
function dup(id){
  var x=find(id);if(!x)return;resetForm();var f=$("f");
  Object.keys(x).forEach(function(k){var el=f.elements[k];if(!el||k==="poze"||k==="vandut")return;if(el.type==="checkbox")el.checked=!!x[k];else el.value=x[k]});
  oemReq();agBtn();show("add");toast("Copie făcută. Schimbă titlul, pozele și prețul");
  setTimeout(function(){var t=f.elements["titlu"];if(t){t.focus();t.select()}},60);
}
async function login(e){
  e.preventDefault();var f=e.target;
  try{await apiLogin(f.email.value,f.pass.value,f.rem.checked);f.reset();f.pass.type="password";refreshNav();await load();newAd();toast("Te-ai autentificat")}
  catch(err){toast("Email sau parolă greșite")}
}
function logout(){apiLogout();ords=[];refreshNav();render();document.querySelector(".bg").classList.remove("n");show("list");toast("Ai ieșit din cont")}
async function save(e){
  e.preventDefault();
  var form=e.target,fd=new FormData(form),o={},btn=$("subbtn"),ag=$("subagain");
  var again=!editId&&!!e.submitter&&e.submitter.id==="subagain";
  fd.forEach(function(v,k){o[k]=v});
  o.negociabil=!!fd.get("negociabil");o.factura=!!fd.get("factura");
  o.vanzator=(o.vanzator||"").trim()||"Hikar Dezmembrări";o.tel=(o.tel||"").trim()||(typeof SITE_TEL!=="undefined"?SITE_TEL:"");o.loc=(o.loc||"").trim()||"Oradea, Bihor";
  if(!(parseFloat(o.pretVechi)>parseFloat(o.pret)))o.pretVechi="";
  o.cat=o.cat||guessCat(o.titlu+" "+(o.desc||""));
  btn.disabled=true;if(ag)ag.disabled=true;btn.textContent="Se salvează...";
  try{
    var urls=kept.slice();for(var i=0;i<photos.length;i++)urls.push(await apiUpload(photos[i]));
    o.poze=urls;
    if(editId){
      var old=find(editId)||{};if(old.vandut)o.vandut=true;
      await apiPatch(editId,o);
      (old.poze||[]).forEach(function(u){if(urls.indexOf(u)<0)apiDeletePhoto(u)});
    }else await apiInsert(o);
    var was=editId,keep=null;
    if(again){keep={};KEEP.forEach(function(k){if(o[k]!==undefined)keep[k]=o[k]})}
    resetForm();await load();
    if(keep){
      var f=$("f");Object.keys(keep).forEach(function(k){var el=f.elements[k];if(el)el.value=keep[k]});
      window.scrollTo(0,0);f.elements["titlu"].focus();toast("Anunț publicat. Poți adăuga următoarea piesă");
    }else{show("list");toast(was?"Modificări salvate":"Anunț publicat")}
  }catch(err){toast(isAdmin()?"Nu s-a putut salva ("+err.message+")":"Sesiune expirată, intră din nou");if(!isAdmin()){refreshNav();show("login")}}
  btn.disabled=false;if(ag)ag.disabled=false;btn.textContent=editId?"Salvează modificările":"Publică anunțul";
}
/* alege singura categoria dupa cuvintele din titlu */
function guessCat(t){
  t=String(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  var m=[["Suspensie / direcție","stabilizato|bara de directie|bara directie|amortizor|telescop|bieleta"],
   ["Caroserie / faruri","far |faruri|bara|capota|aripa|usa|portiera|oglinda|grila|haion|stop|proiector|lampa"],
   ["Cutie de viteze / transmisie","cutie|ambreiaj|transmisie|diferential|volanta|cardan"],
   ["Frânare","frana|frane|disc|placute|etrier|abs|servofrana"],
   ["Suspensie / direcție","brat|directie|cremaliera|arc |fuzeta|punte|rulment|planetara|bascula"],
   ["Evacuare","evacuare|catalizator|toba|fap|egr|esapament|galerie"],
   ["Răcire / climatizare","radiator|clima|compresor|ventilator|racire|intercooler|termostat|bord ac|incalzire"],
   ["Electrice / electronice","calculator|ecu|senzor|alternator|electromotor|bobina|bujie|modul|butuc|camera|display|ceas|panou|bord|airbag|motoras|macara|releu|cablaj"],
   ["Interior","scaun|volan|plafon|consola|manson|centura|covoras|mocheta|bancheta|oglinda int"],
   ["Roți / jante / anvelope","janta|jante|roata|anvelopa|capac roata"],
   ["Filtre / consumabile","filtru|ulei|lichid|consumabil"],
   ["Motor","motor|injector|turbo|turbina|pompa|chiulasa|piston|bloc|carter|distributie|rampa|vibrochen|galerie adm|clapeta|baie ulei|capac motor|capac culbutori"]];
  for(var i=0;i<m.length;i++)if(new RegExp("(^|[^a-z])("+m[i][1]+")").test(t+" "))return m[i][0];
  return "Alte piese";
}
function clean(x){var o=Object.assign({},x);delete o._id;delete o._d;return o}
async function toggleSold(id){
  var x=find(id);if(!x)return;var o=clean(x);o.vandut=!x.vandut;
  try{await apiPatch(id,o);await load();toast(o.vandut?"Marcat ca vândut":"Anunț redeschis")}catch(e){toast("Nu s-a putut modifica");refreshNav()}
}
async function del(id){
  var x=find(id);if(!x||!confirm("Ștergi definitiv anunțul?"))return;
  try{await apiDelete(id);for(var i=0;i<(x.poze||[]).length;i++)await apiDeletePhoto(x.poze[i]);await load();toast("Anunț șters")}catch(e){toast("Nu s-a putut șterge");refreshNav()}
}
/* ----- comenzi ----- */
async function loadOrders(){try{ords=await apiOrders();renderOrders()}catch(e){$("ordbox").innerHTML='<div class="empty">Comenzile nu se pot încărca. Ai rulat SQL-ul pentru tabelul comenzi?</div>'}}
function renderOrders(){
  var n=ords.filter(function(w){return w.data.status!=="procesat"}).length,b=$("ordbox");
  $("ordn").textContent=n?"("+n+")":"";document.querySelector(".bg").classList.toggle("n",n>0);
  if(!ords.length){b.innerHTML='<div class="empty">Nu ai comenzi încă.</div>';return}
  b.innerHTML=ords.slice().sort(function(p,q){return (p.data.status==="procesat")-(q.data.status==="procesat")}).map(function(w){
    var o=w.data,id=esc(w.id),done=o.status==="procesat",tel=String(o.tel||"").replace(/[^\d+]/g,"");
    return '<div class="od'+(done?"":" new")+'"><div class="oh"><b>'+esc(o.piesa)+'</b><span class="meta">'+new Date(w.created_at).toLocaleString("ro-RO")+(done?" · procesată":" · nouă")+'</span></div>'
    +(o.tip==="cerere"?'<div class="meta">Mașina: <b>'+esc(o.marca)+' '+esc(o.model)+'</b>'+(o.an?' · '+esc(o.an):'')+(o.motor?' · '+esc(o.motor):'')+(o.vin?' · VIN: <b>'+esc(o.vin)+'</b>':'')+'</div>':'<div class="meta">'+esc(o.cant)+' buc. · '+esc(o.pret)+' '+esc(o.moneda)+(o.oem?' · '+esc(o.oem):'')+' · <a href="anunt.html?id='+esc(o.piesaId)+'" target="_blank" rel="noopener">vezi anunțul</a></div>')
    +'<div><b>'+esc(o.nume)+'</b> · <a href="tel:'+esc(tel)+'">'+esc(o.tel)+'</a>'+(o.email?' · <a href="mailto:'+esc(o.email)+'">'+esc(o.email)+'</a>':'')+'</div>'
    +(o.adresa?'<div class="meta">Adresă: '+esc(o.adresa)+'</div>':'')+(o.mesaj?'<div class="msgb">'+esc(o.mesaj)+'</div>':'')
    +'<div class="a"><button onclick="ordDone(\''+id+'\','+(done?0:1)+')">'+(done?IC.open+"Redeschide":IC.sold+"Marchează procesată")+'</button><button class="dl" onclick="ordDel(\''+id+'\')">'+IC.del+'Șterge</button></div></div>';
  }).join("");
}
async function ordDone(id,v){
  var w=ords.filter(function(x){return x.id===id})[0];if(!w)return;
  try{await apiOrderPatch(id,Object.assign({},w.data,{status:v?"procesat":"nou"}));await loadOrders()}catch(e){toast("Nu s-a putut modifica")}
}
async function ordDel(id){if(!confirm("Ștergi comanda?"))return;try{await apiOrderDel(id);await loadOrders()}catch(e){toast("Nu s-a putut șterge")}}
refreshNav();load();

function togglePw(b){var i=b.parentNode.querySelector("input"),s=i.type==="password",t=s?"Ascunde parola":"Arată parola";
  i.type=s?"text":"password";b.classList.toggle("on",s);b.setAttribute("data-tip",t);b.setAttribute("aria-label",t)}
(function(){if(location.hash==="#cere")show("req")})();
