/* Pagina unui anunt: galerie, detalii, comanda, anunturi similare */
function $(i){return document.getElementById(i)}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
var tt;function toast(t){var m=$("msg");m.textContent=t;m.style.display="block";clearTimeout(tt);tt=setTimeout(function(){m.style.display="none"},2800)}
var CAR="Mașini la dezmembrat";
function pz(x){var p=parseFloat(x.pret);return(!(p>0)&&x.cat===CAR)?"Mașină la dezmembrat":esc(x.pret)+" "+esc(x.moneda)}
var ALL=[],cur=null,id=new URLSearchParams(location.search).get("id");
function sp(k,v){return v?'<tr><td>'+k+'</td><td>'+esc(v)+'</td></tr>':''}
function pick(i){var s=document.querySelector(".big .cs");if(s)s.scrollTo({left:i*s.clientWidth,behavior:"smooth"})}
function share(){var u=location.href;if(navigator.clipboard)navigator.clipboard.writeText(u).then(function(){toast("Link copiat")}).catch(function(){prompt("Copiază linkul:",u)});else prompt("Copiază linkul:",u)}
async function init(){
  var box=$("ad");
  try{
    var all=(await apiList()).map(function(w){var o=w.data;o._id=w.id;o._d=new Date(w.created_at).toLocaleDateString("ro-RO");return o});
    ALL=all;cur=all.filter(function(x){return x._id===id})[0];
    if(!cur){box.innerHTML='<div class="empty">Anunțul nu a fost găsit sau a fost șters.</div>';return}
    document.title=cur.titlu+" | Hikar";draw(cur);similar(all);track("vedere",cur._id,cur.titlu);
  }catch(e){box.innerHTML='<div class="empty">Nu s-a putut încărca anunțul.</div>'}
}
function draw(x){
  var ph=x.poze||[],tel=String(x.tel||"").replace(/[^\d+]/g,""),wa="https://wa.me/"+tel.replace(/^0/,"40").replace("+","")+"?text="+encodeURIComponent("Bună! Mă interesează: "+x.titlu+(x.oem?" ("+x.oem+")":"")+(parseFloat(x.pret)>0?" - "+x.pret+" "+x.moneda:"")+". "+new URL("anunt.html?id="+x._id,location.href).href),
      ani=x.anDe||x.anPana?(x.anDe||"?")+" - "+(x.anPana||"?"):"";
  var gal=ph.length?carHTML(ph,x.titlu,true)
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
    +'<div><span class="tag'+""+'">'+esc(x.stare)+'</span><span class="meta">'+esc(x.cat)+'</span></div>'
    +'<h1>'+esc(x.titlu)+'</h1>'+(x.oem?'<span class="oem">'+esc(x.oem)+'</span>':"")
    +'<div class="price">'+pz(x)+(x.negociabil?' <span class="meta">negociabil</span>':"")+'</div>'
    +'<table class="sp">'+sp("Compatibil",x.marca+" "+x.model)+sp("Ani",ani)+sp("Motorizare",x.motor)+sp("Combustibil",x.comb)+sp("Marca piesei",x.marcaPiesa)+sp("Cod alternativ",x.ref)
    +sp("Cantitate",x.cant>1?x.cant+" buc.":"")+sp("Garanție",x.garantie)+sp("Livrare",x.livrare)+sp("Factură",x.factura?"Da":"")+sp("Vânzător",x.vanzator+", "+x.loc)+sp("Publicat",x._d)+'</table>'
    +(x.desc?'<div style="white-space:pre-wrap">'+esc(x.desc)+'</div>':"")
    +(x.masinaTitlu?'<div class="provb"><div><span class="meta">Provine din mașina</span><br><b>'+esc(x.masinaTitlu)+'</b></div></div>':"")
    +(x.vandut?'':'<div class="vinb"><b>Verifică dacă se potrivește mașinii tale</b><div class="vr"><input id="vin" maxlength="17" placeholder="Serie șasiu (VIN), 17 caractere" autocapitalize="characters" autocomplete="off"><button type="button" class="btn" onclick="vinCheck()">Verifică pe WhatsApp</button></div><span class="meta">Primești confirmarea compatibilității înainte de livrare.</span></div>')
    +'<div class="ct'+(x.vandut?'':' ct2')+'"><a class="call" href="tel:'+esc(tel)+'">Sună</a><a class="wa" href="'+esc(wa)+'" target="_blank" rel="noopener">WhatsApp</a><button onclick="share()">Copiază link</button><button onclick="shareAd()">Distribuie</button>'+(isAdmin()?'<button onclick="copyText()">Text pentru Marketplace</button>':"")+'</div>'
    +'</div>'
    +(x.vandut?'':'<div class="pro"><div><b>✓</b>Îți confirmăm compatibilitatea pe baza seriei șasiului</div><div><b>✓</b>Livrare prin curier în toată țara</div><div><b>✓</b>Răspundem rapid pe WhatsApp și telefon</div></div>')
    +'</div></div>'+ord
    +(x.vandut?'':'<div class="sb"><div class="price">'+pz(x)+'</div><button type="button" class="cbtn" id="cbt" aria-expanded="false" aria-controls="csh" onclick="ctog()">Contact</button></div><div id="csh" class="csh" hidden><div class="csb" onclick="ctog()"></div><div class="csp"><a class="call c2" href="tel:'+esc(tel)+'">Sună<span>'+esc(x.tel||tel)+'</span></a><a class="wa c2" href="'+esc(wa)+'" target="_blank" rel="noopener">WhatsApp<span>Scrie-ne un mesaj</span></a></div></div>');seo(x);
}
function ctog(){var s=$("csh"),b=$("cbt");if(!s)return;var o=s.hidden;s.hidden=!o;b.setAttribute("aria-expanded",o);b.textContent=o?"Închide":"Contact"}
document.addEventListener("keydown",function(e){var s=$("csh");if(e.key==="Escape"&&s&&!s.hidden)ctog()});
function shareAd(){
  var u=location.href,t=cur.titlu+" - "+cur.pret+" "+cur.moneda;
  if(navigator.share){navigator.share({title:t,text:t,url:u}).catch(function(){});return}
  window.open("https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(u),"_blank","noopener");
}
function copyText(){
  var x=cur,t=x.titlu+"\nPreț: "+x.pret+" "+x.moneda+(x.negociabil?" (negociabil)":"")+"\nStare: Second hand\n"
   +(x.oem?"Cod piesă: "+x.oem+"\n":"")+"Compatibil: "+(x.marca||"")+" "+(x.model||"")+((x.anDe||x.anPana)?" ("+(x.anDe||"?")+" - "+(x.anPana||"?")+")":"")+(x.motor?", "+x.motor:"")+"\n"
   +(x.desc?"\n"+x.desc+"\n":"")+"\nLivrare: "+(x.livrare||"")+" | Garanție: "+(x.garantie||"")+"\nTelefon: "+(x.tel||"")+" | "+(x.loc||"")+"\n"+location.href;
  if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){toast("Text copiat, lipește-l în Facebook / Marketplace")}).catch(function(){prompt("Copiază textul:",t)});else prompt("Copiază textul:",t);
}
function vinCheck(){
  var v=$("vin").value.toUpperCase().replace(/[^A-Z0-9]/g,"");
  if(v.length!==17){toast("Seria șasiului are 17 caractere");$("vin").focus();return}
  var W=(typeof SITE_WA!=="undefined"&&SITE_WA?SITE_WA:String(cur.tel||"").replace(/[^\d+]/g,"").replace(/^0/,"40")).replace(/\D/g,"");
  var t="Bună! Vreau să verific dacă se potrivește: "+cur.titlu+(cur.oem?" ("+cur.oem+")":"")+". Seria șasiului (VIN): "+v+". "+new URL("anunt.html?id="+cur._id,location.href).href;
  window.open("https://wa.me/"+W+"?text="+encodeURIComponent(t),"_blank","noopener");
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
  var r=all.filter(function(x){return x._id!==cur._id&&!x.tip&&!x.vandut&&(x.cat===cur.cat||x.marca===cur.marca)}).slice(0,4);
  if(!r.length)return;
  $("simw").innerHTML='<div class="sh"><h2>Anunțuri similare</h2></div><div class="list">'+r.map(function(x){
    return '<article class="item"><a class="ph" href="anunt.html?id='+esc(x._id)+'">'+(x.poze&&x.poze[0]?carHTML(x.poze,'',false):"Fără poză")+'</a><div class="b"><h3><a href="anunt.html?id='+esc(x._id)+'">'+esc(x.titlu)+'</a></h3><div class="price">'+esc(x.pret)+" "+esc(x.moneda)+'</div></div></article>';
  }).join("")+'</div>';
}
init();

/* SEO: descriere si date structurate pentru Google */
function seo(x){try{
  var m=document.querySelector("meta[name=description]");if(!m){m=document.createElement("meta");m.name="description";document.head.appendChild(m)}
  m.content=(x.titlu+" - "+x.pret+" "+x.moneda+(x.oem?", cod "+x.oem:"")+". Compatibil "+(x.marca||"")+" "+(x.model||"")).slice(0,155);
  var s=document.createElement("script");s.type="application/ld+json";
  s.textContent=JSON.stringify({"@context":"https://schema.org","@type":"Product",name:x.titlu,image:x.poze||[],sku:x.oem||undefined,description:x.desc||x.titlu,
    offers:{"@type":"Offer",price:x.pret,priceCurrency:x.moneda,availability:x.vandut?"https://schema.org/SoldOut":"https://schema.org/InStock",itemCondition:"https://schema.org/UsedCondition"}});
  document.head.appendChild(s)}catch(e){}}
