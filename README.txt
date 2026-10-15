SECONDPARTS - toate fisierele intr-un singur folder
  index.html     pagina
  style.css      aspectul
  config.js      URL + cheia publishable Supabase
  api.js         comunicarea cu Supabase (date, login, poze)
  ui.js          lista, filtre, navigare
  admin.js       login, publicare, vandut, stergere
  setup.sql      reguli de securitate + bucket poze (se ruleaza in Supabase)

PASI IN SUPABASE
1. SQL Editor -> lipeste setup.sql -> Run.
2. Authentication -> Users -> Add user -> Create new user (email + parola, bifeaza Auto Confirm).
3. Authentication -> Sign In / Providers (Settings) -> opreste "Allow new users to sign up".
4. Deschide index.html -> Admin -> intra cu contul creat.
Pune toate fisierele (fara setup.sql si README) in acelasi loc cand publici site-ul.

POZA PRINCIPALA: pune o poza proprie numita hero.jpg langa index.html si apare automat in prima pagina (in lipsa ei se vede discul auriu).
