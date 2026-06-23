const http = require('node:http');
const {
  calculateDiscountedPrice,
  estimateShipping,
  isValidEmail,
  normalizeUsername,
  totalCart,
} = require('./business');

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'content-type': 'application/json',
    'content-length': Buffer.byteLength(body),
  });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    try {
      if (req.method === 'GET' && url.pathname === '/health') {
        sendJson(res, 200, { status: 'ok' });
        return;
      }

      if (req.method === 'GET' && url.pathname === '/discount') {
        const price = Number(url.searchParams.get('price'));
        const percent = Number(url.searchParams.get('percent'));
        sendJson(res, 200, { price: calculateDiscountedPrice(price, percent) });
        return;
      }

      if (req.method === 'GET' && url.pathname === '/shipping') {
        const weightKg = Number(url.searchParams.get('weightKg'));
        const expedited = url.searchParams.get('expedited') === 'true';
        sendJson(res, 200, { shipping: estimateShipping(weightKg, expedited) });
        return;
      }

      if (req.method === 'POST' && url.pathname === '/cart/total') {
        const body = await readJson(req);
        sendJson(res, 200, { total: totalCart(body.items || []) });
        return;
      }

      if (req.method === 'POST' && url.pathname === '/users/normalize') {
        const body = await readJson(req);
        sendJson(res, 200, { username: normalizeUsername(body.username || '') });
        return;
      }

      if (req.method === 'POST' && url.pathname === '/users/validate-email') {
        const body = await readJson(req);
        sendJson(res, 200, { valid: isValidEmail(body.email || '') });
        return;
      }

      sendJson(res, 404, { error: 'Not found' });
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  createServer().listen(port, () => {
    console.log(`Bug project watcher app listening on http://localhost:${port}`);
  });
}

module.exports = { createServer };
