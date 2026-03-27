import axios from "axios";

// ── CERCA TRAMITE CODICE A BARRE ──────────────────────────────
async function searchByBarcode(barcode) {
  try {
    const res = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      { timeout: 5000 }
    );
    if (res.data.status === 1 && res.data.product) {
      const p = res.data.product;
      const name = p.product_name_it || p.product_name || p.generic_name;
      if (name) return { name, brand: p.brands || null };
    }
  } catch {}

  try {
    const res = await axios.get(
      `https://world.openbeautyfacts.org/api/v0/product/${barcode}.json`,
      { timeout: 5000 }
    );
    if (res.data.status === 1 && res.data.product) {
      const p = res.data.product;
      const name = p.product_name_it || p.product_name;
      if (name) return { name, brand: p.brands || null };
    }
  } catch {}

  return null;
}

// ── CERCA INFO SU WIKIPEDIA ITALIANO ─────────────────────────
async function searchWikipedia(name) {
  try {
    const res = await axios.get(
      `https://it.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`,
      { timeout: 5000 }
    );
    if (res.data?.extract) {
      return {
        description: res.data.extract,
        wikiUrl: res.data.content_urls?.desktop?.page || null,
        thumbnail: res.data.thumbnail?.source || null,
      };
    }
  } catch {}

  try {
    const res = await axios.get(
      `https://it.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name + " farmaco")}&format=json&origin=*&srlimit=1`,
      { timeout: 5000 }
    );
    if (res.data.query?.search?.length > 0) {
      const title = res.data.query.search[0].title;
      const pageRes = await axios.get(
        `https://it.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
        { timeout: 5000 }
      );
      if (pageRes.data?.extract) {
        return {
          description: pageRes.data.extract,
          wikiUrl: pageRes.data.content_urls?.desktop?.page || null,
          thumbnail: pageRes.data.thumbnail?.source || null,
        };
      }
    }
  } catch {}

  return null;
}

// ── CERCA TRAMITE BARCODE ─────────────────────────────────────
export async function lookupDrug(barcode) {
  try {
    const productResult = await searchByBarcode(barcode);
    if (!productResult?.name) {
      return {
        found: false,
        barcode,
        message: "Prodotto non trovato. Prova a cercare per nome.",
      };
    }
    const wikiResult = await searchWikipedia(productResult.name);
    return {
      found: true,
      name: productResult.name,
      brand: productResult.brand,
      barcode,
      description: wikiResult?.description || null,
      wikiUrl: wikiResult?.wikiUrl || null,
      thumbnail: wikiResult?.thumbnail || null,
    };
  } catch {
    return {
      found: false,
      barcode,
      message: "Errore durante la ricerca. Riprova.",
    };
  }
}

// ── CERCA SOLO PER NOME ───────────────────────────────────────
export async function lookupDrugByName(name) {
  try {
    const wikiResult = await searchWikipedia(name);
    return {
      found: !!wikiResult,
      name,
      description: wikiResult?.description || null,
      wikiUrl: wikiResult?.wikiUrl || null,
      thumbnail: wikiResult?.thumbnail || null,
    };
  } catch {
    return { found: false, name, description: null };
  }
}
