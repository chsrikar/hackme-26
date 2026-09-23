export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const queryOrBody = req.method === 'POST' ? req.body : req.query;
  const target = queryOrBody?.token || queryOrBody?.url || queryOrBody?.qrData || queryOrBody?.qrToken || '';

  if (!target) {
    return res.status(400).json({ error: 'Missing token or url' });
  }

  let verifierUrl = String(target).trim();
  if (!verifierUrl.startsWith('http')) {
    verifierUrl = `https://hack26-public-verifier.onrender.com/verify/${verifierUrl}`;
  }

  try {
    const response = await fetch(verifierUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Verifier returned HTTP ${response.status}` });
    }

    const html = await response.text();

    const pairs = {};
    const regex = /<div\s+class=["']label["']>\s*(.*?)\s*<\/div>\s*<div\s+class=["']value["']>\s*(.*?)\s*<\/div>/gis;
    let match;
    while ((match = regex.exec(html)) !== null) {
      pairs[match[1].trim()] = match[2].replace(/\s+/g, ' ').trim();
    }

    const name = pairs['Name'];
    const passId = pairs['Pass ID'];

    if (name && passId) {
      return res.status(200).json({
        success: true,
        participant: {
          name,
          passId,
          college: pairs['College'] || 'Visat Engineering College',
          department: pairs['Department / Batch'] || pairs['Department'] || 'CSE',
          status: pairs['Pass Status'] || 'ACTIVE'
        }
      });
    }

    return res.status(404).json({ error: 'Could not extract participant info from verification page' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Error resolving verifier URL' });
  }
}
