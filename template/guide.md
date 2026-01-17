# Menu-Driven Frontend Integration Guide ✅

## Summary (Quick at-a-glance)
- Use the streaming endpoint `POST /chat/stream` to fetch **cards**, **details**, or **support links**.
- For UI-driven actions (menu chips, More buttons), send a control-prefixed query: `[UI_CMD:SR_SECURE_2026] <friendly text>` so the server treats it as a direct command.
- Server returns Markdown via Server-Sent Events (SSE); render `content` events incrementally and show a friendly fallback when content is missing.

---

## Quick Start ✅
1. Send user-initiated UI actions (button, chip, More) as a UI command: e.g.
   `{"query": "[UI_CMD:SR_SECURE_2026] Tell me about Angkor Sunrise Temple Tour"}`
2. Read SSE `content` events and append rendered Markdown to the UI as they arrive.
3. If the server returns `None` or `MISSING_ITEM_MESSAGE`, show a helpful fallback (search, suggestions, or a short apology message).

> Tip: Do not display the literal `[UI_CMD:SR_SECURE_2026]` prefix to users — show the friendly phrase or hide the triggered message entirely.

---

## Endpoints & required calls 🚦
- **POST /chat/stream** — **REQUIRED**
  - The primary SSE endpoint for all menu-driven flows (cards, detail pages, and support links) and free-text chat.
  - Accepts a JSON payload matching the `ChatRequest` model (e.g. `query`, `n_results`, `format`, ...). Use the `query` field to send UI commands (`[UI_CMD:SR_SECURE_2026] Tell me about <item>`) or natural-language queries.
  - Example payload:
    ```json
    { "query": "[UI_CMD:SR_SECURE_2026] Tell me about Angkor Sunrise Temple Tour", "n_results": 5 }
    ```
  - Response: Server-Sent Events (`content` chunks containing Markdown). This endpoint is required for menu-driven UI interactions.

- **GET /health** — *Optional (liveness)*
  - Returns a simple status object `{"status": "ok", "time": "..."}`. Useful for load balancers or quick liveness checks.

- **GET /ready** — *Optional (readiness)*
  - Returns whether the DB and models are loaded. Useful to gate the UI (show a loading/maintenance state until ready).

Notes:
- In most frontend apps you only need to integrate the single required endpoint `/chat/stream` for normal operation; use `/health` and `/ready` for monitoring or gating UI startup.
- POST-based SSE: because this endpoint uses POST to stream SSE, standard `EventSource` (which only supports GET) cannot be used; prefer using `fetch` with a streaming parser or a small SSE client that supports POST requests.

---

## Overview
- Content is authored under `knowledge/a_menu_driven/*.txt` and parsed server-side.
- The backend streams Markdown via SSE; frontends should transform that Markdown into rich, accessible UI components (cards, detail modals).
- Support contact is provided via a `CATEGORY: Talk To Agent` block in content files.

---

## Triggers (what to send / expect) 🔎
- Category trigger: phrases like `"I want to know <category>"` → returns a set of cards (up to 5).
- Detail trigger: phrases like `"Tell me about <item>"` → returns the detail markdown for that item.
- Agent trigger: `"talk to agent"` → returns support links (Live Chat, Call Center).

Helpful server-side helpers: `match_category_trigger`, `match_detail_trigger`, `is_agent_trigger`.

---

## UI_CMD control messages (format & usage) 🔐
- Format: `[UI_CMD:SR_SECURE_2026] <text>` (exact, case-sensitive prefix).
- When to use: button clicks (More), menu chips, or any UI that should bypass free-text parsing and trigger menu-driven content directly.
- Server behavior: `chat_stream` strips the prefix using `extract_ui_cmd_text`, processes the remainder, and returns cards, detail markdown, or support links.
- If no match exists, the server returns `MISSING_ITEM_MESSAGE`.

Example UI command (frontend payload):
```
POST /chat/stream
Content-Type: application/json
{
  "query": "[UI_CMD:SR_SECURE_2026] Tell me about Angkor Sunrise Temple Tour"
}
```

