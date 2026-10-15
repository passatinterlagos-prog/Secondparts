/* Actiuni de admin: login, publicare cu poze, vandut, stergere */
var photos=[];
$("pics").addEventListener("change",function(e){
  photos=[];var th=$("thumbs");th.innerHTML="";
  Array.prototype.slice.call(e.target.files,0,4).forEach(function(f){
    var im=new Image();im.onload=function(){
      var s=Math.min(1,1200/Math.max(im.width,im.height)),c=document.createElement("canvas");
      c.width=im.width*s;c.height=im.height*s;c.getContext("2d").drawImage(im,0,0,c.width,c.height);
      c.toBlob(function(b){photos.push(b);var t=document.createElement("img");t.src=URL.createObjectURL(b);t.alt="Previzualizare";th.appendChild(t)},"image/jpeg",.8);
    };im.src=URL.createObjectURL(f);
  });
});
async function login(e){
  e.preventDefault();var f=e.target;
  try{await apiLogin(f.email.value,f.pass.value);f.reset();refreshNav();await load();show("add");toast("Te-ai autentificat")}
  catch(err){toast("Email sau parolă greșite")}
}
function logout(){apiLogout();refreshNav();render();show("list");toast("Ai ieșit din cont")}
async function save(e){
  e.preventDefault();
  var form=e.target,fd=new FormData(form),o={};
  fd.forEach(function(v,k){o[k]=v});
  o.negociabil=!!fd.get("negociabil");o.factura=!!fd.get("factura");
  var btn=form.querySelector("button[type=submit]");btn.disabled=true;btn.textContent="Se publică...";
  try{
    o.poze=[];for(var i=0;i<photos.length;i++)o.poze.push(await apiUpload(photos[i]));
    await apiInsert(o);
    form.reset();photos=[];$("thumbs").innerHTML="";
    await load();show("list");toast("Anunț publicat");
  }catch(err){toast(isAdmin()?"Nu s-a putut publica. Încearcă din nou.":"Sesiune expirată, intră din nou");if(!isAdmin()){refreshNav();show("login")}}
  btn.disabled=false;btn.textContent="Publică anunțul";
}
function clean(x){var o=Object.assign({},x);delete o._id;delete o._d;return o}
async function toggleSold(id){
  var x=data.filter(function(d){return d._id===id})[0];if(!x)return;
  var o=clean(x);o.vandut=!x.vandut;
  try{await apiPatch(id,o);await load();toast(o.vandut?"Marcat ca vândut":"Anunț redeschis")}catch(e){toast("Nu s-a putut modifica");refreshNav()}
}
async function del(id){
  var x=data.filter(function(d){return d._id===id})[0];if(!x||!confirm("Ștergi definitiv anunțul?"))return;
  try{await apiDelete(id);for(var i=0;i<(x.poze||[]).length;i++)await apiDeletePhoto(x.poze[i]);await load();toast("Anunț șters")}catch(e){toast("Nu s-a putut șterge");refreshNav()}
}
refreshNav();load();
