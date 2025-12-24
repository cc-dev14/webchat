// public/app.js
// ----------------------------------------------------------
// Safe to customise: styling + UX tweaks.
// Not safe: do NOT add secrets in here.
// ----------------------------------------------------------

const config = window.WEBCHAT_DEMO_CONFIG || {
  tokenEndpoint: "/api/directline/token",
  showFabLabel: true,
  botName: "Support"
};

const fab = document.getElementById("chat-fab");
const fabLabel = fab.querySelector(".fab-label");
const panel = document.getElementById("chat-panel");
const closeBtn = document.getElementById("chat-close");
const webchatHost = document.getElementById("webchat");

if (!config.showFabLabel && fabLabel) fabLabel.style.display = "none";

let hasStarted = false;

function setOpen(isOpen) {
  panel.setAttribute("aria-hidden", String(!isOpen));
  fab.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    fab.setAttribute("aria-label", "Close chat");
  } else {
    fab.setAttribute("aria-label", "Open chat");
  }
}

async function getDirectLineToken() {
  const res = await fetch(config.tokenEndpoint, {
    method: "POST",
    headers: { "content-type": "application/json" }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Token request failed (${res.status}). ${text}`);
  }

  // Expected shape: { token: "..." } or { directLineToken: "..." }
  const json = await res.json();
  return json.token || json.directLineToken;
}

async function startWebChat() {
  if (hasStarted) return;
  hasStarted = true;

  const token = await getDirectLineToken();

  const styleOptions = {
    // ------------------------------------------------------
    // Theming hooks (safe to customise)
    // You can align these with your CSS variables.
    // ------------------------------------------------------
    accent: getComputedStyle(document.documentElement).getPropertyValue("--brand").trim() || "#0063B1",
    backgroundColor: "transparent",
    bubbleBorderRadius: 16,
    bubbleFromUserBorderRadius: 16,
    hideUploadButton: false
  };

  // Create a Direct Line connection
  const directLine = window.WebChat.createDirectLine({
    token,
    domain: "https://europe.directline.botframework.com/v3/directline"
  });
  
  // Render Web Chat
  window.WebChat.renderWebChat(
    {
      directLine,
      styleOptions,
      locale: "en-GB"
    },
    webchatHost
  );

  // Optional: focus the send box
  // (Web Chat renders async; delay slightly)
  setTimeout(() => {
    const input = webchatHost.querySelector('input[type="text"], textarea');
    if (input) input.focus();
  }, 250);
}

function toggleChat() {
  const isOpen = panel.getAttribute("aria-hidden") === "false";
  const next = !isOpen;
  setOpen(next);

  if (next) {
    startWebChat().catch((err) => {
      console.error(err);
      hasStarted = false;
      alert("Could not start chat. Check the token endpoint and server logs.");
      setOpen(false);
    });
  }
}

fab.addEventListener("click", toggleChat);
closeBtn.addEventListener("click", () => setOpen(false));

// Close with ESC
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && panel.getAttribute("aria-hidden") === "false") {
    setOpen(false);
  }
});

// Start closed
setOpen(false);
