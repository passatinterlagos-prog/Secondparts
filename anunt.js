/* Pagina unui anunt: galerie, detalii, comanda, anunturi similare */
function $(i){return document.getElementById(i)}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function toast(t){var m=$("msg");m.textContent=t;m.style.display="block";setTimeout(function(){m.style.display="none"},2800)}
var cur=null,id=new URLSearchParams(location.search).get("id");
function sp(k,v){return v?'<tr><td>'+k+'</td><td>'+esc(v)+'</td></tr>':''}
function pick(i){var im=document.querySelectorAll(".th img");$("bigimg").src=cur.poze[i];$("big").href=cur.poze[i];im.forEach(function(e,j){e.className=j===i?"on":""})}
function share(){var u=location.href;if(navigator.clipboard)navigator.clipboard.writeText(u).then(function(){toast("Link copiat")});else prompt("Copiază linkul:",u)}
async function init(){
  var box=$("ad");
  try{
    var all=(await apiList()).map(function(w){var o=w.data;o._id=w.id;o._d=new Date(w.created_at).toLocaleDateString("ro-RO");return o});
    cur=all.filter(function(x){return x._id===id})[0];
    if(!cur){box.innerHTML='<div class="empty">Anunțul nu a fost găsit sau a fost șters.</div>';return}
    document.title=cur.titlu+" | SecondParts";draw(cur);similar(all);
  }catch(e){box.innerHTML='<div class="empty">Nu s-a putut încărca anunțul.</div>'}
}
function draw(x){
  var ph=x.poze||[],tel=String(x.tel).replace(/[^\d+]/g,""),wa="https://wa.me/"+tel.replace(/^0/,"40").replace("+",""),
      ani=x.anDe||x.anPana?(x.anDe||"?")+" - "+(x.anPana||"?"):"";
  var gal=ph.length?'<a id="big" href="'+esc(ph[0])+'" target="_blank" rel="noopener"><img id="bigimg" src="'+esc(ph[0])+'" alt="'+esc(x.titlu)+'"></a>'
    +(ph.length>1?'<div class="th">'+ph.map(function(u,i){return '<img src="'+esc(u)+'" class="'+(i?"":"on")+'" onclick="pick('+i+')" alt="Poza '+(i+1)+'">'}).join("")+'</div>':"")
    :'<div class="ph" style="height:340px;border:1px solid var(--line)">Fără poză</div>';
  var ord=x.vandut?'<div class="soldb">Vândut</div>':'<form id="of" onsubmit="order(event)"><fieldset><legend>Comandă / cere ofertă</legend><div class="grid">'
    +'<label>Nume *<input name="nume" required></label><label>Telefon *<input name="tel" type="tel" required></label>'
    +'<label>Email<input name="email" type="email"></label><label>Cantitate<input name="cant" type="number" min="1" value="1"></label>'
    +'<label class="wide">Adresă de livrare<input name="adresa" placeholder="Localitate, stradă, număr (pentru curier)"></label>'
    +'<label class="wide">Mesaj<textarea name="mesaj" placeholder="Întrebări, seria șasiului pentru verificarea compatibilității..."></textarea></label>'
    +'<label class="chk wide"><input type="checkbox" required> Sunt de acord ca datele mele să fie folosite pentru a răspunde acestei comenzi.</label>'
    +'</div><p class="note2">Comanda nu e o plată online. Vânzătorul te contactează pentru confirmare, preț final și livrare.</p></fieldset><button class="btn" id="ob" type="submit">Trimite comanda</button></form>';
  $("ad").innerHTML='<div class="dg"><div class="gal">'+gal+'</div><div class="inf">'
    +'<div><span class="tag'+(x.stare==="Nouă"?" ok":"")+'">'+esc(x.stare)+'</span><span class="meta">'+esc(x.cat)+'</span></div>'
    +'<h1>'+esc(x.titlu)+'</h1>'+(x.oem?'<span class="oem">'+esc(x.oem)+'</span>':"")
    +'<div class="price">'+esc(x.pret)+" "+esc(x.moneda)+(x.negociabil?' <span class="meta">negociabil</span>':"")+'</div>'
    +'<table class="sp">'+sp("Compatibil",x.marca+" "+x.model)+sp("Ani",ani)+sp("Motorizare",x.motor)+sp("Combustibil",x.comb)+sp("Marca piesei",x.marcaPiesa)+sp("Cod alternativ",x.ref)
    +sp("Cantitate",x.cant>1?x.cant+" buc.":"")+sp("Garanție",x.garantie)+sp("Livrare",x.livrare)+sp("Factură",x.factura?"Da":"")+sp("Vânzător",x.vanzator+", "+x.loc)+sp("Publicat",x._d)+'</table>'
    +(x.desc?'<div style="white-space:pre-wrap">'+esc(x.desc)+'</div>':"")
    +'<div class="ct"><a class="call" href="tel:'+esc(tel)+'">Sună</a><a href="'+esc(wa)+'" target="_blank" rel="noopener">WhatsApp</a><button onclick="share()">Copiază link</button></div>'
    +'</div></div>'+ord;
}
async function order(e){
  e.preventDefault();var f=e.target,o={},fd=new FormData(f),b=$("ob");
  fd.forEach(function(v,k){o[k]=v});
  o.piesaId=cur._id;o.piesa=cur.titlu;o.oem=cur.oem||"";o.pret=cur.pret;o.moneda=cur.moneda;o.status="nou";
  b.disabled=true;b.textContent="Se trimite...";
  try{await apiOrderInsert(o);f.outerHTML='<div class="soldb" style="border-color:var(--gold);color:var(--gold2)">Comanda a fost trimisă. Te contactăm în curând.</div>'}
  catch(err){toast("Nu s-a putut trimite. Încearcă din nou sau sună.");b.disabled=false;b.textContent="Trimite comanda"}
}
function similar(all){
  var r=all.filter(function(x){return x._id!==cur._id&&!x.vandut&&(x.cat===cur.cat||x.marca===cur.marca)}).slice(0,4);
  if(!r.length)return;
  $("simw").innerHTML='<div class="sh"><h2>Anunțuri similare</h2></div><div class="list">'+r.map(function(x){
    return '<article class="item"><a class="ph" href="anunt.html?id='+esc(x._id)+'">'+(x.poze&&x.poze[0]?'<img loading="lazy" src="'+esc(x.poze[0])+'" alt="">':"Fără poză")+'</a><div class="b"><h3><a href="anunt.html?id='+esc(x._id)+'">'+esc(x.titlu)+'</a></h3><div class="price">'+esc(x.pret)+" "+esc(x.moneda)+'</div></div></article>';
  }).join("")+'</div>';
}
init();
