import { onRequest } from "firebase-functions/v2/https";
import fetch from "node-fetch";

const GRAPHQL_ENDPOINT = "https://api.cooperhewitt.org/";

export const api = onRequest({ 
  cors: true,
  invoker: "public"
}, async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // Extract path after /api/
    const apiPath = req.path.replace('/api/', '');
    
    if (apiPath === 'church') {
      const page = parseInt(req.query.page || "1") - 1; // GraphQL uses 0-based pages
      const per_page = parseInt(req.query.per_page || "50");
      const searchQuery = req.query.query ? String(req.query.query) : "";

      // Build GraphQL query for Frederic Edwin Church objects
      let graphqlQuery = `{
  object(
    maker: "Frederic Edwin Church"
    hasImages: true
    size: ${per_page}
    page: ${page}`;

      // Add general search if query provided
      if (searchQuery) {
        graphqlQuery += `\n    general: "${searchQuery.replace(/"/g, '\\"')}"`;
      }

      graphqlQuery += `
  ) {
    id
    identifier
    title
    summary
    date
    medium
    multimedia
    description
    geography
    legal
    measurements
    name
    note
    period
    provenance
    status
    classification
    culture
    department
    exhibition
    inscription
    location
    material
  }
}`;

      const r = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: graphqlQuery })
      });

      const data = await r.json();
      
      if (data.errors) {
        console.error("GraphQL Errors:", data.errors);
        return res.status(400).json({ error: "GraphQL query error", details: data.errors });
      }
      
      // Transform GraphQL response to match the expected REST API format
      const objects = data.data?.object || [];
      const pagination = data.extensions?.pagination || {};
      
      const transformedResponse = {
        stat: "ok",
        objects: objects.map(obj => ({
          id: obj.id || "",
          title: obj.summary?.title || 
                 (Array.isArray(obj.title) ? obj.title[0]?.value || obj.title[0] : obj.title) || "",
          title_variants: Array.isArray(obj.title) ? obj.title.map(t => t.value || t).filter(Boolean) : [],
          display_date: Array.isArray(obj.date) ? 
                        (obj.date[0]?.value || obj.date[0] || "") : 
                        (obj.date || ""),
          date_range: Array.isArray(obj.date) && obj.date[0] ? 
                     { from: obj.date[0].from, to: obj.date[0].to, value: obj.date[0].value } : 
                     null,
          accession_number: Array.isArray(obj.identifier) 
            ? (obj.identifier.find(id => id && id.type === "accession number")?.value || 
               obj.identifier.find(id => id && id.value)?.value ||
               obj.identifier[0]?.value || 
               obj.identifier[0] || "")
            : (obj.identifier || ""),
          identifiers: Array.isArray(obj.identifier) ? obj.identifier.filter(Boolean) : [],
          medium: Array.isArray(obj.medium) 
            ? obj.medium.map(m => {
                if (!m) return "";
                return typeof m === 'object' ? (m.value || "") : String(m);
              }).filter(Boolean).join(", ")
            : (obj.medium ? (typeof obj.medium === 'object' ? (obj.medium.value || "") : String(obj.medium)) : ""),
          medium_list: Array.isArray(obj.medium) 
            ? obj.medium.map(m => typeof m === 'object' ? (m.value || "") : String(m)).filter(Boolean)
            : obj.medium ? [typeof obj.medium === 'object' ? (obj.medium.value || "") : String(obj.medium)] : [],
          url: obj.identifier && Array.isArray(obj.identifier) 
            ? (() => {
                const legacyId = obj.identifier.find(id => id && id.type === "legacy collections online id")?.value;
                const tmsId = obj.identifier.find(id => id && id.type === "tms id")?.value;
                const objId = obj.id ? obj.id.replace("object-", "") : "";
                if (legacyId) {
                  return `https://collection.cooperhewitt.org/objects/${legacyId}/`;
                } else if (tmsId) {
                  return `https://collection.cooperhewitt.org/objects/${tmsId}/`;
                } else {
                  return `https://collection.cooperhewitt.org/objects/${objId}/`;
                }
              })()
            : `https://collection.cooperhewitt.org/objects/${obj.id ? obj.id.replace("object-", "") : ""}/`,
          thumbnail: obj.multimedia && Array.isArray(obj.multimedia) && obj.multimedia.length > 0
            ? obj.multimedia[0]?.preview?.url || obj.multimedia[0]?.large?.url || null
            : null,
          images: obj.multimedia && Array.isArray(obj.multimedia)
            ? obj.multimedia.map(m => ({
                preview: m?.preview?.url || null,
                large: m?.large?.url || null,
                caption: m?.caption || null,
                cc0: m?.cc0 || false,
                dimensions: m?.large?.measurements?.dimensions || m?.preview?.measurements?.dimensions || null,
                filesize: m?.large?.measurements?.filesize || m?.preview?.measurements?.filesize || null
              })).filter(img => img.preview || img.large)
            : [],
          description: Array.isArray(obj.description) ? obj.description.filter(Boolean) : (obj.description ? [obj.description] : []),
          geography: obj.geography ? {
            country: obj.geography.country?.value || null,
            geocode: obj.geography.geocode || null,
            name: obj.geography.name || null
          } : null,
          legal: obj.legal ? {
            credit: obj.legal.credit || null,
            rights: obj.legal.rights || null
          } : null,
          measurements: obj.measurements ? {
            dimensions: Array.isArray(obj.measurements.dimensions) 
              ? obj.measurements.dimensions.map(d => d.value).filter(Boolean)
              : obj.measurements.dimensions ? [obj.measurements.dimensions.value].filter(Boolean) : []
          } : null,
          name: Array.isArray(obj.name) 
            ? obj.name.map(n => n.value || n).filter(Boolean) 
            : obj.name ? [obj.name.value || obj.name] : [],
          note: obj.note || null,
          period: Array.isArray(obj.period) 
            ? obj.period.map(p => p.value || p).filter(Boolean) 
            : obj.period ? [obj.period.value || obj.period] : [],
          provenance: Array.isArray(obj.provenance) ? obj.provenance.filter(Boolean) : (obj.provenance ? [obj.provenance] : []),
          status: obj.status?.value || obj.status || null,
          classification: Array.isArray(obj.classification) 
            ? obj.classification.map(c => c.summary?.title || c.title || c).filter(Boolean)
            : obj.classification ? [obj.classification.summary?.title || obj.classification.title || obj.classification] : [],
          culture: Array.isArray(obj.culture) 
            ? obj.culture.map(c => c.value || c).filter(Boolean)
            : obj.culture ? [obj.culture.value || obj.culture] : [],
          department: Array.isArray(obj.department) 
            ? obj.department.map(d => d.summary?.title || d.title || d).filter(Boolean)
            : obj.department ? [obj.department.summary?.title || obj.department.title || obj.department] : [],
          exhibitions: Array.isArray(obj.exhibition)
            ? obj.exhibition.map(e => ({
                title: e.summary?.title || e.title || null,
                date: Array.isArray(e.date) ? e.date[0]?.value : e.date?.value || null
              })).filter(e => e.title)
            : [],
          inscription: obj.inscription || null,
          location: obj.location ? (obj.location.summary?.title || obj.location.title || obj.location) : null,
          materials: Array.isArray(obj.material) 
            ? obj.material.map(m => m.value || m).filter(Boolean)
            : obj.material ? [obj.material.value || obj.material] : []
        })),
        total: pagination.hits || objects.length,
        page: page + 1, // Convert back to 1-based for frontend
        pages: pagination.number_of_pages || Math.ceil((pagination.hits || objects.length) / per_page)
      };

      res.json(transformedResponse);
    } else {
      res.status(404).json({ error: "API endpoint not found" });
    }
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: err.message });
  }
});