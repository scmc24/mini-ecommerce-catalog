const http = require('http');

// Catalogue en mémoire — volontairement simple, ce n'est pas le sujet
// de la démonstration (l'orchestration/sécurité l'est).
const PRODUCTS = [
  { id: '1', name: 'Clavier mécanique', price: 79.99 },
  { id: '2', name: 'Souris sans fil', price: 29.99 },
  { id: '3', name: 'Écran 27"', price: 249.99 },
];

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

function isAuthorized(req) {
  const expected = process.env.CATALOG_API_KEY;
  // Si aucune clé n'est configurée (ex. tests locaux), on n'exige rien —
  // évite de casser les tests unitaires qui n'ont pas ce contexte.
  if (!expected) return true;
  return req.headers['x-api-key'] === expected;
}

function createServer() {
  return http.createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'healthy' }));
      return;
    }

    if (!isAuthorized(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'unauthorized' }));
      return;
    }

    if (req.url === '/products') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(PRODUCTS));
      return;
    }

    const match = req.url.match(/^\/products\/(\w+)$/);
    if (match) {
      const product = findProduct(match[1]);
      if (!product) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'not found' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(product));
      return;
    }

    res.writeHead(404);
    res.end();
  });
}

if (require.main === module) {
  const port = process.env.PORT || 3000;
  createServer().listen(port, () => {
    console.log(`catalog listening on port ${port}`);
  });
}

module.exports = { createServer, findProduct, isAuthorized };
