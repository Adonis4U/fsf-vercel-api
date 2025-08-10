
# FakeSaleFinder — Vercel (Free) Serverless API

Endpoints:
- `GET /api/health` → `{"status":"ok"}`
- `POST /api/analyze` with JSON `{ "url": "https://example.com/product" }`

## Deploy gratis su Vercel (passo-passo)
1) Crea account su vercel.com e collega GitHub (o usa Import Project per caricare questa cartella).
2) Se usi GitHub: crea un repo e carica *questa* cartella (contenuto non zippato).
3) In Vercel: **Add New Project** → seleziona il repo → framework: **Other** → deploy.
4) Dopo il deploy avrai un URL tipo `https://<project-name>.vercel.app`.
   - Test: `https://<project-name>.vercel.app/api/health`

## Collegare `api.adonisgagliardi.com` (Hostinger)
1) In **Vercel → Settings → Domains** del progetto: **Add** → `api.adonisgagliardi.com`.
2) Vercel mostrerà un record **CNAME** da creare:
   - Host: `api`
   - Target: `cname.vercel-dns.com` (oppure un valore specifico indicato da Vercel).
3) In **Hostinger (hPanel) → Zona DNS**: aggiungi il **CNAME** come sopra.
4) Attendi la propagazione (5–15 min) → Vercel verifica automaticamente e attiva **SSL**.

## Note
- Questo MVP non usa DB: gratis.
- `/api/analyze` fa fetch HTML e stima un Risk Score base.
