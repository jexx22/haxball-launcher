const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const proxyOptions = {
  target: 'https://www.haxball.com',
  changeOrigin: true,
  ws: true, // Esto es lo vital para que pasen las salas en tiempo real
  secure: false,
  onProxyReqWs: (proxyReq, req, socket, options, head) => {
    proxyReq.setHeader('origin', 'https://www.haxball.com');
  }
};

app.use('/', createProxyMiddleware(proxyOptions));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});

// Soporte extra para asegurar el puente de WebSockets en Render
server.on('upgrade', (req, socket, head) => {
  createProxyMiddleware(proxyOptions).upgrade(req, socket, head);
});
