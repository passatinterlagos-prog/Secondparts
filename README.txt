SECONDPARTS - toate fisierele intr-un singur folder
  index.html     pagina
  style.css      aspectul
  config.js      URL + cheia publishable Supabase
  api.js         comunicarea cu Supabase (date, login, poze)
  ui.js          lista, filtre, sortare, navigare
  gal.js         poze derulabile + explicatii la pictograme
  admin.js       login, publicare, editare, vandut, stergere, comenzi
  anunt.html/.js pagina unui anunt (galerie, comanda, similare)
  setup.sql      reguli de securitate + bucket poze (se ruleaza in Supabase)

PASI IN SUPABASE
1. SQL Editor -> lipeste setup.sql -> Run.
2. Authentication -> Users -> Add user -> Create new user (email + parola, bifeaza Auto Confirm).
3. Authentication -> Sign In / Providers (Settings) -> opreste "Allow new users to sign up".
4. Deschide index.html -> Admin -> intra cu contul creat.
Completeaza in config.js telefonul, numarul WhatsApp, adresa si programul.
Pune toate fisierele (fara setup.sql si README) in acelasi loc cand publici site-ul.

Designul este alb, minimalist. Poza hero.jpg nu mai este folosita.