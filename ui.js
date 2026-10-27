/* Afisare: lista, filtre, navigare */
var data=[];
function $(i){return document.getElementById(i)}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
var tt;function toast(t){var m=$("msg");m.textContent=t;m.style.display="block";clearTimeout(tt);tt=setTimeout(function(){m.style.display="none"},2800)}
var cats=["Motor","Cutie de viteze / transmisie","Frânare","Suspensie / direcție","Caroserie / faruri","Interior","Electrice / electronice","Evacuare","Răcire / climatizare","Roți / jante / anvelope","Filtre / consumabile","Alte piese"];
cats.forEach(function(c){var o=document.createElement("option");o.textContent=c;$("fc").appendChild(o);});
function toggleMenu(){document.body.classList.toggle("mo")}
var VIEWS=["list","req","catalog","add","login","mine","stats","orders"];
var HAVECB=false;
function show(w,pop){
  if(w==="login"&&isAdmin())w="list";
  if((w==="add"||w==="catalog"||w==="mine"||w==="stats"||w==="orders")&&!isAdmin())w="login";
  VIEWS.forEach(function(s){$(s).hidden=s!==w});
  $("hero").hidden=w!=="list";var tr=document.querySelector(".trust2");if(tr)tr.hidden=w!=="list";
  $("home").hidden=!(w==="list"||w==="req");$("t-req").className=w==="req"?"on":"";$("t-list").className=w==="list"?"on":"";
  document.body.classList.remove("mo");
  var cb=$("cbar");if(cb&&HAVECB)cb.hidden=!(w==="list"||w==="req");
  if(window.navTrack)navTrack(w,pop);
  window.scrollTo(0,0);
}
function refreshNav(){["m-add","m-cat","m-mine","m-stats","m-orders","m-out"].forEach(function(i){$(i).hidden=!isAdmin()});$("m-login").hidden=isAdmin()}
function go(){$("q").value=$("hq").value;$("fc").value="";if(window.homeReset)homeReset();show("list");render();$("list").scrollIntoView()}
function renderHero(){
  var tiles=[],
      ps=parts().filter(function(x){return !x.vandut&&x.poze&&x.poze[0]}).sort(function(a,b){return b._t-a._t});
  ps.slice(0,12).forEach(function(x){tiles.push('<a class="gt" href="anunt.html?id='+esc(x._id)+'"><img loading="lazy" src="'+esc(x.poze[0])+'" alt="'+esc(x.titlu)+'"><span class="gb p">'+esc(x.pret)+' '+esc(x.moneda)+'</span><span class="gc">'+esc(x.titlu)+'</span></a>')});
  $("hgal").hidden=!tiles.length;$("hgs").innerHTML=tiles.join("");
}
function parts(){return data.filter(function(x){return !x.tip})}
function renderMine(){
  var b=$("minebox");
  if(!parts().length){b.innerHTML='<div class="empty">Nu ai publicat niciun anunț.</div>';return}
  b.innerHTML=parts().map(function(x){var id=esc(x._id);
    return '<div class="mr">'+(x.poze&&x.poze[0]?'<img loading="lazy" src="'+esc(x.poze[0])+'" alt="">':'<div class="np"></div>')
    +'<div>'+('<a href="anunt.html?id='+id+'" target="_blank" rel="noopener"><b>'+esc(x.titlu)+'</b></a><div class="meta">'+(x.oem?esc(x.oem)+' · ':'')+esc(x.pret)+' '+esc(x.moneda)+' · '+esc(x._d)+(x.vandut?' · <b>Vândut</b>':'')+'</div>')+'</div>'
    +'<div class="a"><button onclick="edit(\''+id+'\')">Editează</button><button onclick="toggleSold(\''+id+'\')">'+(x.vandut?"Redeschide":"Vândut")+'</button><button onclick="del(\''+id+'\')">Șterge</button></div></div>';
  }).join("");
}
function renderStats(){
  var P=parts(),tot=P.length,sold=P.filter(function(x){return x.vandut}).length,sum={},ven={},cc={};
  P.forEach(function(x){var m=x.moneda||"RON",p=parseFloat(x.pret)||0;
    if(x.vandut)ven[m]=(ven[m]||0)+p;else sum[m]=(sum[m]||0)+p;
    cc[x.cat]=(cc[x.cat]||0)+1});
  function f(o){var k=Object.keys(o);return k.length?k.map(function(m){return Math.round(o[m]).toLocaleString("ro-RO")+" "+m}).join(" + "):"0"}
  var mx=Math.max.apply(null,Object.keys(cc).map(function(k){return cc[k]}).concat(1));
  $("statbox").innerHTML='<div class="st"><div><b>'+tot+'</b><span>Total anunțuri</span></div><div><b>'+(tot-sold)+'</b><span>Active</span></div><div><b>'+sold+'</b><span>Vândute</span></div><div><b style="font-size:1.3rem">'+f(sum)+'</b><span>Valoare în stoc</span></div><div><b style="font-size:1.3rem">'+f(ven)+'</b><span>Valoare vândută</span></div></div>'
    +'<h3 style="margin:0 0 12px">Pe categorii</h3>'
    +(tot?Object.keys(cc).sort(function(a,b){return cc[b]-cc[a]}).map(function(k){return '<div class="cb"><span>'+esc(k)+'</span><i style="width:'+Math.round(cc[k]/mx*100)+'%"></i><b>'+cc[k]+'</b></div>'}).join(""):'<div class="meta">Nu există date încă.</div>');
}
function evStats(){
  if(!isAdmin())return;
  apiEvents().then(function(rows){
    var v=0,a=0,w=0,pv={};
    rows.forEach(function(r){var d=r.data||{};if(d.t==="vedere"){v++;if(d.id){pv[d.id]=pv[d.id]||{n:0,t:d.titlu};pv[d.id].n++}}else if(d.t==="apel")a++;else if(d.t==="whatsapp")w++});
    var top=Object.keys(pv).sort(function(x,y){return pv[y].n-pv[x].n}).slice(0,5);
    $("statbox").insertAdjacentHTML("beforeend",'<h3 style="margin:28px 0 12px">Vizitatori, ultimele 30 de zile</h3><div class="st"><div><b>'+v+'</b><span>Vizualizări de anunțuri</span></div><div><b>'+a+'</b><span>Apeluri (apăsări pe Sună)</span></div><div><b>'+w+'</b><span>Apăsări pe WhatsApp</span></div></div>'
      +'<h3 style="margin:0 0 12px">Cele mai văzute piese</h3>'+(top.length?top.map(function(k){return '<div class="cb"><span>'+esc(pv[k].t||k)+'</span><i style="width:'+Math.round(pv[k].n/pv[top[0]].n*100)+'%"></i><b>'+pv[k].n+'</b></div>'}).join(""):'<div class="meta">Nu există date încă.</div>'));
  }).catch(function(){$("statbox").insertAdjacentHTML("beforeend",'<div class="meta" style="margin-top:20px">Statisticile de vizitatori nu sunt active. Rulează în Supabase partea nouă din setup.sql (tabelul evenimente).</div>')});
}
async function load(){
  var box=$("items");
  box.innerHTML='<div class="empty">Se încarcă anunțurile...</div>';
  try{
    var rows=await apiList();
    data=rows.map(function(w){var o=w.data;o._id=w.id;o._d=new Date(w.created_at).toLocaleDateString("ro-RO");o._t=new Date(w.created_at).getTime();return o});
    refreshNav();render();renderHero();renderMine();renderStats();evStats();if(isAdmin())loadOrders();
  }catch(e){box.innerHTML='<div class="empty">Nu s-au putut încărca anunțurile. Verifică config.js și politicile din Supabase.</div>'}
}
/* text fara diacritice: "stânga" = "stanga", "șasiu" = "sasiu", merge si cu ş/ţ cu sedilă */
function norm(s){return String(s==null?"":s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ß/g,"ss")}
function cmp(s){return norm(s).replace(/[^a-z0-9]/g,"")}
function render(){
  var qn=norm($("q").value).trim(),toks=qn.split(/[\s,;]+/).filter(Boolean),qc=cmp(qn),c=$("fc").value,s=$("fs").value,box=$("items"),fb=norm($("fb").value),fm=norm($("fm").value);
  var r=parts().filter(function(x){
    var txt=[x.titlu,x.oem,x.ref,x.marca,x.model,x.marcaPiesa,x.motor,x.cat,x.masinaTitlu].join(" "),
        tn=norm(txt),tc=cmp(txt);
    var mk=norm(x.marca),md=norm(x.model);
    var okq=!toks.length||toks.every(function(t){return tn.indexOf(t)>-1})||(qc.length>2&&tc.indexOf(qc)>-1);
    return okq&&(!c||x.cat===c)&&(!s||x.stare===s)&&(!fb||mk===fb||(typeof catCanon==="function"&&norm(catCanon(x.marca))===fb))&&(!fm||(md&&(md.indexOf(fm)>-1||fm.indexOf(md)>-1)));
  });
  var so=$("so").value;
  r.sort(function(a,b){if(!!a.vandut!==!!b.vandut)return a.vandut?1:-1;var pa=parseFloat(a.pret)||0,pb=parseFloat(b.pret)||0;if(so==="pa")return pa-pb;if(so==="pd")return pb-pa;return b._t-a._t});
  $("cnt").textContent="("+r.length+")";if(window.homeChips)homeChips();
  if(!r.length){box.innerHTML='<div class="empty">'+(parts().length?"Niciun rezultat pentru filtrele alese.<br><button class=\"btn\" style=\"margin-top:16px\" onclick=\"show('req')\">Cere ofertă pentru piesa ta</button>":"Nu există anunțuri încă.")+'</div>';return}
  box.innerHTML=r.map(function(x){
    var tel=String(x.tel||"").replace(/[^\d+]/g,""),
        ani=x.anDe||x.anPana?(x.anDe||"?")+" - "+(x.anPana||"?"):"",
        wa="https://wa.me/"+tel.replace(/^0/,"40").replace("+","")+"?text="+encodeURIComponent("Bună! Mă interesează: "+x.titlu+(x.oem?" ("+x.oem+")":"")+" - "+x.pret+" "+x.moneda+". "+new URL("anunt.html?id="+x._id,location.href).href);
    return '<article class="item'+(x.vandut?" sold":"")+'" data-id="'+esc(x._id)+'" data-t="'+esc(x.titlu)+'"><a class="ph" href="anunt.html?id='+esc(x._id)+'" target="_blank" rel="noopener">'+(x.poze&&x.poze[0]?carHTML(x.poze,x.titlu,false):"Fără poză")+'</a><div class="b">'
    +'<div class="tg">'+(x.vandut?'<span class="tag sold">Vândut</span>':'<span class="tag'+""+'">'+esc(x.stare)+'</span>')+(!x.vandut&&Date.now()-x._t<6048e5?'<span class="tag new">Nou pe site</span>':"")+'<span class="meta">'+esc(x.cat)+'</span></div>'
    +'<h3><a href="anunt.html?id='+esc(x._id)+'" target="_blank" rel="noopener">'+esc(x.titlu)+'</a></h3>'+(x.oem?'<span class="oem">'+esc(x.oem)+'</span>':"")
    +'<div class="meta cp">Compatibil: '+esc(x.marca)+" "+esc(x.model)+(ani?", "+esc(ani):"")+(x.motor?", "+esc(x.motor):"")+(x.comb?", "+esc(x.comb):"")+'</div>'
    +(x.masinaTitlu?'<div class="meta prov cp">Provine din: <b>'+esc(x.masinaTitlu)+'</b></div>':"")
    +(x.desc?'<div class="meta cp">'+esc(x.desc)+'</div>':"")
    +'<div class="price">'+esc(x.pret)+" "+esc(x.moneda)+(x.negociabil?' <span class="meta">negociabil</span>':"")+'</div>'
    +'<div class="meta cp">'+esc(x.livrare)+" | "+esc(x.garantie)+(x.factura?" | Cu factură":"")+(x.cant>1?" | "+esc(x.cant)+" buc.":"")+'</div>'
    +'<div class="meta dsk">'+esc(x.vanzator)+", "+esc(x.loc)+" | "+esc(x._d)+'</div>'
    +'<div class="meta mob"><span>'+esc(x.loc)+'</span><span>'+esc(x._d)+'</span></div>'
    +'<div class="row"><a href="anunt.html?id='+esc(x._id)+'" target="_blank" rel="noopener">Detalii</a><a class="call" href="tel:'+esc(tel)+'">Sună</a><a class="wa" href="'+esc(wa)+'" target="_blank" rel="noopener">WhatsApp</a></div>'
    +(isAdmin()?'<div class="row adm"><button onclick="edit(\''+esc(x._id)+'\')">Editează</button><button onclick="toggleSold(\''+esc(x._id)+'\')">'+(x.vandut?"Redeschide":"Marchează vândut")+'</button><button onclick="del(\''+esc(x._id)+'\')">Șterge</button></div>':"")
    +'</div></article>';
  }).join("");
}

