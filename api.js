/* Comunicarea cu Supabase: baza de date, autentificare, poze */
var TOKEN=null;
try{TOKEN=localStorage.getItem("sp_token")}catch(e){}
function isAdmin(){return !!TOKEN}
function hdr(json){var h={apikey:SUPABASE_KEY};if(TOKEN)h.Authorization="Bearer "+TOKEN;if(json!==false)h["Content-Type"]="application/json";return h}
async function chk(r){
  if(r.status===401){apiLogout();throw new Error("sesiune expirata")}
  if(!r.ok){var t="";try{var j=await r.json();t=j.message||j.error||""}catch(e){}throw new Error(r.status+" "+t)}
  return r}
async function apiLogin(email,pass){
  var r=await fetch(SUPABASE_URL+"/auth/v1/token?grant_type=password",{method:"POST",headers:{apikey:SUPABASE_KEY,"Content-Type":"application/json"},body:JSON.stringify({email:email,password:pass})});
  if(!r.ok)throw new Error(r.status);
  TOKEN=(await r.json()).access_token;
  try{localStorage.setItem("sp_token",TOKEN)}catch(e){}
}
function apiLogout(){TOKEN=null;try{localStorage.removeItem("sp_token")}catch(e){}}
async function apiList(){
  var r=await fetch(SUPABASE_URL+"/rest/v1/piese?select=id,created_at,data&order=created_at.desc&limit=200",{headers:hdr()});
  if(r.status===401&&TOKEN){apiLogout();return apiList()}
  if(!r.ok)throw new Error(r.status);
  return r.json();
}
async function apiInsert(o){await chk(await fetch(SUPABASE_URL+"/rest/v1/piese",{method:"POST",headers:Object.assign(hdr(),{Prefer:"return=minimal"}),body:JSON.stringify({data:o})}))}
async function apiPatch(id,o){await chk(await fetch(SUPABASE_URL+"/rest/v1/piese?id=eq."+encodeURIComponent(id),{method:"PATCH",headers:Object.assign(hdr(),{Prefer:"return=minimal"}),body:JSON.stringify({data:o})}))}
async function apiDelete(id){await chk(await fetch(SUPABASE_URL+"/rest/v1/piese?id=eq."+encodeURIComponent(id),{method:"DELETE",headers:hdr()}))}
async function apiUpload(blob){
  var n=Date.now()+"-"+Math.random().toString(36).slice(2,8)+".jpg";
  var h=hdr(false);h["Content-Type"]="image/jpeg";
  await chk(await fetch(SUPABASE_URL+"/storage/v1/object/"+BUCKET+"/"+n,{method:"POST",headers:h,body:blob}));
  return SUPABASE_URL+"/storage/v1/object/public/"+BUCKET+"/"+n;
}
async function apiDeletePhoto(url){
  var k="/object/public/"+BUCKET+"/",i=String(url).indexOf(k);if(i<0)return;
  try{await fetch(SUPABASE_URL+"/storage/v1/object/"+BUCKET+"/"+url.slice(i+k.length),{method:"DELETE",headers:hdr(false)})}catch(e){}
}

async function apiOrders(){var r=await fetch(SUPABASE_URL+"/rest/v1/comenzi?select=id,created_at,data&order=created_at.desc&limit=200",{headers:hdr()});await chk(r);return r.json()}
async function apiOrderInsert(o){await chk(await fetch(SUPABASE_URL+"/rest/v1/comenzi",{method:"POST",headers:Object.assign(hdr(),{Prefer:"return=minimal"}),body:JSON.stringify({data:o})}))}
async function apiOrderPatch(id,o){await chk(await fetch(SUPABASE_URL+"/rest/v1/comenzi?id=eq."+encodeURIComponent(id),{method:"PATCH",headers:Object.assign(hdr(),{Prefer:"return=minimal"}),body:JSON.stringify({data:o})}))}
async function apiOrderDel(id){await chk(await fetch(SUPABASE_URL+"/rest/v1/comenzi?id=eq."+encodeURIComponent(id),{method:"DELETE",headers:hdr()}))}
