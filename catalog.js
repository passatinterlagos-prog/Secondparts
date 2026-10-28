/* Lista interna de marci / modele / ani. Formatul: "Model|an de la|an pana la".
   Anii sunt orientativi (productia europeana). Ce lipseste sau e gresit corectezi din Admin -> Marci si modele. */
var CAT_BASE={
"Alfa Romeo":"147|2000|2010;156|1997|2007;159|2005|2011;GT|2003|2010;Giulietta|2010|2020;MiTo|2008|2018;Giulia|2016|2026;Stelvio|2017|2026",
"Audi":"A1 8X|2010|2018;A1 GB|2018|2026;A3 8L|1996|2003;A3 8P|2003|2012;A3 8V|2012|2020;A3 8Y|2020|2026;A4 B5|1994|2001;A4 B6|2000|2004;A4 B7|2004|2008;A4 B8|2007|2015;A4 B9|2015|2026;A5 8T|2007|2016;A5 F5|2016|2026;A6 C5|1997|2004;A6 C6|2004|2011;A6 C7|2011|2018;A6 C8|2018|2026;A7 4G|2010|2018;A8 D3|2002|2010;A8 D4|2010|2017;Q2|2016|2026;Q3 8U|2011|2018;Q3 F3|2018|2026;Q5 8R|2008|2017;Q5 FY|2017|2026;Q7 4L|2005|2015;Q7 4M|2015|2026;TT 8N|1998|2006;TT 8J|2006|2014;80 B4|1991|1996;100 C4|1991|1994;A6 C4|1994|1997",
"BMW":"Seria 1 E87|2004|2013;Seria 1 F20|2011|2019;Seria 1 F40|2019|2026;Seria 2 F22|2014|2021;Seria 3 E36|1990|2000;Seria 3 E46|1998|2006;Seria 3 E90|2005|2013;Seria 3 F30|2011|2019;Seria 3 G20|2018|2026;Seria 4 F32|2013|2020;Seria 5 E39|1995|2003;Seria 5 E60|2003|2010;Seria 5 F10|2010|2017;Seria 5 G30|2016|2023;Seria 7 E65|2001|2008;Seria 7 F01|2008|2015;X1 E84|2009|2015;X1 F48|2015|2022;X3 E83|2003|2010;X3 F25|2010|2017;X3 G01|2017|2026;X5 E53|1999|2006;X5 E70|2006|2013;X5 F15|2013|2018;X5 G05|2018|2026;X6 E71|2008|2014;Z4 E85|2002|2008;Seria 3 E30|1982|1994;Seria 5 E34|1988|1996",
"Chevrolet":"Aveo|2003|2011;Captiva|2006|2015;Cruze|2009|2016;Spark|2005|2015;Lacetti|2004|2011;Matiz|2005|2010;Orlando|2011|2018",
"Chrysler":"300C|2004|2012;Voyager|2008|2016;PT Cruiser|2000|2010;Sebring|2007|2010",
"Citroen":"C1|2005|2014;C2|2003|2010;C3 I|2002|2009;C3 II|2009|2016;C3 III|2016|2024;C4 I|2004|2010;C4 II|2010|2018;C4 Picasso|2006|2013;C5 I|2001|2008;C5 II|2008|2017;Berlingo II|2008|2018;Berlingo III|2018|2026;Jumper|2006|2026;Jumpy|2007|2016;Xsara Picasso|1999|2010;DS3|2010|2019;Nemo|2008|2017;Saxo|1996|2003;Xsara|1997|2006;C8|2002|2014",
"Dacia":"1310|1969|2004;Logan I|2004|2012;Logan II|2012|2020;Logan III|2020|2026;Sandero I|2008|2012;Sandero II|2012|2020;Sandero III|2020|2026;Duster I|2010|2017;Duster II|2017|2023;Duster III|2023|2026;Dokker|2012|2021;Lodgy|2012|2022;Solenza|2003|2005;Spring|2021|2026;Jogger|2021|2026",
"Fiat":"500|2007|2024;Bravo|2007|2014;Doblo I|2000|2010;Doblo II|2010|2022;Ducato|2006|2026;Fiorino|2007|2025;Grande Punto|2005|2012;Panda II|2003|2012;Panda III|2012|2023;Punto II|1999|2010;Punto Evo|2009|2012;Qubo|2008|2021;Scudo|2007|2016;Stilo|2001|2007;Tipo|2015|2023;Linea|2007|2015;Punto I|1993|1999;Seicento|1998|2010;Multipla|1998|2010;Albea|2002|2012;Idea|2003|2012",
"Ford":"Fiesta Mk6|2002|2008;Fiesta Mk7|2008|2017;Fiesta Mk8|2017|2023;Focus Mk1|1998|2004;Focus Mk2|2004|2011;Focus Mk3|2010|2018;Focus Mk4|2018|2025;Mondeo Mk3|2000|2007;Mondeo Mk4|2007|2014;Mondeo Mk5|2014|2022;Kuga Mk1|2008|2012;Kuga Mk2|2012|2019;Kuga Mk3|2019|2026;C-Max I|2003|2010;C-Max II|2010|2019;S-Max I|2006|2015;S-Max II|2015|2023;Galaxy|2006|2015;Ka|2008|2016;Puma|2019|2026;EcoSport|2013|2022;Transit Connect|2002|2013;Transit Custom|2012|2026;Transit|2006|2026;Tourneo Connect|2013|2026;Fiesta Mk4|1995|2002;Escort|1990|2000;Fusion|2002|2012;Mondeo Mk2|1996|2000",
"Honda":"Civic VIII|2006|2011;Civic IX|2011|2017;Civic X|2017|2021;Accord VII|2002|2008;Accord VIII|2008|2015;CR-V II|2001|2006;CR-V III|2006|2012;CR-V IV|2012|2018;CR-V V|2018|2026;Jazz II|2002|2008;Jazz III|2008|2015;HR-V|2015|2021;FR-V|2004|2009;Civic VII|2000|2005",
"Hyundai":"i10|2008|2019;i20 I|2008|2014;i20 II|2014|2020;i30 FD|2007|2011;i30 GD|2011|2017;i30 PD|2017|2026;ix35|2010|2015;Tucson JM|2004|2010;Tucson TL|2015|2020;Tucson NX4|2020|2026;Santa Fe CM|2006|2012;Santa Fe DM|2012|2018;Santa Fe TM|2018|2026;Elantra|2000|2020;Getz|2002|2010;Accent|1999|2011;Kona|2017|2026;ix20|2010|2019;Matrix|2001|2010;Santa Fe SM|2000|2006",
"Jaguar":"X-Type|2001|2009;XF|2008|2015;XJ|2003|2019;S-Type|1999|2008",
"Jeep":"Cherokee KK|2008|2013;Cherokee KL|2013|2023;Grand Cherokee WK|2005|2010;Grand Cherokee WK2|2010|2021;Renegade|2014|2026;Compass|2006|2016;Wrangler JK|2007|2018",
"Kia":"Ceed ED|2006|2012;Ceed JD|2012|2018;Ceed CD|2018|2026;Sportage SL|2010|2015;Sportage QL|2015|2021;Sportage NQ5|2021|2026;Sorento XM|2009|2014;Sorento UM|2014|2020;Rio|2005|2023;Picanto|2004|2026;Stonic|2017|2026;Venga|2009|2019;Soul|2008|2019;Carens|2006|2013;Optima|2012|2020;Niro|2016|2026;Cerato|2004|2013",
"Land Rover":"Freelander 2|2006|2014;Discovery 3|2004|2009;Discovery 4|2009|2016;Discovery Sport|2014|2026;Range Rover Sport|2005|2013;Range Rover Evoque|2011|2019;Defender|1990|2016",
"Lexus":"IS 220|2005|2013;RX 300|1998|2003;RX 350|2009|2015;CT 200h|2010|2022;NX|2014|2026",
"Mazda":"2 DY|2003|2007;2 DE|2007|2014;2 DJ|2014|2026;3 BK|2003|2009;3 BL|2009|2013;3 BM|2013|2019;3 BP|2019|2026;5|2005|2015;6 GG|2002|2008;6 GH|2007|2012;6 GJ|2012|2026;CX-3|2015|2026;CX-5 KE|2012|2017;CX-5 KF|2017|2026;CX-7|2006|2012;MX-5|2005|2015",
"Mercedes-Benz":"Clasa A W169|2004|2012;Clasa A W176|2012|2018;Clasa A W177|2018|2026;Clasa B W245|2005|2011;Clasa B W246|2011|2018;Clasa C W203|2000|2007;Clasa C W204|2007|2014;Clasa C W205|2014|2021;Clasa C W206|2021|2026;Clasa E W210|1995|2002;Clasa E W211|2002|2009;Clasa E W212|2009|2016;Clasa E W213|2016|2023;Clasa S W220|1998|2005;Clasa S W221|2005|2013;Clasa S W222|2013|2020;CLA C117|2013|2019;CLK|1997|2010;CLS C219|2004|2010;GLA X156|2013|2020;GLC X253|2015|2022;GLK X204|2008|2015;ML W163|1997|2005;ML W164|2005|2011;ML W166|2011|2015;GLE W166|2015|2019;Vito W639|2003|2014;Vito W447|2014|2026;Viano|2003|2014;Sprinter 906|2006|2018;Sprinter 907|2018|2026;SLK|1996|2016;Vaneo|2001|2005;Clasa C W202|1993|2001;Clasa A W168|1997|2004;Clasa E W124|1984|1996",
"Mini":"Cooper R50|2001|2006;Cooper R56|2006|2013;Cooper F56|2013|2026;Countryman R60|2010|2016;Countryman F60|2016|2026;Clubman|2007|2026",
"Mitsubishi":"Colt|2004|2012;Lancer|2007|2016;Outlander II|2006|2012;Outlander III|2012|2021;Pajero|2000|2021;L200|2005|2026;ASX|2010|2023;Grandis|2003|2011",
"Nissan":"Qashqai J10|2007|2013;Qashqai J11|2013|2021;Qashqai J12|2021|2026;X-Trail T30|2001|2007;X-Trail T31|2007|2014;X-Trail T32|2014|2022;Juke|2010|2019;Micra K12|2002|2010;Micra K13|2010|2017;Note|2004|2013;Navara D40|2005|2015;Navara D23|2015|2026;Primera P12|2002|2008;Almera|2000|2006;Pathfinder|2005|2014;Leaf|2010|2026;Pulsar|2014|2018;Primastar|2002|2014",
"Opel":"Adam|2012|2019;Agila|2000|2014;Antara|2006|2015;Astra G|1998|2004;Astra H|2004|2010;Astra J|2009|2015;Astra K|2015|2021;Combo C|2001|2011;Combo D|2011|2018;Corsa C|2000|2006;Corsa D|2006|2014;Corsa E|2014|2019;Corsa F|2019|2026;Insignia A|2008|2017;Insignia B|2017|2022;Meriva A|2003|2010;Meriva B|2010|2017;Mokka A|2012|2019;Movano|2010|2021;Omega B|1994|2003;Signum|2003|2008;Tigra|2004|2009;Vectra B|1995|2002;Vectra C|2002|2008;Vivaro A|2001|2014;Vivaro B|2014|2019;Zafira A|1999|2005;Zafira B|2005|2014;Zafira C|2011|2019;Crossland X|2017|2020;Grandland X|2017|2021;Astra F|1991|1998;Corsa B|1993|2000;Vectra A|1988|1995",
"Peugeot":"106|1991|2003;206|1998|2009;207|2006|2014;208 I|2012|2019;208 II|2019|2026;301|2012|2020;306|1993|2002;307|2000|2008;308 T7|2007|2013;308 T9|2013|2021;308 P5|2021|2026;406|1995|2004;407|2004|2011;508 I|2010|2018;508 II|2018|2026;607|2000|2010;2008|2013|2026;3008 I|2009|2016;3008 II|2016|2023;5008 I|2009|2017;5008 II|2017|2026;Partner|2008|2018;Expert|2007|2016;Boxer|2006|2026;Bipper|2008|2018;RCZ|2010|2015",
"Porsche":"Cayenne 955|2002|2010;Cayenne 958|2010|2017;Macan|2014|2026;Panamera|2009|2016;911 997|2004|2012;Boxster 987|2004|2012",
"Renault":"Clio II|1998|2012;Clio III|2005|2014;Clio IV|2012|2019;Clio V|2019|2026;Megane I|1995|2003;Megane II|2002|2009;Megane III|2008|2016;Megane IV|2015|2022;Laguna II|2000|2007;Laguna III|2007|2015;Scenic II|2003|2009;Scenic III|2009|2016;Scenic IV|2016|2022;Captur I|2013|2019;Captur II|2019|2026;Kadjar|2015|2022;Fluence|2009|2016;Espace IV|2002|2014;Espace V|2014|2023;Trafic II|2001|2014;Trafic III|2014|2026;Master II|1998|2010;Master III|2010|2024;Kangoo I|1997|2008;Kangoo II|2008|2021;Kangoo III|2021|2026;Talisman|2015|2022;Twingo II|2007|2014;Twingo III|2014|2024;Koleos|2008|2016;Modus|2004|2012;Symbol|2008|2013;Vel Satis|2002|2009;Clio I|1990|1998;Twingo I|1993|2007;Scenic I|1996|2003;Laguna I|1993|2001;Safrane|1992|2000",
"Saab":"9-3|2002|2014;9-5|1997|2012",
"Seat":"Ibiza 6L|2002|2008;Ibiza 6J|2008|2017;Ibiza 6F|2017|2026;Leon 1M|1999|2005;Leon 1P|2005|2012;Leon 5F|2012|2020;Leon KL|2020|2026;Altea|2004|2015;Toledo|2004|2019;Cordoba|2002|2009;Alhambra 7M|1996|2010;Alhambra 7N|2010|2022;Ateca|2016|2026;Arona|2017|2026;Exeo|2008|2013;Mii|2011|2021",
"Skoda":"Fabia I|1999|2007;Fabia II|2007|2014;Fabia III|2014|2021;Fabia IV|2021|2026;Octavia I|1996|2010;Octavia II|2004|2013;Octavia III|2012|2020;Octavia IV|2019|2026;Superb I|2001|2008;Superb II|2008|2015;Superb III|2015|2023;Rapid|2012|2019;Roomster|2006|2015;Yeti|2009|2017;Kodiaq|2016|2026;Karoq|2017|2026;Kamiq|2019|2026;Scala|2019|2026;Citigo|2011|2019;Praktik|2007|2015;Felicia|1994|2001",
"Smart":"Fortwo 450|2004|2007;Fortwo 451|2007|2014;Fortwo 453|2014|2026;Forfour|2004|2006",
"Subaru":"Forester|2002|2018;Impreza|2000|2017;Legacy|2003|2014;Outback|2003|2021;XV|2012|2023",
"Suzuki":"Swift III|2005|2010;Swift IV|2010|2017;Swift V|2017|2026;Vitara|2015|2026;SX4|2006|2013;Grand Vitara|2005|2015;Jimny|1998|2018;Ignis|2003|2008;Splash|2008|2015;Alto|2009|2014",
"Toyota":"Yaris XP10|1999|2005;Yaris XP90|2005|2011;Yaris XP130|2011|2020;Yaris XP210|2020|2026;Corolla E120|2000|2007;Corolla E150|2006|2013;Corolla E180|2013|2019;Corolla E210|2018|2026;Avensis T250|2003|2008;Avensis T270|2008|2018;Auris I|2006|2012;Auris II|2012|2018;RAV4 XA30|2005|2012;RAV4 XA40|2012|2018;RAV4 XA50|2018|2026;Land Cruiser J120|2002|2009;Land Cruiser J150|2009|2026;Hilux|2005|2015;Hilux 8|2015|2026;Aygo|2005|2022;C-HR|2016|2026;Prius|2003|2023;Verso|2009|2018;Camry|2006|2018;Avensis Verso|2001|2009",
"Volkswagen":"Golf 4|1997|2006;Golf 5|2003|2009;Golf 6|2008|2013;Golf 7|2012|2020;Golf 8|2019|2026;Passat B5|1996|2005;Passat B6|2005|2010;Passat B7|2010|2014;Passat B8|2014|2023;Polo 9N|2001|2009;Polo 6R|2009|2017;Polo AW|2017|2026;Jetta A5|2005|2010;Jetta A6|2010|2018;Tiguan 5N|2007|2016;Tiguan AD|2016|2024;Touran 1T|2003|2015;Touran 5T|2015|2026;Touareg 7L|2002|2010;Touareg 7P|2010|2018;Touareg CR|2018|2026;Caddy 2K|2003|2020;Caddy 5|2020|2026;Sharan 7M|1995|2010;Sharan 7N|2010|2022;Transporter T5|2003|2015;Transporter T6|2015|2019;Transporter T6.1|2019|2026;Crafter I|2006|2016;Crafter II|2017|2026;Arteon|2017|2024;Scirocco|2008|2017;CC|2008|2017;Up|2011|2023;T-Roc|2017|2026;T-Cross|2019|2026;Lupo|1998|2005;Bora|1998|2005;Fox|2005|2011;Beetle|2011|2019;Phaeton|2002|2016;Eos|2006|2015;Amarok|2010|2022;Multivan T5|2003|2015;Golf 3|1991|1999;Passat B3|1988|1993;Passat B4|1993|1997;Polo 6N|1994|2002;Vento|1991|1998",
"Volvo":"S40|2004|2012;V40|2012|2019;V50|2004|2012;S60 I|2000|2009;S60 II|2010|2018;V60|2010|2018;V70|2007|2016;S80|2006|2016;XC60 I|2008|2017;XC60 II|2017|2026;XC70|2007|2016;XC90 I|2002|2014;XC90 II|2014|2026;V90|2016|2026;XC40|2017|2026",
"Daewoo":"Matiz|1998|2005;Nubira|1997|2003;Lanos|1997|2002;Kalos|2002|2008;Tacuma|2000|2008",
"Dodge":"Caliber|2006|2012;Nitro|2007|2012;Journey|2008|2020",
"Lancia":"Ypsilon|2003|2011;Delta|2008|2014;Musa|2004|2012",
"Lada":"Niva|1977|2024;Samara|1984|2004",
"Rover":"25|1999|2005;45|1999|2005;75|1999|2005",
"SsangYong":"Kyron|2005|2014;Rexton|2001|2017;Actyon|2005|2012;Korando|2010|2019;Tivoli|2015|2026",
"Tesla":"Model S|2012|2026;Model 3|2017|2026;Model X|2015|2026;Model Y|2020|2026"
};
var CAT_EXTRA={},CAT_ID=null,CAT_ALIAS={"vw":"Volkswagen","merc":"Mercedes-Benz","mercedes":"Mercedes-Benz","benz":"Mercedes-Benz","alfa":"Alfa Romeo","landrover":"Land Rover","rover":"Land Rover"};
function catAll(){
  var o={};
  Object.keys(CAT_BASE).forEach(function(b){o[b]=CAT_BASE[b].split(";").map(function(s){var p=s.split("|");return{n:p[0],a:+p[1],b:+p[2],x:false}})});
  Object.keys(CAT_EXTRA||{}).forEach(function(b){
    o[b]=o[b]||[];
    CAT_EXTRA[b].forEach(function(e){
      var i=-1;o[b].forEach(function(z,k){if(z.n.toLowerCase()===String(e[0]).toLowerCase())i=k});
      var it={n:e[0],a:+e[1],b:+e[2],x:true};
      if(i>=0)o[b][i]=it;else o[b].push(it);
    });
  });
  Object.keys(o).forEach(function(b){o[b].sort(function(p,q){return p.n.localeCompare(q.n,"ro",{numeric:true})})});
  return o;
}
function catCanon(v){
  v=String(v||"").trim();if(!v)return "";
  var k=v.toLowerCase().replace(/[\s.\-]/g,""),all=catAll(),found="";
  if(CAT_ALIAS[k])return CAT_ALIAS[k];
  Object.keys(all).forEach(function(b){if(b.toLowerCase().replace(/[\s.\-]/g,"")===k)found=b});
  return found;
}
function catFind(b,m){
  var all=catAll(),L=all[catCanon(b)]||[],r=null;m=String(m||"").trim().toLowerCase();
  L.forEach(function(e){if(e.n.toLowerCase()===m)r=e});return r;
}
function catFillBrands(){
  var all=catAll(),dl=$("dl-marci");if(!dl)return;
  dl.innerHTML=Object.keys(all).sort(function(a,b){return a.localeCompare(b,"ro")}).map(function(b){return '<option value="'+esc(b)+'">'}).join("");
}
function catFillModels(b){
  var dl=$("dl-modele");if(!dl)return;var L=catAll()[catCanon(b)]||[];
  dl.innerHTML=L.map(function(e){return '<option value="'+esc(e.n)+'">'+e.a+" - "+e.b+'</option>'}).join("");
}
function catYears(e){
  var dl=$("dl-ani");if(!dl)return;var h="";
  if(e)for(var y=e.b;y>=e.a;y--)h+='<option value="'+y+'">';
  dl.innerHTML=h;
}
function catBind(f){
  if(!f)return;var ma=f.elements.marca,mo=f.elements.model;if(!ma||!mo)return;
  ma.addEventListener("input",function(){catFillModels(ma.value)});
  ma.addEventListener("change",function(){var c=catCanon(ma.value);if(c)ma.value=c;catFillModels(ma.value)});
  mo.addEventListener("focus",function(){catFillModels(ma.value)});
  function pick(){
    var e=catFind(ma.value,mo.value);if(!e)return;
    mo.value=e.n;
    if(f.elements.anDe){f.elements.anDe.value=e.a;f.elements.anPana.value=e.b}
    if(f.elements.an)catYears(e);
    if(f.id==="cf"&&f.elements.a){f.elements.a.value=e.a;f.elements.b.value=e.b}
  }
  mo.addEventListener("change",pick);
  mo.addEventListener("input",function(){if(catFind(ma.value,mo.value))pick()});
}
/* ---- salvare in Supabase (un singur rand cu tip=catalog) ---- */
async function apiCatLoad(){
  var r=await sb(SUPABASE_URL+"/rest/v1/piese?select=id,data&data-%3E%3Etip=eq.catalog&limit=1");
  await chk(r);var j=await r.json();return j[0]||null;
}
async function loadCatalog(){
  try{var w=await apiCatLoad();if(w){CAT_ID=w.id;CAT_EXTRA=(w.data&&w.data.extra)||{}}}catch(e){}
  catFillBrands();catFillModels("");renderCat();
}
async function saveCat(){
  var o={tip:"catalog",extra:CAT_EXTRA};
  if(CAT_ID)await apiPatch(CAT_ID,o);else{await apiInsert(o);var w=await apiCatLoad();if(w)CAT_ID=w.id}
}
async function addCat(e){
  e.preventDefault();var f=e.target,b=catCanon(f.marca.value)||f.marca.value.trim(),m=f.model.value.trim(),a=parseInt(f.a.value,10),z=parseInt(f.b.value,10)||new Date().getFullYear();
  if(!b||!m||!a){toast("Completează marca, modelul și anul de început");return}
  if(z<a){toast("Anul final nu poate fi mai mic decât cel de început");return}
  CAT_EXTRA[b]=CAT_EXTRA[b]||[];
  var i=-1;CAT_EXTRA[b].forEach(function(x,k){if(String(x[0]).toLowerCase()===m.toLowerCase())i=k});
  if(i>=0)CAT_EXTRA[b][i]=[m,a,z];else CAT_EXTRA[b].push([m,a,z]);
  try{await saveCat();f.model.value="";f.a.value="";f.b.value="";catFillBrands();catFillModels(b);renderCat();toast(i>=0?"Model actualizat":"Model adăugat")}
  catch(err){toast("Nu s-a putut salva ("+err.message+")")}
}
async function delCat(b,i){
  if(!confirm("Ștergi această intrare din listă?"))return;
  CAT_EXTRA[b].splice(i,1);if(!CAT_EXTRA[b].length)delete CAT_EXTRA[b];
  try{await saveCat();catFillBrands();renderCat();toast("Șters")}catch(err){toast("Nu s-a putut șterge")}
}
function renderCat(){
  var box=$("catbox");if(!box)return;
  var all=catAll(),nb=Object.keys(all).length,nm=0;Object.keys(all).forEach(function(b){nm+=all[b].length});
  $("catcount").textContent="Lista are "+nb+" mărci și "+nm+" modele.";
  var ex=Object.keys(CAT_EXTRA);
  box.innerHTML=ex.length?ex.sort().map(function(b){return '<h3 style="margin:18px 0 8px">'+esc(b)+'</h3>'+CAT_EXTRA[b].map(function(e,i){return '<div class="mr"><div class="np"></div><div><b>'+esc(e[0])+'</b><div class="meta">'+esc(e[1])+' - '+esc(e[2])+'</div></div><div class="a"><button onclick="delCat(\''+esc(b).replace(/'/g,"\\'")+'\','+i+')">Șterge</button></div></div>'}).join("")}).join(""):'<div class="empty">Nu ai adăugat încă nimic. Ce adaugi aici apare în completarea automată.</div>';
}
function catInit(){catFillBrands();catBind($("f"));catBind($("rf"));catBind($("cf"));loadCatalog()}
catInit();
