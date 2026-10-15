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
    c.width=im.width*s;c.height=im.height*s;c.getContext("2d").drawImage(im,0,0,c.width,c.height);
    c.toBlob(function(b){photos.push(b);thumbs()},"image/jpeg",.8)};im.src=URL.createObjectURL(f)});
  e.target.value="";
});
function oemReq(){var sh=document.querySelector('[name=stare]').value==="Second hand";document.querySelector('[name=oem]').required=!sh;$("oemstar").textContent=sh?"(opțional)":"*"}
document.querySelector('[name=stare]').addEventListener("change",oemReq);
function resetForm(){editId="";kept=[];photos=[];$("f").reset();thumbs();oemReq();$("addtitle").textContent="Publică o piesă";$("subbtn").textContent="Publică anunțul"}
function newAd(){resetForm();show("add")}
function find(id){return data.filter(function(d){return d._id===id})[0]}
function edit(id){
  var x=find(id);if(!x)return;resetForm();editId=id;kept=(x.poze||[]).slice();
  var f=$("f");Object.keys(x).forEach(function(k){var el=f.elements[k];if(!el||k==="poze")return;if(el.type==="checkbox")el.checked=!!x[k];else el.value=x[k]});
  thumbs();oemReq();$("addtitle").textContent="Editează anunțul";$("subbtn").textContent="Salvează modificările";show("add");
}
async function login(e){
  e.preventDefault();var f=e.target;
  try{await apiLogin(f.email.value,f.pass.value);f.reset();refreshNav();await load();show("add");toast("Te-ai autentificat")}
  catch(err){toast("Email sau parolă greșite")}
}
function logout(){apiLogout();ords=[];refreshNav();render();document.querySelector(".bg").classList.remove("n");show("list");toast("Ai ieșit din cont")}
async function save(e){
  e.preventDefault();
  var form=e.target,fd=new FormData(form),o={},btn=$("subbtn"),lbl=btn.textContent;
  fd.forEach(function(v,k){o[k]=v});
  o.negociabil=!!fd.get("negociabil");o.factura=!!fd.get("factura");
  btn.disabled=true;btn.textContent="Se salvează...";
  try{
    var urls=kept.slice();for(var i=0;i<photos.length;i++)urls.push(await apiUpload(photos[i]));
    o.poze=urls;
    if(editId){
      var old=find(editId)||{};if(old.vandut)o.vandut=true;
      await apiPatch(editId,o);
      (old.poze||[]).forEach(function(u){if(urls.indexOf(u)<0)apiDeletePhoto(u)});
    }else await apiInsert(o);
    var was=editId;resetForm();await load();show("list");toast(was?"Modificări salvate":"Anunț publicat");
  }catch(err){toast(isAdmin()?"Nu s-a putut salva ("+err.message+")":"Sesiune expirată, intră din nou");if(!isAdmin()){refreshNav();show("login")}}
  btn.disabled=false;btn.textContent=editId?"Salvează modificările":"Publică anunțul";
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
  b.innerHTML=ords.map(function(w){
    var o=w.data,id=esc(w.id),done=o.status==="procesat",tel=String(o.tel||"").replace(/[^\d+]/g,"");
    return '<div class="od'+(done?"":" new")+'"><div class="oh"><b>'+esc(o.piesa)+'</b><span class="meta">'+new Date(w.created_at).toLocaleString("ro-RO")+(done?" · procesată":" · nouă")+'</span></div>'
    +'<div class="meta">'+esc(o.cant)+' buc. · '+esc(o.pret)+' '+esc(o.moneda)+(o.oem?' · '+esc(o.oem):'')+' · <a href="anunt.html?id='+esc(o.piesaId)+'" target="_blank" rel="noopener">vezi anunțul</a></div>'
    +'<div><b>'+esc(o.nume)+'</b> · <a href="tel:'+esc(tel)+'">'+esc(o.tel)+'</a>'+(o.email?' · <a href="mailto:'+esc(o.email)+'">'+esc(o.email)+'</a>':'')+'</div>'
    +(o.adresa?'<div class="meta">Adresă: '+esc(o.adresa)+'</div>':'')+(o.mesaj?'<div class="msgb">'+esc(o.mesaj)+'</div>':'')
    +'<div class="a"><button onclick="ordDone(\''+id+'\','+(done?0:1)+')">'+(done?"Redeschide":"Marchează procesată")+'</button><button onclick="ordDel(\''+id+'\')">Șterge</button></div></div>';
  }).join("");
}
async function ordDone(id,v){
  var w=ords.filter(function(x){return x.id===id})[0];if(!w)return;
  try{await apiOrderPatch(id,Object.assign({},w.data,{status:v?"procesat":"nou"}));await loadOrders()}catch(e){toast("Nu s-a putut modifica")}
}
async function ordDel(id){if(!confirm("Ștergi comanda?"))return;try{await apiOrderDel(id);await loadOrders()}catch(e){toast("Nu s-a putut șterge")}}
refreshNav();load();
