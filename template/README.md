# Frontend — SiemReap Knowledge UI

A tiny static frontend to query the FastAPI `/chat/stream` endpoint and display responses.

Files:
- `index.html` — single-page UI
- `static/css/style.css` — basic styling
- `static/js/app.js` — fetch logic to POST to `/chat/stream`

How to use
1. Make sure the backend FastAPI server is running (see top-level README). By default the UI is preconfigured to POST to `http://localhost:8001/chat/stream`.

2a) Quick & simple (serve static files locally):

```bash
# from the project root or inside frontend/
python -m http.server 5500
# then open http://localhost:5500 in your browser
```

Note: If you serve the page from `http://localhost:5500`, make sure the FastAPI server allows cross-origin requests (CORS) or serve the frontend from the same origin.

2b) Serve the frontend from FastAPI (recommended for local integration):

Add to `main.py` (top-level file) near imports:

```py
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# add CORS (development only - tighten in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# mount frontend folder to root
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
```

Then run the server and open `http://localhost:8001`.

Notes & tips
- If your FastAPI server runs on a different port, update the `API endpoint` input in the UI.
- For production, restrict CORS to trusted origins and serve static files via a proper web server.
- Consider adding client-side validation, styles, or a nicer UI — this scaffold is intentionally minimal.

Next steps I can do for you
- Add CORS & StaticFiles mount to `main.py` so the UI is served by the FastAPI app (I can open a PR/update).
- Improve the UI or add a small React/Vue app if you'd prefer a richer experience.

Which of these would you like me to do next?
