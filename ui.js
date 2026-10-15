/* Afisare: lista, filtre, navigare */
var data=[];
function $(i){return document.getElementById(i)}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function toast(t){var m=$("msg");m.textContent=t;m.style.display="block";setTimeout(function(){m.style.display="none"},2800)}
var cats=["Motor","Cutie de viteze / transmisie","Frânare","Suspensie / direcție","Caroserie / faruri","Interior","Electrice / electronice","Evacuare","Răcire / climatizare","Roți / jante / anvelope","Filtre / consumabile","Alte piese"];
cats.forEach(function(c){var o=document.createElement("option");o.textContent=c;$("fc").appendChild(o);});
["Volkswagen","BMW","Audi","Mercedes","Renault","Dacia","Ford","Opel"].forEach(function(m){var b=document.createElement("button");b.textContent=m;b.onclick=function(){$("q").value=m;$("fc").value="";go2()};$("brands").appendChild(b)});
function go(){$("q").value=$("hq").value;go2()}
function go2(){render();show("list");$("list").scrollIntoView()}
function toggleMenu(){document.body.classList.toggle("mo")}
var VIEWS=["list","add","login","mine","stats"];
function show(w){
  if((w==="add"||w==="mine"||w==="stats")&&!isAdmin())w="login";
  VIEWS.forEach(function(s){$(s).hidden=s!==w});
  $("home").hidden=w!=="list";
  document.body.classList.remove("mo");
  window.scrollTo(0,0);
}
function refreshNav(){["m-add","m-mine","m-stats","m-out"].forEach(function(i){$(i).hidden=!isAdmin()});$("m-login").hidden=isAdmin()}
function renderMine(){
  var b=$("minebox");
  if(!data.length){b.innerHTML='<div class="empty">Nu ai publicat niciun anunț.</div>';return}
  b.innerHTML=data.map(function(x){var id=esc(x._id);
    return '<div class="mr">'+(x.poze&&x.poze[0]?'<img loading="lazy" src="'+esc(x.poze[0])+'" alt="">':'<div class="np"></div>')
    +'<div><b>'+esc(x.titlu)+'</b><div class="meta">'+esc(x.oem)+' · '+esc(x.pret)+' '+esc(x.moneda)+' · '+esc(x._d)+(x.vandut?' · <b>Vândut</b>':'')+'</div></div>'
    +'<div class="a"><button onclick="toggleSold(\''+id+'\')">'+(x.vandut?"Redeschide":"Vândut")+'</button><button onclick="del(\''+id+'\')">Șterge</button></div></div>';
  }).join("");
}
function renderStats(){
  var tot=data.length,sold=data.filter(function(x){return x.vandut}).length,sum={},ven={},cc={};
  data.forEach(function(x){var m=x.moneda||"RON",p=parseFloat(x.pret)||0;
    if(x.vandut)ven[m]=(ven[m]||0)+p;else sum[m]=(sum[m]||0)+p;
    cc[x.cat]=(cc[x.cat]||0)+1});
  function f(o){var k=Object.keys(o);return k.length?k.map(function(m){return Math.round(o[m]).toLocaleString("ro-RO")+" "+m}).join(" + "):"0"}
  var mx=Math.max.apply(null,Object.keys(cc).map(function(k){return cc[k]}).concat(1));
  $("statbox").innerHTML='<div class="st"><div><b>'+tot+'</b><span>Total anunțuri</span></div><div><b>'+(tot-sold)+'</b><span>Active</span></div><div><b>'+sold+'</b><span>Vândute</span></div><div><b style="font-size:1.3rem">'+f(sum)+'</b><span>Valoare în stoc</span></div><div><b style="font-size:1.3rem">'+f(ven)+'</b><span>Valoare vândută</span></div></div>'
    +'<h3 style="margin:0 0 12px">Pe categorii</h3>'
    +(tot?Object.keys(cc).sort(function(a,b){return cc[b]-cc[a]}).map(function(k){return '<div class="cb"><span>'+esc(k)+'</span><i style="width:'+Math.round(cc[k]/mx*100)+'%"></i><b>'+cc[k]+'</b></div>'}).join(""):'<div class="meta">Nu există date încă.</div>');
}
async function load(){
  var box=$("items");
  box.innerHTML='<div class="empty">Se încarcă anunțurile...</div>';
  try{
    var rows=await apiList();
    data=rows.map(function(w){var o=w.data;o._id=w.id;o._d=new Date(w.created_at).toLocaleDateString("ro-RO");return o});
    refreshNav();render();renderMine();renderStats();
  }catch(e){box.innerHTML='<div class="empty">Nu s-au putut încărca anunțurile. Verifică js/config.js și politicile din Supabase.</div>'}
}
function render(){
  var q=$("q").value.toLowerCase(),c=$("fc").value,s=$("fs").value,box=$("items");
  var r=data.filter(function(x){
    var txt=[x.titlu,x.oem,x.ref,x.marca,x.model,x.marcaPiesa,x.motor].join(" ").toLowerCase();
    return (!q||txt.indexOf(q)>-1)&&(!c||x.cat===c)&&(!s||x.stare===s);
  });
  if(!r.length){box.innerHTML='<div class="empty">'+(data.length?"Niciun rezultat pentru filtrele alese.":"Nu există anunțuri încă.")+'</div>';return}
  box.innerHTML=r.map(function(x){
    var tel=String(x.tel).replace(/[^\d+]/g,""),
        ani=x.anDe||x.anPana?(x.anDe||"?")+" - "+(x.anPana||"?"):"",
        wa="https://wa.me/"+tel.replace(/^0/,"40").replace("+","");
    return '<article class="item'+(x.vandut?" sold":"")+'"><div class="ph">'+(x.poze&&x.poze[0]?'<img loading="lazy" src="'+esc(x.poze[0])+'" alt="'+esc(x.titlu)+'">':"Fără poză")+'</div><div class="b">'
    +'<div>'+(x.vandut?'<span class="tag sold">Vândut</span>':'<span class="tag'+(x.stare==="Nouă"?" ok":"")+'">'+esc(x.stare)+'</span>')+'<span class="meta">'+esc(x.cat)+'</span></div>'
    +'<h3>'+esc(x.titlu)+'</h3><span class="oem">'+esc(x.oem)+'</span>'
    +'<div class="meta">Compatibil: '+esc(x.marca)+" "+esc(x.model)+(ani?", "+esc(ani):"")+(x.motor?", "+esc(x.motor):"")+(x.comb?", "+esc(x.comb):"")+'</div>'
    +(x.desc?'<div class="meta">'+esc(x.desc)+'</div>':"")
    +'<div class="price">'+esc(x.pret)+" "+esc(x.moneda)+(x.negociabil?' <span class="meta">negociabil</span>':"")+'</div>'
    +'<div class="meta">'+esc(x.livrare)+" | "+esc(x.garantie)+(x.factura?" | Cu factură":"")+(x.cant>1?" | "+esc(x.cant)+" buc.":"")+'</div>'
    +'<div class="meta">'+esc(x.vanzator)+", "+esc(x.loc)+" | "+esc(x._d)+'</div>'
    +'<div class="row"><a class="call" href="tel:'+esc(tel)+'">Sună</a><a href="'+esc(wa)+'" target="_blank" rel="noopener">WhatsApp</a></div>'
    +(isAdmin()?'<div class="row adm"><button onclick="toggleSold(\''+esc(x._id)+'\')">'+(x.vandut?"Redeschide":"Marchează vândut")+'</button><button onclick="del(\''+esc(x._id)+'\')">Șterge</button></div>':"")
    +'</div></article>';
  }).join("");
}
