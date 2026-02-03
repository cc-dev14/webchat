# Direct Line Web Chat FAB Demo (Theming Playground)
A lightweight, embeddable JavaScript webchat widget for integrating Fuzzlab conversational experiences into websites.

Designed for **public-sector and regulated environments**, with explicit tenant scoping, origin controls, and a simple drop-in setup.
---

## Features

- Simple, framework-agnostic JavaScript embed
- Tenant-scoped configuration
- Secure Direct Line token generation
- Origin-restricted API access (CORS + server validation)
- No secrets exposed to the browser
- Suitable for production use in controlled environments

---
## Integration Overview

**HTML**
  - Chat button markup
  - Bot Web Chat import script
  - Reference to the JavaScript file

**JavaScript**
  - Fetching a Direct Line token
  - Initialising Web Chat
  - Opening and closing the chat window

**CSS**
  - Displays or hides chat

## How It Works
1. User clicks the Chat button on the website
2. JavaScript calls an Azure Function to request a Direct Line token
3. The token is returned securely
4. Bot Web Chat is initialised and displayed

---

## CORS & Origin rules
The web page calls a token endpoint from the browser. You will need to add your website origins. Please email contact@fuzzlab.co.uk for any enquiries.

---
## Add HTML to Your Page

**Bot Web Chat Import (Required)**

Add this once per page, before your custom JavaScript file:
```
<script crossorigin="anonymous" src="https://cdn.botframework.com/botframework-webchat/latest/webchat.js"></script>
```

**Chat Button Container**
```
<button id="chat-fab" class="fab" type="button" aria-label="Open chat">
  <img src="/public/images/brand-logo.png" alt="" aria-hidden="true" class="fab-icon-img" />
</button>

<div id="webchat" class="panel-body" role="region" aria-label="Chat messages"></div>
```



**Web Chat Integration Script**
```
<script type="module" src="./index.js"></script>
```
---

## Theming playground

Edit **`styles.css`**. The main knobs are CSS variables:

- `--fab-bg`, `--fab-fg`
- `--panel-bg`, `--panel-border`
- `--brand`, `--brand-2`
- `--radius`, `--shadow`

You can also restyle:
- FAB size + position
- Panel width/height
- Header layout

---

## Files

- `index.html` – page shell + FAB + panel
- `index.js` – Web Chat boot + open/close logic
- `styles.css` – theming playground 
- `public/images/brand-logo.png` – icon for the webchat

## License

Internal / client use.  
Contact Fuzzlab for commercial usage and support.
