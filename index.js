
const fab = document.getElementById("chat-fab");
const fabLabel = fab.querySelector(".fab-label");
const panel = document.getElementById("chat-panel");
const closeBtn = document.getElementById("chat-close");
const webchatHost = document.getElementById("webchat");

let hasStarted = false;

function setOpen(isOpen) {
  panel.setAttribute("aria-hidden", String(!isOpen));
  fab.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    fab.classList.add("is-hidden");   // 🔑 hide FAB
    fab.setAttribute("aria-label", "Close chat");
  } else {
    fab.classList.remove("is-hidden"); // 🔑 show FAB
    fab.setAttribute("aria-label", "Open chat");
  }
}

async function getDirectLineToken() {
  const res = await fetch(
    `https://afa-token-machine-exhxbxdnhhgve9e3.uksouth-01.azurewebsites.net/api/fuzzlab/directline-token?tenant=KARIBU_FOUNDRY`,
    { method: "GET" },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Token request failed (${res.status}). ${text}`);
  }
  const response = await res.json();
  return response;
}

async function startWebChat() {
  if (hasStarted) return;
  hasStarted = true;

  const { conversationId, token } = await getDirectLineToken();

  const directLine = window.WebChat.createDirectLine({
    domain: "https://europe.directline.botframework.com/v3/directline",
    token: token
  });

  window.WebChat.renderWebChat(
    {
      directLine,
      userID: conversationId,
    },
    webchatHost
  );
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

// Start closed
setOpen(false);