UX rule: When the user taps a More button, submit the exact UI command (`[UI_CMD:SR_SECURE_2026] Tell me about <title>`). Do not render the prefix to the user.

---

## Streaming (SSE) — minimal example
- The endpoint streams events with type `content` (chunks of Markdown) and a final `done` (or similar) event when complete.
- Treat `content` events as incremental fragments of the final Markdown document and render progressively for a snappy UX.

Example minimal SSE snippet (conceptual):

event: content
data: {"content":"![image](https://...)
**Angkor Sunrise Temple Tour**\n*Short desc*\nPrice: $25/person"}

event: content
data: {"content":"\n**About:** Start your day early ..."}

event: done
data: {}

Note: Implementation details for subscribing to POST-based SSE may vary by environment — use your platform's recommended streaming client and parse `data` payloads as JSON containing a `content` key.

---

## Server-provided outputs (what you'll receive) 🧩
1) Cards (category)
- Up to **5** card blocks (image, title, short description, price, and a "More" link that points to the UI command `Tell me about {title}`).
- If fewer than 5 items exist or required fields are missing, the card builder returns `None` (no cards).

Example card markdown (server):

![image](https://example.com/img.jpg)
**Angkor Sunrise Temple Tour**
*Witness the magical sunrise over Angkor Wat with a guided temple exploration.*
Price: $25/person
[More]([UI_CMD:SR_SECURE_2026] Tell me about Angkor Sunrise Temple Tour)

2) Detail (item)
- Full markdown with:
  - `# Title`
  - `![image](url)`
  - **About:** paragraph
  - **Highlights:** bullet list
  - **Information:** Price and Location/Booking
- If any key fields are missing the detail builder returns `None` and the server will use `MISSING_ITEM_MESSAGE`.

3) Support (agent)
- The `CATEGORY: Talk To Agent` block is normalized to two links: `[Live Chat](url)` and `[Call Center](tel:+xxx)`.

---

## Important constraints & failure modes ⚠️
- `None` responses: If cards or details are incomplete or insufficient, functions return `None` — handle this case gracefully.
- `MISSING_ITEM_MESSAGE` is the canonical message to show for missing item details (example: `"I'm sorry, I don't have details on that specific item yet."`).
- Category aliases & normalization: Titles are normalized server-side (lowercased, punctuation stripped).

Fallback strategies:
- If cards are `None`, show a friendly fallback (search prompt, suggested categories) rather than an empty screen.
- If a detail is `None`, show `MISSING_ITEM_MESSAGE` and optionally a "Request more info" CTA.

---

## UX suggestions & accessibility 🔧
- Cards: responsive grid (1–3 columns), lazy-load images, preserve aspect ratio, alt text = title.
- Buttons: "More" button should be keyboard-focusable and announce the target in ARIA labels.
- Progressive rendering: append `content` SSE chunks as they arrive to reduce perceived latency.
- Error states: clear, actionable copy (try again, contact support) and avoid raw server messages.

---

## Add / Edit content (content ops checklist) 📝
- Files live in `knowledge/a_menu_driven/*.txt`.
- Required item fields for cards/details: `TITLE`, `IMAGE`, `SHORT_DESC`, `PRICE`, `FULL_DESCRIPTION`, `HIGHLIGHTS`, `PRACTICAL_INFO`.
- Add a `CATEGORY: Talk To Agent` block with `Live_Chat` and `Call_Center` keys to update support links.

---

## Developer notes & references 📂
- Code: `services/menu_driven_controller.py` — parsing & builder functions.
- Helpful functions/constants: `match_category_trigger`, `match_detail_trigger`, `is_agent_trigger`, `extract_ui_cmd_text`, `MISSING_ITEM_MESSAGE`.
- Testing suggestions: unit tests for scenarios with <5 items, missing required fields, and UI_CMD-triggered flows.

---

**If you'd like, I can also add a short JS SSE client example or a test checklist file in the repo — tell me which and I'll add it.** ✨


