# Direct Line Web Chat FAB Demo (Theming Playground)

This project demonstrates how to integrate Azure Bot Web Chat into a custom HTML page using Direct Line, with an Azure Function App responsible for securely generating Direct Line tokens.

The Web Chat UI is loaded on demand when the user clicks a chat icon, instead of loading automatically on page load.

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

## Security
The web page generates an access token generation, by calling an endpoint from the browser. Please email contact@fuzzlab.co.uk to request access to the token generator.

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
