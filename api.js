/* Comunicarea cu Supabase: baza de date, autentificare, poze */
var TOKEN=null,REFRESH=null,refreshing=null;
try{TOKEN=localStorage.getItem("sp_token");REFRESH=localStorage.getItem("sp_refresh")}catch(e){}
function isAdmin(){return !!TOKEN}
function hdr(json){var h={apikey:SUPABASE_KEY};if(TOKEN)h.Authorization="Bearer "+TOKEN;if(json!==false)h["Content-Type"]="application/json";return h}
function setSession(j){
  TOKEN=j.access_token;REFRESH=j.refresh_token||REFRESH;
  try{localStorage.setItem("sp_token",TOKEN);if(REFRESH)localStorage.setItem("sp_refresh",REFRESH)}catch(e){}
}
function expSoon(){
  try{var p=JSON.parse(atob(TOKEN.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")));return p.exp*1000-Date.now()<30000}catch(e){return false}
}
/* reinnoieste sesiunea (tokenul Supabase expira dupa ~1 ora) */
function tryRefresh(){
  if(!REFRESH)return Promise.resolve(false);
  if(!refreshing)refreshing=(async function(){
    try{
      var r=await fetch(SUPABASE_URL+"/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:{apikey:SUPABASE_KEY,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:REFRESH})});
      if(!r.ok)return false;
      setSession(await r.json());return true;
    }catch(e){return false}
    finally{refreshing=null}
  })();
  return refreshing;
}
/* cerere cu reinnoire automata a sesiunii */
async function sb(url,o,h){
  o=o||{};
  if(TOKEN&&expSoon()&&!(await tryRefresh()))apiLogout();
  var r=await fetch(url,Object.assign({},o,{headers:h?h():hdr()}));
  if(r.status===401&&TOKEN){
    if(await tryRefresh())r=await fetch(url,Object.assign({},o,{headers:h?h():hdr()}));
    else apiLogout();
  }
  return r;
}
async function chk(r){
  if(r.status===401){apiLogout();throw new Error("sesiune expirata")}
  if(!r.ok){var t="";try{var j=await r.json();t=j.message||j.error||""}catch(e){}throw new Error(r.status+" "+t)}
  return r}
function mini(){return Object.assign(hdr(),{Prefer:"return=minimal"})}
async function apiLogin(email,pass){
  var r=await fetch(SUPABASE_URL+"/auth/v1/token?grant_type=password",{method:"POST",headers:{apikey:SUPABASE_KEY,"Content-Type":"application/json"},body:JSON.stringify({email:email,password:pass})});
  if(!r.ok)throw new Error(r.status);
  setSession(await r.json());
}
function apiLogout(){TOKEN=null;REFRESH=null;try{localStorage.removeItem("sp_token");localStorage.removeItem("sp_refresh")}catch(e){}}
async function apiList(){
  var u=SUPABASE_URL+"/rest/v1/piese?select=id,created_at,data&order=created_at.desc&limit=200";
  var r=await sb(u);
  if(r.status===401&&!TOKEN)r=await sb(u); /* token invalid: reincearca ca vizitator */
  if(!r.ok)throw new Error(r.status);
  return r.json();
}
async function apiInsert(o){await chk(await sb(SUPABASE_URL+"/rest/v1/piese",{method:"POST",body:JSON.stringify({data:o})},mini))}
async function apiPatch(id,o){await chk(await sb(SUPABASE_URL+"/rest/v1/piese?id=eq."+encodeURIComponent(id),{method:"PATCH",body:JSON.stringify({data:o})},mini))}
async function apiDelete(id){await chk(await sb(SUPABASE_URL+"/rest/v1/piese?id=eq."+encodeURIComponent(id),{method:"DELETE"}))}
async function apiUpload(blob){
  var n=Date.now()+"-"+Math.random().toString(36).slice(2,8)+".jpg";
  var h=function(){var x=hdr(false);x["Content-Type"]="image/jpeg";return x};
  await chk(await sb(SUPABASE_URL+"/storage/v1/object/"+BUCKET+"/"+n,{method:"POST",body:blob},h));
  return SUPABASE_URL+"/storage/v1/object/public/"+BUCKET+"/"+n;
}
async function apiDeletePhoto(url){
  var k="/object/public/"+BUCKET+"/",i=String(url).indexOf(k);if(i<0)return;
  try{await sb(SUPABASE_URL+"/storage/v1/object/"+BUCKET+"/"+url.slice(i+k.length),{method:"DELETE"},function(){return hdr(false)})}catch(e){}
}

async function apiOrders(){var r=await sb(SUPABASE_URL+"/rest/v1/comenzi?select=id,created_at,data&order=created_at.desc&limit=200");await chk(r);return r.json()}
async function apiOrderInsert(o){await chk(await sb(SUPABASE_URL+"/rest/v1/comenzi",{method:"POST",body:JSON.stringify({data:o})},mini))}
async function apiOrderPatch(id,o){await chk(await sb(SUPABASE_URL+"/rest/v1/comenzi?id=eq."+encodeURIComponent(id),{method:"PATCH",body:JSON.stringify({data:o})},mini))}
async function apiOrderDel(id){await chk(await sb(SUPABASE_URL+"/rest/v1/comenzi?id=eq."+encodeURIComponent(id),{method:"DELETE"}))}
