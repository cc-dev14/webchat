
const brandLogoUrl = "/public/images/brand-logo.png";
const clientSubtitle = "Always here for you";
const tokenEndpoint = "https://afa-token-machine-exhxbxdnhhgve9e3.uksouth-01.azurewebsites.net/api/fuzzlab/directline-token";

window.ClientWebchat = {
  directLineInstances: {},
  hasStarted: false,

  init: async function ({ tenantId, origin }) {
    const clientName = capitalizeFirstLetter(tenantId);
    // Creates widget icon at bottom right
    const fab = document.createElement('button');
    fab.id = 'chat-fab';
    fab.className = 'fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Open chat');

    const fabIcon = document.createElement('img');
    fabIcon.className = 'fab-icon-img';
    fabIcon.src = brandLogoUrl;
    fab.appendChild(fabIcon);

    document.body.appendChild(fab);

    const panel = document.createElement('aside');
    panel.id = 'chat-panel';
    panel.className = 'panel';
    panel.setAttribute('aria-hidden', 'true');
    document.body.appendChild(panel);

    // Create header
    const header = document.createElement("header");
    header.className = "panel-header";

    // Panel title container
    const panelTitle = document.createElement("div");
    panelTitle.className = "panel-title";

    // Avatar
    const avatarDiv = document.createElement("div");
    avatarDiv.className = "panel-avatar";

    const avatarImg = document.createElement("img");
    avatarImg.className = "panel-avatar-img";
    avatarImg.src = brandLogoUrl;
    avatarImg.alt = "";
    avatarDiv.appendChild(avatarImg);

    // Name and subtitle
    const nameDiv = document.createElement("div");

    const nameEl = document.createElement("div");
    nameEl.className = "panel-name";
    nameEl.textContent = clientName;

    const subtitleEl = document.createElement("div");
    subtitleEl.className = "panel-subtitle";
    subtitleEl.textContent = clientSubtitle;

    nameDiv.appendChild(nameEl);
    nameDiv.appendChild(subtitleEl);

    // Assemble panel title
    panelTitle.appendChild(avatarDiv);
    panelTitle.appendChild(nameDiv);

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.id = "chat-close";
    closeBtn.className = "panel-close";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Close chat");
    closeBtn.textContent = "✕";

    // Assemble header
    header.appendChild(panelTitle);
    header.appendChild(closeBtn);

    // Append header to panel
    panel.appendChild(header);

    const webchatDiv = document.createElement('div');
    webchatDiv.id = 'webchat';
    webchatDiv.className = 'panel-body';
    panel.appendChild(webchatDiv);

    // Helper to open/close the panel
    const setOpen = (isOpen) => {
      panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      fab.style.display = isOpen ? 'none' : 'block';
    };

    const toggleChat = () => {
      const isOpen = panel.getAttribute('aria-hidden') === 'false';
      const next = !isOpen;
      setOpen(next);

      if (next) {
        this.startWebChat(tenantId, origin).catch((err) => {
          console.error(err);
          this.hasStarted = false;
          alert("Could not start chat. Check the token endpoint and server logs.");
          setOpen(false);
        });
      }
    };

    fab.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', () => setOpen(false));

    // Start closed
    setOpen(false);

  },

  getDirectLineToken: async function (tenantId, origin) {
    const res = await fetch(
      `${tokenEndpoint}?tenant=${tenantId}`,
      {
        method: "GET",
        headers: {
          'X-Tenant-ID': tenantId,
          'Origin': origin
        }
      },
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Token request failed (${res.status}). ${text}`);
    }
    const response = await res.json();
    return response;
  },

  startWebChat: async function (tenantId, origin) {
    const webchatHost = document.getElementById("webchat");
    if (this.hasStarted) return;
    this.hasStarted = true;

    const { conversationId, token } = await this.getDirectLineToken(tenantId, origin);

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
}

function capitalizeFirstLetter(str) {
  return str[0].toUpperCase() + str.slice(1);
}