async function sendReq(e){
  e.preventDefault();var f=e.target,fd=new FormData(f),o={},b=$("rbtn");
  fd.forEach(function(v,k){o[k]=v});
  if(o.website){return}delete o.website;
  o.vin=String(o.vin||"").toUpperCase().replace(/[^A-Z0-9]/g,"");
  o.tip="cerere";o.status="nou";o.piesaId="";o.piesa="Cerere: "+o.piesa;
  b.disabled=true;b.textContent="Se trimite...";
  try{
    await apiOrderInsert(o);
    var W=(typeof SITE_WA!=="undefined"?SITE_WA:"").replace(/\D/g,"");
    f.hidden=true;var d=$("rdone");d.hidden=false;
    d.innerHTML='<div class="soldb" style="border-color:var(--gold);color:var(--gold2)">Cererea a fost trimisă. Te contactăm în cel mai scurt timp.</div>'+(W?'<p style="text-align:center;margin-top:16px"><a class="btn" style="display:inline-block;padding:13px 24px;text-decoration:none" target="_blank" rel="noopener" href="https://wa.me/'+W+'?text='+encodeURIComponent("Bună! Am trimis o cerere pe site: "+o.marca+" "+o.model+(o.an?" "+o.an:"")+", "+o.piesa.replace("Cerere: ","")+(o.vin?". VIN: "+o.vin:""))+'">Scrie-ne și pe WhatsApp</a></p>':"")+'<p style="text-align:center;margin-top:12px"><button class="btn" onclick="newReq()">Trimite altă cerere</button></p>';
  }catch(err){toast("Nu s-a putut trimite. Încearcă din nou sau sună.");b.disabled=false;b.textContent="Trimite cererea"}
}
function newReq(){var f=$("rf");f.reset();f.hidden=false;$("rdone").hidden=true;$("rbtn").disabled=false;$("rbtn").textContent="Trimite cererea"}

