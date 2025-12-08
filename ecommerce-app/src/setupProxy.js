const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy /api/* to backend (existing)
  app.use(
    ['/api', '/auth', '/admin', '/sellers', '/products', '/home', '/payment-success', '/cart','/users', '/orders/user'],
    createProxyMiddleware({
      target: 'http://localhost:5424',
      changeOrigin: true,
    })
  );

  // Proxy /payment-success/* to backend
 
};