const { createProxyMiddleware } = require("http-proxy-middleware");

const API_URL = "http://localhost:4500";

const proxy = (app) => {
  app.use(
    createProxyMiddleware("/api", {
      target: API_URL,
      secure: true,
      changeOrigin: true,
      autoRewrite: true,
      pathRewrite: {
        "^/api": "/",
      },
      logLevel: "error",
    })
  );
  return app;
};

module.exports = proxy;
