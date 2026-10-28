/* Explicatii la pictograme (hover / tinut apasat) + poze derulabile peste tot */
function carHTML(p,alt,big){
  p=p||[];if(!p.length)return "";
  var im=p.map(function(u){var t='<img loading="lazy" draggable="false" src="'+esc(u)+'" alt="'+esc(alt)+'">';
    return big?'<a href="'+esc(u)+'" target="_blank" rel="noopener" data-tip="Deschide poza mare">'+t+'</a>':t}).join("");
  return '<div class="car'+(big?" big":"")+'"><div class="cs">'+im+'</div>'+(p.length>1
    ?'<span class="cn l" data-d="-1" tabindex="0" role="button" data-tip="Poza anterioară">‹</span><span class="cn r" data-d="1" tabindex="0" role="button" data-tip="Poza următoare">›</span><span class="cc">1/'+p.length+'</span>':"")+'</div>';
}
(function(){
  var tip=document.createElement("div"),t,lp=0,lpEl=null,moved=false,d=null;
  tip.id="tip";document.body.appendChild(tip);
  var T={"Detalii":"Deschide pagina completă a anunțului","Sună":"Sună vânzătorul","WhatsApp":"Scrie vânzătorului pe WhatsApp","Copiază link":"Copiază linkul anunțului","Editează":"Modifică anunțul","Copiază":"Folosește anunțul ca model pentru unul nou","Marchează vândut":"Marchează piesa ca vândută","Vândut":"Marchează piesa ca vândută","Redeschide":"Pune anunțul din nou la vânzare","Șterge":"Șterge definitiv","Închide ✕":"Închide meniul","×":"Scoate poza","Meniu":"Deschide meniul","Caută":"Caută piesele","Marchează procesată":"Comanda a fost rezolvată","Trimite comanda":"Trimite comanda vânzătorului"};
  function label(){document.querySelectorAll("button,a,span.cn").forEach(function(el){
    if(el.hasAttribute("data-tip"))return;var k=el.textContent.trim()||el.getAttribute("aria-label")||"";if(T[k])el.setAttribute("data-tip",T[k])})}
  var q=0;new MutationObserver(function(){if(!q)q=requestAnimationFrame(function(){q=0;label()})}).observe(document.body,{childList:true,subtree:true});label();
  function show(el){var s=el.getAttribute("data-tip");if(!s)return;tip.textContent=s;tip.style.display="block";
    var r=el.getBoundingClientRect(),w=tip.offsetWidth,x=Math.min(Math.max(8,r.left+r.width/2-w/2),innerWidth-w-8),y=r.top-tip.offsetHeight-10;
    if(y<8)y=r.bottom+10;tip.style.left=x+"px";tip.style.top=y+"px"}
  function hide(){tip.style.display="none";clearTimeout(t)}
  document.addEventListener("mouseover",function(e){var el=e.target.closest&&e.target.closest("[data-tip]");if(el)show(el)});
  document.addEventListener("mouseout",hide);
  document.addEventListener("focusin",function(e){var el=e.target.closest&&e.target.closest("[data-tip]");if(el)show(el)});
  document.addEventListener("focusout",hide);
  document.addEventListener("touchstart",function(e){lp=0;var el=e.target.closest&&e.target.closest("[data-tip]");if(!el)return;
    clearTimeout(t);t=setTimeout(function(){lp=Date.now();lpEl=el;show(el)},450)},{passive:true});
  ["touchend","touchcancel"].forEach(function(n){document.addEventListener(n,function(){clearTimeout(t);if(lp)setTimeout(hide,2000)})});
  document.addEventListener("touchmove",function(){clearTimeout(t)},{passive:true});
  document.addEventListener("contextmenu",function(e){if(lp&&e.target.closest("[data-tip]"))e.preventDefault()});
  document.addEventListener("scroll",function(e){var s=e.target;if(!s.classList||!s.classList.contains("cs"))return;
    var i=Math.round(s.scrollLeft/s.clientWidth),c=s.parentNode.querySelector(".cc");if(c)c.textContent=(i+1)+"/"+s.children.length;
    if(s.parentNode.classList.contains("big"))document.querySelectorAll(".th img").forEach(function(m,j){m.className=j===i?"on":""})},true);
  /* click: sare peste actiunea declansata de apasarea lunga sau de tragerea cu mouse-ul */
  document.addEventListener("click",function(e){
    if((lp&&Date.now()-lp<1200&&lpEl&&e.target.closest("[data-tip]")===lpEl&&!e.target.closest(".dr"))||moved){e.preventDefault();e.stopPropagation();lp=0;moved=false;return}
    var c=e.target.closest&&e.target.closest(".cn");
    if(c){e.preventDefault();e.stopPropagation();var s=c.parentNode.querySelector(".cs");s.scrollBy({left:s.clientWidth*(+c.getAttribute("data-d")),behavior:"smooth"})}
  },true);
  /* tragere cu mouse-ul (calculator / televizor) */
  document.addEventListener("mousedown",function(e){var s=e.target.closest&&e.target.closest(".cs");if(!s||e.button||e.target.closest(".cn"))return;
    moved=false;d={s:s,x:e.pageX,l:s.scrollLeft,m:0};s.style.scrollSnapType="none";e.preventDefault()});
  document.addEventListener("mousemove",function(e){if(!d)return;var dx=e.pageX-d.x;d.m=Math.max(d.m,Math.abs(dx));d.s.scrollLeft=d.l-dx});
  document.addEventListener("mouseup",function(){if(!d)return;var s=d.s,w=s.clientWidth;moved=d.m>5;s.style.scrollSnapType="";
    s.scrollTo({left:Math.round(s.scrollLeft/w)*w,behavior:"smooth"});d=null;setTimeout(function(){moved=false},50)});
  /* tastatura / telecomanda: sageti stanga-dreapta, Enter pe sageata */
  document.addEventListener("keydown",function(e){
    var t=e.target;if(e.key==="Enter"&&t.classList&&t.classList.contains("cn")){t.click();return}
    if(e.key!=="ArrowLeft"&&e.key!=="ArrowRight"||/INPUT|SELECT|TEXTAREA/.test(t.tagName))return;
    var c=t.closest&&t.closest(".car"),s=(c&&c.querySelector(".cs"))||document.querySelector(".big .cs");
    if(s){s.scrollBy({left:s.clientWidth*(e.key==="ArrowLeft"?-1:1),behavior:"smooth"});e.preventDefault()}});
})();
