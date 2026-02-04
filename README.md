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

## Quick Start

### 1. Include the script

```html
<script src="https://cdn.botframework.com/botframework-webchat/latest/webchat.js"></script>
```

### 2. Initialise the widget

```html
<script>
  ClientWebchat.init({
    tenantId: "fuzzlab"
  });
</script>
```

---
## Configuration Options

| Option | Required | Description |
|------|--------|------------|
| `tenantId` | ✅ | Tenant identifier (e.g. `fuzzlab`) |
| `origin` | ✅ | Tenant website URL |

> **Important**  
> `origin` is **automatically sent**. Please send an email to contact@fuzzlab.co.uk to add your website URL to the allowed origins list for the API.
---
## How Security Works

This widget uses a **layered security model**, appropriate for public web embeds.

### Browser layer

- Requests are restricted using **CORS allow-listing**
- Only approved customer domains can call the API
---
### Application layer

Each request includes explicit tenant intent via headers:

```http
X-Tenant-ID: fuzzlab
Origin: https://www.fuzzlab.co.uk
```

The backend validates:
- Tenant existence
- Widget key association
- Allowed origins for that tenant
- Request eligibility before issuing a Direct Line token

### Token handling

- Tokens are short-lived
- Generated server-side only
- Never cached or persisted in the browser

No authentication credentials or secrets are exposed to the client.

---

## Backend Requirements

The backend must expose the following endpoint:

```http
GET /api/fuzzlab/directline-token
```

Expected request headers:

```http
X-Tenant-ID
Origin
```

The endpoint returns a standard Direct Line token response:

```json
{
  "token": "string",
  "expires_in": 1800
}
```
---

## Production Readiness

This implementation is suitable for:

- Live customer deployments
- Local authorities and housing providers
- Regulated and compliance-aware environments

Additional hardening (rate limiting, telemetry) can be applied at the API layer without changes to the widget.

## Notes

- This widget is intentionally **build-step free**
- All configuration is runtime-based
- No framework or bundler is required
- Designed to be easily embedded in CMSs and static sites

---

## License

Internal / client use.  
Contact Fuzzlab for commercial usage and support.