/* date magazin: contact, buton WhatsApp, recenzii */
(function(){
  var tel=(typeof SITE_TEL!=="undefined"?SITE_TEL:""),wa=(typeof SITE_WA!=="undefined"?SITE_WA:"");
  if(wa){var a=$("fwa");a.href="https://wa.me/"+wa.replace(/\D/g,"")+"?text="+encodeURIComponent("Bună! Caut o piesă auto.");a.hidden=false}
  var p=[];
  if(tel)p.push('<a href="tel:'+esc(tel.replace(/[^\d+]/g,""))+'">'+esc(tel)+'</a>');
  if(typeof SITE_ADRESA!=="undefined"&&SITE_ADRESA)p.push(esc(SITE_ADRESA));
  if(typeof SITE_PROGRAM!=="undefined"&&SITE_PROGRAM)p.push(esc(SITE_PROGRAM));
  var L=[];
  if(typeof SITE_FIRMA!=="undefined"&&SITE_FIRMA)L.push(esc(SITE_FIRMA));
  if(typeof SITE_CIF!=="undefined"&&SITE_CIF)L.push("CIF "+esc(SITE_CIF));
  if(typeof SITE_REG!=="undefined"&&SITE_REG)L.push("Reg. com. "+esc(SITE_REG));
  $("fcont").innerHTML=(p.length?'<div class="fc">'+p.join(" &nbsp;·&nbsp; ")+'</div>':"")+(L.length?'<div class="fc" style="font-size:.85em;opacity:.8">'+L.join(" &nbsp;·&nbsp; ")+'</div>':"")+(typeof SITE_AUT!=="undefined"&&SITE_AUT?'<div class="fc" style="font-size:.85em;opacity:.8">'+esc(SITE_AUT)+'</div>':"");
  var fy=$("fyear");if(fy)fy.textContent=new Date().getFullYear();
  var addr=(typeof SITE_ADRESA!=="undefined"&&SITE_ADRESA)?SITE_ADRESA:"",dir=addr?"https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(addr):"",
      gl=(typeof SITE_GOOGLE!=="undefined"&&SITE_GOOGLE)?SITE_GOOGLE:"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent((typeof SITE_FIRMA!=="undefined"?SITE_FIRMA:"Hikar")+" "+addr);
  if(dir){$("fcont").insertAdjacentHTML("afterbegin",'<div class="fc"><a href="'+esc(dir)+'" target="_blank" rel="noopener">Indicații de orientare</a> &nbsp;·&nbsp; <a href="'+esc("https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(addr))+'" target="_blank" rel="noopener">Vezi pe hartă</a></div>')}
  var rt=(typeof SITE_RATING!=="undefined"&&SITE_RATING)?SITE_RATING:"",hasR=typeof REVIEWS!=="undefined"&&REVIEWS.length;
  if(rt||hasR){
    $("rev").innerHTML='<h2>Recenzii</h2>'+(rt?'<p class="rating"><b>'+esc(rt)+' ★</b> pe Google'+(SITE_NREV?' · '+esc(SITE_NREV)+' recenzii':'')+' &nbsp;<a href="'+esc(gl)+'" target="_blank" rel="noopener">Vezi recenziile pe Google</a></p>':"")
      +(hasR?'<div class="rg">'+REVIEWS.map(function(r){return '<blockquote>“'+esc(r.text)+'”<cite>'+esc(r.nume)+(r.piesa?' · '+esc(r.piesa):"")+'</cite></blockquote>'}).join("")+"</div>":"");
    $("rev").hidden=false;
  }
  var cb=$("cbar");
  if(cb&&tel){HAVECB=true;cb.innerHTML='<a href="tel:'+esc(tel.replace(/[^\d+]/g,""))+'">Sună</a>'+(wa?'<a class="wa" href="https://wa.me/'+esc(wa.replace(/\D/g,""))+'?text='+encodeURIComponent("Bună! Caut o piesă auto.")+'" target="_blank" rel="noopener">WhatsApp</a>':"")+(dir?'<a href="'+esc(dir)+'" target="_blank" rel="noopener">Drum</a>':"");cb.hidden=false}
})();
