import * as cheerio from "cheerio";

function extractPrice(html) {
  const re = /(€|EUR|\$)\s?([0-9]+[\.,]?[0-9]*)/i;
  const m = html.match(re);
  if (!m) return null;
  const num = parseFloat(m[2].replace(',', '.'));
  return isNaN(num) ? null : num;
}

function fakeMarketReference(title) {
  const t = (title || "").toLowerCase();
  if (t.includes("smart")) return 99.0;
  return 79.99;
}

function riskLabel(score) {
  if (score >= 65) return "Alto";
  if (score >= 35) return "Medio";
  return "Basso";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST with JSON { url }" });
  }
  try {
    const { url } = req.body || {};
    if (!url) return res.status(400).json({ error: "Missing url" });

    const resp = await fetch(url, { headers: { "user-agent": "FakeSaleFinder/0.1 (+vercel)" }});
    if (!resp.ok) {
      return res.status(400).json({ error: `Fetch error: ${resp.status}` });
    }
    const html = await resp.text();
    const $ = cheerio.load(html);
    let title = $("h1").first().text()?.trim();
    if (!title) title = $('meta[property="og:title"]').attr("content") || $("title").text()?.trim() || "Prodotto";

    const price = extractPrice(html);
    const ref = fakeMarketReference(title);

    const proofs = [];
    let score = 0;
    if (price !== null && ref !== null) {
      if (price < ref * 0.6) {
        score += 20;
        proofs.push("Prezzo anomalo (>40% sotto media stimata)");
      }
    }
    if (html.toLowerCase().includes("giorni") || html.toLowerCase().includes("days")) {
      score += 10;
      proofs.push("Possibile spedizione lunga");
    }
    proofs.push("Età dominio non verificata (MVP)");

    return res.status(200).json({
      product: {
        title,
        price_site: price,
        price_ref: ref,
        risk_score: score,
        risk_label: riskLabel(score),
        proofs
      }
    });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
