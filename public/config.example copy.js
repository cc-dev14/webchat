// Optional client-side configuration.
// Copy to config.js and include it in index.html if you want.
//
// IMPORTANT:
// - Do not put secrets here.
// - Token endpoints should be same-origin when possible.

window.WEBCHAT_DEMO_CONFIG = {
  // Your site’s same-origin token endpoint (recommended).
  // The included server exposes: /api/directline/token
  tokenEndpoint: "/api/directline/token",

  // Optional: show/hide FAB label
  showFabLabel: true,

  // Optional: bot name displayed in the UI
  botName: "Support"
};
