document.addEventListener("DOMContentLoaded", () => {
  let form = document.getElementById("askForm");
  let queryEl = document.getElementById("query");
  let nResultsEl = document.getElementById("nResults");
  let apiUrlEl = document.getElementById("apiUrl");
  let submitBtn = document.getElementById("submitBtn");
  let statusEl = document.getElementById("status");
  let resultSection = document.getElementById("result");
  let answerEl = document.getElementById("answer");
  let sourcesEl = document.getElementById("sources");
  let messages = document.getElementById("messages");
  let heroForm = document.getElementById("heroForm");
  let heroQuery = document.getElementById("heroQuery");
  let heroSend = document.getElementById("heroSend");

  // Abort controller for the currently active streaming request
  let currentRequestController = null;

  // ============================================
  // CRITICAL FIX: Track context properly
  // ============================================
  let lastDetectedSubject = null;
  let currentListContext = null;

  const STORAGE_KEY = "siem_reap_chat_history";
  const CONTEXT_KEY = "siem_reap_last_context";
  const LIST_CONTEXT_KEY = "siem_reap_last_list_context";
  const UI_CMD_PREFIX = "[UI_CMD:SR_SECURE_2026]";

  // Save/load context separately
  function saveContextToStorage(context) {
    try {
      if (context) {
        localStorage.setItem(CONTEXT_KEY, context);
        console.log("💾 Context saved:", context);
      } else {
        localStorage.removeItem(CONTEXT_KEY);
        console.log("🗑️ Context cleared");
      }
    } catch (e) {
      console.error("Failed to save context", e);
    }
  }

  function loadContextFromStorage() {
    try {
      const context = localStorage.getItem(CONTEXT_KEY);
      console.log("📂 Context loaded:", context);
      return context;
    } catch (e) {
      console.error("Failed to load context", e);
      return null;
    }
  }

  function saveListContextToStorage(context) {
    try {
      if (context) {
        localStorage.setItem(LIST_CONTEXT_KEY, JSON.stringify(context));
      } else {
        localStorage.removeItem(LIST_CONTEXT_KEY);
      }
    } catch (e) {
      console.error("Failed to save list context", e);
    }
  }

  function loadListContextFromStorage() {
    try {
      const raw = localStorage.getItem(LIST_CONTEXT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error("Failed to load list context", e);
      return null;
    }
  }

  // localStorage functions for chat persistence
  function saveChatToStorage(chatHistory) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
    } catch (e) {
      console.error("Failed to save chat history", e);
    }
  }

  function loadChatFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load chat history", e);
      return [];
    }
  }

  function addMessageToHistory(role, content, sources = null, ui = null) {
    const chatHistory = loadChatFromStorage();
    const newMessage = {
      id: Date.now().toString(),
      role,
      content,
      sources,
      ui,
      timestamp: new Date().toISOString(),
    };
    chatHistory.push(newMessage);
    saveChatToStorage(chatHistory);
    return newMessage;
  }

  function clearChatHistory() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CONTEXT_KEY);
    localStorage.removeItem(LIST_CONTEXT_KEY);
    lastDetectedSubject = null;
    currentListContext = null;
  }

  function copyIconSVG() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="9" y="9" width="11" height="11" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <rect x="4" y="4" width="11" height="11" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="1.6"/>
    </svg>`;
  }

  function editIconSVG() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 20l4.5-1 10-10-3.5-3.5-10 10L4 20z" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <path d="M14.5 5.5l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
    </svg>`;
  }

  async function copyTextToClipboard(text) {
    if (!text) return false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) {
      /* fallback below */
    }

    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "true");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  function focusQueryInput(text) {
    if (heroForm) heroForm.classList.add("hidden");
    if (form) form.classList.remove("hidden");
    document.body.classList.remove("hero-centered");

    if (queryEl) {
      queryEl.value = text || "";
      queryEl.focus();
      queryEl.setSelectionRange(queryEl.value.length, queryEl.value.length);
      return;
    }

    if (heroQuery) {
      heroQuery.value = text || "";
      heroQuery.focus();
      heroQuery.setSelectionRange(heroQuery.value.length, heroQuery.value.length);
    }
  }

  function stripUiCmdPrefix(text) {
    if (!text) return "";
    const raw = String(text);
    const trimmed = raw.trim();
    const prefix = UI_CMD_PREFIX;
    if (trimmed.toLowerCase().startsWith(prefix.toLowerCase())) {
      return trimmed.slice(prefix.length).trim();
    }
    return raw;
  }

  function createUserMessageElement(text, messageId = null) {
    const rawText = text || "";
    const displayText = stripUiCmdPrefix(rawText);
    const wrap = document.createElement("div");
    wrap.className = "msg-wrap user";
    if (messageId) wrap.dataset.messageId = messageId;

    const textEl = document.createElement("div");
    textEl.className = "msg-text";
    textEl.textContent = displayText;

    const actions = document.createElement("div");
    actions.className = "msg-actions";

    const bubble = document.createElement("div");
    bubble.className = "msg user";
    bubble.appendChild(textEl);

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "msg-action-btn";
    copyBtn.setAttribute("aria-label", "Copy question");
    copyBtn.title = "Copy question";
    copyBtn.innerHTML = copyIconSVG();
    copyBtn.addEventListener("click", async (ev) => {
      ev.stopPropagation();
      const ok = await copyTextToClipboard(displayText);
      if (ok) {
        copyBtn.classList.add("copied");
        copyBtn.title = "Copied";
        setTimeout(() => {
          copyBtn.classList.remove("copied");
          copyBtn.title = "Copy question";
        }, 1200);
      }
    });

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "msg-action-btn";
    editBtn.setAttribute("aria-label", "Edit question");
    editBtn.title = "Edit question";
    editBtn.innerHTML = editIconSVG();
    editBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      focusQueryInput(rawText);
    });

    actions.appendChild(copyBtn);
    actions.appendChild(editBtn);

    wrap.appendChild(bubble);
    wrap.appendChild(actions);
    return wrap;
  }

  // Format source name: remove extension, normalize separators, and title-case each part
  function formatSourceName(source) {
    if (!source) return "Unknown";
    // remove extension
    let s = String(source)
      .replace(/\.txt$/i, "")
      .trim();
    // replace underscores/hyphens with spaces
    s = s.replace(/[_\-]+/g, " ");

    // Split on slashes to preserve hierarchical segments, title-case each word
    const parts = s
      .split(/\s*\/\s*/)
      .map((part) => {
        return part
          .split(/\s+/)
          .filter(Boolean)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      })
      .filter(Boolean);

    return parts.join(" / ");
  }

  // Restore chat history from localStorage on page load
  function restoreChatHistory() {
    // Load context first
    lastDetectedSubject = loadContextFromStorage();
    currentListContext = loadListContextFromStorage();

    const chatHistory = loadChatFromStorage();
    if (chatHistory.length === 0) return;

    if (heroForm) heroForm.classList.add("hidden");
    if (form) form.classList.remove("hidden");
    document.body.classList.remove("hero-centered");

    chatHistory.forEach((msg) => {
      if (msg.role === "user") {
        const um = createUserMessageElement(msg.content, msg.id);
        messages.appendChild(um);
      } else if (msg.role === "ai") {
        const am = document.createElement("div");
        am.className = "msg ai";
        am.dataset.messageId = msg.id;

        if (msg.ui && msg.ui.type === "cards") {
          renderCardList(am, msg.ui.data);
        } else if (msg.ui && msg.ui.type === "actions") {
          renderActionButtons(am, msg.ui.data);
        } else {
          const formatted = formatAnswer(msg.content || "");
          am.appendChild(formatted);
        }

        if (msg.sources && msg.sources.length) {
          updateSourcesDisplay(am, msg.sources);
        }

        messages.appendChild(am);
      }
    });

    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 100);
  }

  // function defaultApiUrl() {
  //   if (window.location.port === "8001")
  //     return `${window.location.origin}/chat/stream`;
  //   return `${window.location.protocol}//${window.location.hostname}:8001/chat/stream`;
  // }

  function defaultApiUrl() {
    // If running locally (dev)
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return `${window.location.protocol}//${window.location.hostname}:8001/chat/stream`;
    }

    // If running behind Cloudflare / production
    return `${window.location.origin}/chat/stream`;
  }

  function normalizeApiUrl(rawUrl) {
    if (!rawUrl) return rawUrl;
    if (rawUrl.endsWith("/chat/stream")) return rawUrl;
    if (rawUrl.endsWith("/chat")) return `${rawUrl}/stream`;
    return rawUrl;
  }

  function isSecureUiCommand(message) {
    const raw = String(message || "");
    return raw.includes(UI_CMD_PREFIX);
  }

  function isAffirmativeReply(text) {
    const cleaned = String(text || "").trim().toLowerCase();
    if (!cleaned) return false;
    return /^(yes|yes please|yep|yeah|sure|sure please|ok|okay|please)$/.test(
      cleaned
    );
  }

  function getLastAiMessage() {
    const chatHistory = loadChatFromStorage();
    for (let i = chatHistory.length - 1; i >= 0; i -= 1) {
      const msg = chatHistory[i];
      if (msg && msg.role === "ai") return msg;
    }
    return null;
  }

  function lastNonEmptyLine(text) {
    const lines = String(text || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    return lines.length ? lines[lines.length - 1] : "";
  }

  function isClarificationPrompt(text) {
    const lastLine = lastNonEmptyLine(text);
    return /^need clarification\b/i.test(lastLine);
  }

  function isServiceOfferPrompt(text) {
    const lastLine = lastNonEmptyLine(text);
    if (!lastLine) return false;
    return (
      /would you like to see .*cards/i.test(lastLine) ||
      /choose a menu to see cards/i.test(lastLine) ||
      /recommended service cards/i.test(lastLine)
    );
  }

  function formatMenuLabel(category) {
    const cleaned = String(category || "").trim().toLowerCase();
    if (!cleaned) return "";
    if (cleaned === "private villa") return "Private Villa";
    if (cleaned === "tour guide") return "Tour Guide";
    return cleaned
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function buildMenuUiCommand(category) {
    const label = formatMenuLabel(category);
    return label ? `${UI_CMD_PREFIX} Want to know ${label}` : "";
  }

  function resolveServiceOfferCategory(text, suggestionContext, listContext) {
    const listSuggested =
      listContext && normalizeSuggestionCategory(listContext.suggested_category);
    if (listSuggested) return listSuggested;
    if (suggestionContext && suggestionContext.suggestedCategory) {
      return suggestionContext.suggestedCategory;
    }
    const categories = extractCategoriesFromText(text);
    return categories.length === 1 ? categories[0] : null;
  }

  function appendLocalUserMessage(text) {
    if (!messages) return;
    const saved = addMessageToHistory("user", text);
    const um = createUserMessageElement(text, saved && saved.id);
    messages.appendChild(um);
  }

  function appendLocalAiMessage(text) {
    if (!messages) return;
    const saved = addMessageToHistory("ai", text);
    const am = document.createElement("div");
    am.className = "msg ai";
    if (saved && saved.id) am.dataset.messageId = saved.id;
    am.appendChild(formatAnswer(text || ""));
    messages.appendChild(am);
    window.scrollTo(0, document.body.scrollHeight);
  }

  function normalizeSuggestionCategory(text) {
    const cleaned = String(text || "").trim().toLowerCase();
    if (!cleaned) return null;
    if (cleaned.includes("private villa")) return "private villa";
    if (cleaned.includes("tour guide")) return "tour guide";
    return null;
  }

  function extractCategoriesFromText(text) {
    const categories = [];
    const raw = String(text || "");
    if (/private villa/i.test(raw)) categories.push("private villa");
    if (/tour guide/i.test(raw)) categories.push("tour guide");
    return categories;
  }

  function extractSuggestedItemFromContent(text) {
    if (!text) return null;
    const lines = String(text).split(/\r?\n/);
    for (const raw of lines) {
      const line = raw.trim();
      if (line.startsWith("# ")) {
        const title = line.replace(/^#\s+/, "").trim();
        if (title) return title;
      }
    }
    return null;
  }

  function getLastAiSuggestionContext() {
    const chatHistory = loadChatFromStorage();
    for (let i = chatHistory.length - 1; i >= 0; i -= 1) {
      const msg = chatHistory[i];
      if (!msg || msg.role !== "ai") continue;

      let categories = [];
      let suggestedItem = null;
      let state = null;
      let suggestedCategory = null;

      if (msg.ui && msg.ui.type === "cards" && msg.ui.data) {
        const menu = msg.ui.data.menu;
        const menuCategory = normalizeSuggestionCategory(menu);
        if (menuCategory) categories.push(menuCategory);

        const items = msg.ui.data.items || [];
        if (items.length === 1 && items[0] && items[0].title) {
          suggestedItem = items[0].title;
        }

        if (msg.ui.data.context) {
          state = String(msg.ui.data.context);
        }
        if (msg.ui.data.suggested_category) {
          const hinted = normalizeSuggestionCategory(msg.ui.data.suggested_category);
          if (hinted) {
            categories = [hinted];
            suggestedCategory = hinted;
          }
        }
      }

      if (!suggestedItem && msg.content) {
        suggestedItem = extractSuggestedItemFromContent(msg.content);
      }

      if (!categories.length && msg.content) {
        categories = extractCategoriesFromText(msg.content);
      }

      if (msg.content) {
        const raw = String(msg.content);
        if (/pricing mode/i.test(raw)) {
          state = state || "planner";
        }
        if (/budget mode/i.test(raw)) {
          suggestedCategory = "tour guide";
        } else if (/luxury mode/i.test(raw)) {
          suggestedCategory = "private villa";
        } else if (/mid-range mode/i.test(raw)) {
          suggestedCategory = "private villa";
        }
      }

      if (!suggestedCategory && categories.length === 1) {
        suggestedCategory = categories[0];
      }

      if (categories.length || suggestedItem || state || suggestedCategory) {
        return { categories, suggestedItem, state, suggestedCategory };
      }
    }
    return null;
  }

  function lastAiContains(text) {
    if (!text) return false;
    const chatHistory = loadChatFromStorage();
    for (let i = chatHistory.length - 1; i >= 0; i -= 1) {
      const msg = chatHistory[i];
      if (msg && msg.role === "ai" && typeof msg.content === "string") {
        return msg.content.includes(text);
      }
    }
    return false;
  }

  async function handleSendMessage(message, options = {}) {
    const trimmed = String(message || "").trim();
    if (!trimmed) return;

    const lastAi = getLastAiMessage();
    const lastAiText =
      lastAi && typeof lastAi.content === "string" ? lastAi.content : "";
    const suggestionContext = getLastAiSuggestionContext();
    if (isAffirmativeReply(trimmed)) {
      if (isClarificationPrompt(lastAiText)) {
        appendLocalUserMessage(trimmed);
        appendLocalAiMessage(
          "I'm happy to help! What specifically would you like me to clarify or explain further?"
        );
        if (queryEl) queryEl.value = "";
        if (heroQuery) heroQuery.value = "";
        return;
      }

      if (isServiceOfferPrompt(lastAiText)) {
        const category = resolveServiceOfferCategory(
          lastAiText,
          suggestionContext,
          currentListContext
        );
        const cmd = buildMenuUiCommand(category);
        if (cmd) {
          await sendQuery(cmd, {
            displayUserMessage: true,
            displayText: trimmed,
          });
          return;
        }
      }
    }

    await sendQuery(trimmed, options);
  }

  if (heroForm) {
    if (messages && messages.hasChildNodes()) {
      document.body.classList.remove("hero-centered");
    }

    heroForm.addEventListener("submit", async (ev) => {
      ev.preventDefault();

      // Prevent starting a new request while one is already running
      if (submitBtn && submitBtn.dataset.mode === "stop") {
        statusEl.textContent =
          "A request is currently running — click Stop to cancel first.";
        return;
      }

      const q = ((heroQuery && heroQuery.value) || "").trim();
      if (!q) return;

      heroForm.classList.add("hidden");
      document.body.classList.remove("hero-centered");
      if (form) form.classList.remove("hidden");
      if (queryEl) queryEl.value = q;
      if (queryEl) queryEl.focus();

      await handleSendMessage(q);
    });

    /* -------------------------------
       Prompt suggestions for hero and footer inputs
       - Shows a filtered list as user types
       - Supports click/select and keyboard navigation
       ------------------------------- */
    const PROMPT_SUGGESTIONS = [
      "What is the best time to visit Angkor Wat?",
      "Give me top 10 local foods to try in Siem Reap",
      "How to get from Phnom Penh to Siem Reap?",
      "Tell me about siem reap",
      "Tell me about angkor wat",
      "Tell me about pub street in siem reap",
      "Best temples to visit in Siem Reap",
      "Do you have images of Angkor Wat at sunrise?",
      "Top restaurants in Siem Reap",
      "Cultural events in Siem Reap",
      "Historical significance of Angkor Wat",
    ];

    const SUGGEST_MIN_CHARS = 1; // only show suggestions when user typed at least this many characters
    const SUGGEST_DEBOUNCE_MS = 160;

    function createSuggestionItem(text) {
      const div = document.createElement("div");
      div.className = "suggestion-item";
      div.setAttribute("role", "option");
      div.textContent = text;
      return div;
    }

    function hideSuggestions(container) {
      if (!container) return;
      container.classList.add("hidden");
      container.classList.remove("fade-in");
      container.innerHTML = "";
      container.dataset.index = "-1";
      if (container._suggestTimer) {
        clearTimeout(container._suggestTimer);
        container._suggestTimer = null;
      }
    }

    function renderSuggestions(container, items, inputEl) {
      if (!container) return;
      container.innerHTML = "";
      if (!items || items.length === 0) return hideSuggestions(container);

      items.forEach((it) => {
        const el = createSuggestionItem(it);
        el.addEventListener("click", () => applySuggestion(it, inputEl, true));
        container.appendChild(el);
      });

      container.dataset.index = "-1";
      // animation: force reflow then add class
      container.classList.remove("hidden");
      container.classList.remove("fade-in");
      void container.offsetWidth; // force reflow for restart
      container.classList.add("fade-in");
    }

    function showFilteredSuggestions(container, inputEl) {
      if (!container || !inputEl) return;
      const raw = (inputEl.value || "").trim();

      // Only proceed when user has typed at least 3 words
      const words = raw.split(/\s+/).filter(Boolean);

      // debounce so suggestions only appear while typing
      if (container._suggestTimer) clearTimeout(container._suggestTimer);
      container._suggestTimer = setTimeout(() => {
        container._suggestTimer = null;

        if (words.length < 2) {
          // require at least 2 words before showing anything
          hideSuggestions(container);
          return;
        }

        const q = raw.toLowerCase();

        // Strict startsWith matching so suggestions show only when the typed words match the start of a suggestion
        const matches = PROMPT_SUGGESTIONS.filter((s) =>
          s.toLowerCase().startsWith(q)
        );
        if (!matches || matches.length === 0) {
          hideSuggestions(container);
          return;
        }

        renderSuggestions(container, matches.slice(0, 6), inputEl);
      }, SUGGEST_DEBOUNCE_MS);
    }

    function applySuggestion(text, inputEl, submit = false) {
      if (!inputEl) return;
      inputEl.value = text;
      inputEl.focus();

      const container = document.getElementById(
        inputEl.id === "heroQuery" ? "heroSuggestions" : "querySuggestions"
      );
      hideSuggestions(container);

      if (submit) {
        if (inputEl.id === "heroQuery") {
          // submit hero form which will trigger the normal flow
          heroForm.dispatchEvent(new Event("submit", { cancelable: true }));
        } else {
          // submit the footer form
          form.dispatchEvent(new Event("submit", { cancelable: true }));
        }
      }
    }

    function setupSuggestionInput(inputEl, container) {
      if (!inputEl || !container) return;

      inputEl.addEventListener("input", () =>
        showFilteredSuggestions(container, inputEl)
      );
      // only show suggestions on focus if user already typed enough characters
      inputEl.addEventListener("focus", () => {
        if ((inputEl.value || "").trim().length >= SUGGEST_MIN_CHARS) {
          showFilteredSuggestions(container, inputEl);
        }
      });
      // small delay on blur so click handlers can trigger first
      inputEl.addEventListener("blur", () =>
        setTimeout(() => hideSuggestions(container), 150)
      );

      inputEl.addEventListener("keydown", (ev) => {
        const hidden = container.classList.contains("hidden");
        // If user presses arrow keys and suggestions are hidden but there's typed text, show suggestions
        if (
          hidden &&
          (ev.key === "ArrowDown" || ev.key === "ArrowUp") &&
          (inputEl.value || "").trim().length >= SUGGEST_MIN_CHARS
        ) {
          showFilteredSuggestions(container, inputEl);
          ev.preventDefault();
          return;
        }

        if (
          !hidden &&
          (ev.key === "ArrowDown" ||
            ev.key === "ArrowUp" ||
            ev.key === "Enter" ||
            ev.key === "Escape")
        ) {
          ev.preventDefault();
        }

        if (ev.key === "ArrowDown") {
          const items = Array.from(
            container.querySelectorAll(".suggestion-item")
          );
          if (items.length === 0) return;
          let idx = parseInt(container.dataset.index || "-1", 10);
          idx = Math.min(items.length - 1, idx + 1);
          items.forEach((it, i) =>
            it.classList.toggle("highlighted", i === idx)
          );
          container.dataset.index = String(idx);
        } else if (ev.key === "ArrowUp") {
          const items = Array.from(
            container.querySelectorAll(".suggestion-item")
          );
          if (items.length === 0) return;
          let idx = parseInt(container.dataset.index || "-1", 10);
          idx = Math.max(-1, idx - 1);
          items.forEach((it, i) =>
            it.classList.toggle("highlighted", i === idx)
          );
          container.dataset.index = String(idx);
        } else if (ev.key === "Enter") {
          const items = Array.from(
            container.querySelectorAll(".suggestion-item")
          );
          const idx = parseInt(container.dataset.index || "-1", 10);
          if (idx >= 0 && items[idx]) {
            applySuggestion(items[idx].textContent, inputEl, true);
            return;
          }
        } else if (ev.key === "Escape") {
          hideSuggestions(container);
        }
      });
    }

    const heroSuggestions = document.getElementById("heroSuggestions");
    const querySuggestions = document.getElementById("querySuggestions");
    if (heroQuery && heroSuggestions)
      setupSuggestionInput(heroQuery, heroSuggestions);
    if (queryEl && querySuggestions)
      setupSuggestionInput(queryEl, querySuggestions);

    // Hide suggestions when clicking elsewhere
    document.addEventListener("click", (ev) => {
      if (
        !ev.target.closest(".suggestions") &&
        !ev.target.closest("#heroQuery") &&
        !ev.target.closest("#query")
      ) {
        hideSuggestions(heroSuggestions);
        hideSuggestions(querySuggestions);
      }
    });
  }

  async function sendQuery(query, options = {}) {
    query = String(query || "").trim();
    if (!query) return;
    document.body.classList.remove("hero-centered");

    const displayOverride = options.displayUserMessage;
    const displayUserMessage =
      displayOverride === true ||
      (displayOverride !== false && !isSecureUiCommand(query));
    const displayTextRaw = options.displayText;
    let displayText =
      displayTextRaw !== undefined && displayTextRaw !== null
        ? String(displayTextRaw).trim()
        : query;
    if (!displayText) displayText = query;

    // set API URL to /chat/stream endpoint
    const apiUrl =
      apiUrlEl && apiUrlEl.value && apiUrlEl.value.trim()
        ? normalizeApiUrl(apiUrlEl.value.trim())
        : defaultApiUrl();

    const n_results =
      nResultsEl && !Number.isNaN(parseInt(nResultsEl.value, 10))
        ? parseInt(nResultsEl.value, 10)
        : 15;

    // 1. Show User message
    if (displayUserMessage && messages) {
      const saved = addMessageToHistory("user", displayText);
      const um = createUserMessageElement(displayText, saved && saved.id);
      messages.appendChild(um);
      window.scrollTo(0, document.body.scrollHeight);
    }

    if (queryEl) queryEl.value = "";

    // Put the UI into a running (stop-capable) state
    setRunningState(true);
    statusEl.textContent = "Thinking...";

    // 2. Create AI message container (add class 'entered' when complete)
    const am = document.createElement("div");
    am.className = "msg ai animate-in entered";
    messages.appendChild(am);

    const thinking = document.createElement("p");
    thinking.className = "answer-para thinking";
    thinking.textContent = "Thinking";
    am.appendChild(thinking);

    requestAnimationFrame(() => {
      am.style.opacity = "1";
    });

    let accumulatedAnswer = "";
    let partialLine = ""; // for capturing incomplete JSON chunks
    let currentSources = [];
    let currentUiPayload = null;

    try {
      // Use an AbortController so the user can cancel the streaming request
      const controller = new AbortController();
      currentRequestController = controller;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query,
          n_results: n_results,
          last_subject: lastDetectedSubject,
          list_context: currentListContext,
          selected_item: options.selectedItem || null,
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = (partialLine + chunk).split("\n");
        partialLine = lines.pop(); // for capturing incomplete lines

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          try {
            const parsed = JSON.parse(line.replace("data: ", "").trim());

            if (parsed.type === "content") {
              accumulatedAnswer += parsed.data;

              // Call original formatAnswer (preserve clean formatting)
              am.innerHTML = "";
              am.appendChild(formatAnswer(accumulatedAnswer));

              window.scrollTo(0, document.body.scrollHeight);
            } else if (parsed.type === "cards") {
              currentUiPayload = { type: "cards", data: parsed.data };
              const hasText =
                accumulatedAnswer && accumulatedAnswer.trim().length > 0;
              if (hasText) {
                am.innerHTML = "";
                am.appendChild(formatAnswer(accumulatedAnswer));
                const cardWrap = document.createElement("div");
                cardWrap.className = "answer-cards";
                renderCardList(cardWrap, parsed.data);
                am.appendChild(cardWrap);
              } else {
                accumulatedAnswer = "";
                currentSources = [];
                am.innerHTML = "";
                renderCardList(am, parsed.data);
              }
              window.scrollTo(0, document.body.scrollHeight);
            } else if (parsed.type === "actions") {
              currentUiPayload = { type: "actions", data: parsed.data };
              accumulatedAnswer = "";
              currentSources = [];
              am.innerHTML = "";
              renderActionButtons(am, parsed.data);
              window.scrollTo(0, document.body.scrollHeight);
            } else if (parsed.type === "sources") {
              currentSources = parsed.data;
              updateSourcesDisplay(am, currentSources);
            } else if (parsed.type === "list_context") {
              currentListContext = parsed.data;
              if (
                currentListContext &&
                currentListContext.items &&
                currentListContext.items.length
              ) {
                saveListContextToStorage(currentListContext);
              } else {
                saveListContextToStorage(null);
              }
            } else if (parsed.type === "done") {
              am.classList.add("entered"); // Answer complete, remove blinking cursor
              statusEl.textContent = `Done — ${
                currentSources.length > 0 ? n_results : 0
              } result(s).`;

              if (accumulatedAnswer || currentUiPayload) {
                addMessageToHistory(
                  "ai",
                  accumulatedAnswer,
                  currentSources,
                  currentUiPayload
                );
              }

              // Update Context properly
              if (currentSources.length > 0 && currentSources[0].source) {
                const s0 = currentSources[0].source;
                if (!isWebishSourceName(s0)) {
                  lastDetectedSubject = s0;
                  saveContextToStorage(lastDetectedSubject);
                }
              }
            }
          } catch (e) {
            console.warn("Incomplete chunk skipped", e);
          }
        }
      }
    } catch (err) {
      console.error("❌ Stream failed", err);

      if (err && err.name === "AbortError") {
        statusEl.textContent = "Stopped by user.";
        am.classList.add("entered");
        am.innerHTML = `<p class="answer-para">Stopped by user.</p>`;
      } else {
        statusEl.textContent = `Error: ${err.message}`;
        am.classList.add("entered");
        am.innerHTML = `<p class="answer-para">Error: ${err.message}</p>`;
      }
    } finally {
      // cleanup controller
      if (currentRequestController) {
        try {
          currentRequestController = null;
        } catch (e) {
          /* ignore */
        }
      }

      // reset the UI to non-running state
      setRunningState(false);
    }
  }

  // --- Running UI helpers & Abort handlers ---
  function stopIconSVG() {
    return `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="12" height="12" rx="2" fill="#ffffff" />
      </svg>
    `;
  }

  function sendIconSVG() {
    return `<svg width="28px" height="28px" viewBox="0 0 24 24" fill="none">
      <g><path d="M6.4569 9.73276C6.17123 10.0327 6.18281 10.5074 6.48276 10.7931C6.78271 11.0788 7.25744 11.0672 7.5431 10.7672L6.4569 9.73276ZM12.5431 5.51724C12.8288 5.21729 12.8172 4.74256 12.5172 4.4569C12.2173 4.17123 11.7426 4.18281 11.4569 4.48276L12.5431 5.51724ZM12.5431 4.48276C12.2574 4.18281 11.7827 4.17123 11.4828 4.4569C11.1828 4.74256 11.1712 5.21729 11.4569 5.51724L12.5431 4.48276ZM16.4569 10.7672C16.7426 11.0672 17.2173 11.0788 17.5172 10.7931C17.8172 10.5074 17.8288 10.0327 17.5431 9.73276L16.4569 10.7672ZM12.75 5C12.75 4.58579 12.4142 4.25 12 4.25C11.5858 4.25 11.25 4.58579 11.25 5H12.75ZM11.25 19C11.25 19.4142 11.5858 19.75 12 19.75C12.4142 19.75 12.75 19.4142 12.75 19H11.25ZM7.5431 10.7672L12.5431 5.51724L11.4569 4.48276L6.4569 9.73276L7.5431 10.7672ZM11.4569 5.51724L16.4569 10.7672L17.5431 9.73276L12.5431 4.48276L11.4569 5.51724ZM11.25 5V19H12.75V5H11.25Z" fill="#ffffff"></path></g>
    </svg>`;
  }

  function setRunningState(isRunning) {
    if (!submitBtn) return;

    if (isRunning) {
      submitBtn.dataset.mode = "stop";
      submitBtn.setAttribute("aria-busy", "true");
      submitBtn.classList.add("running");
      // show stop icon (clickable)
      submitBtn.innerHTML = stopIconSVG();
      submitBtn.title = "Stop generation";

      if (heroSend) {
        heroSend.title = "Stop generation";
        heroSend.innerHTML = stopIconSVG();
      }
    } else {
      delete submitBtn.dataset.mode;
      submitBtn.removeAttribute("aria-busy");
      submitBtn.classList.remove("running");
      submitBtn.innerHTML = sendIconSVG();
      submitBtn.title = "Send";

      if (heroSend) {
        heroSend.title = "Send";
        heroSend.innerHTML = sendIconSVG();
      }
    }
  }

  // Allow clicking the buttons to stop when a request is running
  if (submitBtn) {
    submitBtn.addEventListener("click", (ev) => {
      if (submitBtn.dataset.mode === "stop") {
        ev.preventDefault();
        if (currentRequestController) {
          currentRequestController.abort();
        }
      }
    });
  }
  if (heroSend) {
    heroSend.addEventListener("click", (ev) => {
      if (submitBtn.dataset.mode === "stop") {
        ev.preventDefault();
        if (currentRequestController) {
          currentRequestController.abort();
        }
      }
    });
  }

  // Helper to build a single source list item: a button labeled "Source(s)" with hover/focus tooltip showing full info
  function createSourceListItem(sourceText, labelText = "Source") {
    const li = document.createElement("li");
    li.className = "source-item";
    li.style.position = "relative";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "source-btn";
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("title", "Show source details");

    const label = document.createElement("span");
    label.className = "source-btn-label";
    label.textContent = labelText;

    const tooltip = document.createElement("span");
    tooltip.className = "source-tooltip";
    tooltip.id = `source-tooltip-${Date.now()}-${Math.floor(
      Math.random() * 10000
    )}`;
    tooltip.setAttribute("role", "tooltip");
    // support multi-line list
    tooltip.innerHTML = sourceText
      .split(/\s*\/\s*/)
      .map((s) => `<div>${s}</div>`)
      .join("");

    btn.setAttribute("aria-describedby", tooltip.id);
    btn.appendChild(label);
    btn.appendChild(tooltip);

    // Toggle on click (useful for touch devices)
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const isOpen = btn.classList.toggle("open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");

      // close other open source buttons
      document.querySelectorAll(".source-btn.open").forEach((b) => {
        if (b !== btn) {
          b.classList.remove("open");
          b.setAttribute("aria-expanded", "false");
        }
      });
    });

    li.appendChild(btn);
    return li;
  }

  // Helper: get a nice short domain label from a url
  function domainLabel(url, maxLen = 18) {
    try {
      const u = new URL(url);
      let host = (u.hostname || "").replace(/^www\./, "");
      if (host.length > maxLen) host = host.slice(0, maxLen - 3) + "...";
      return host || "website";
    } catch (e) {
      return "website";
    }
  }

  // Helper: is it a "web-like" source?
  function isWebishSourceName(name) {
    const s = String(name || "")
      .toLowerCase()
      .trim();
    return s === "web" || s === "wikipedia";
  }

  // ✅ New Sources UI (folder button + popover list)
  function updateSourcesDisplay(container, sources) {
    if (!container) return;

    // Remove old sources UI if exists (avoid duplicates)
    const old = container.querySelector(".sources-wrap");
    if (old) old.remove();

    if (!sources || !sources.length) return;

    // Wrap
    const wrap = document.createElement("div");
    wrap.className = "sources-wrap";

    // Button
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sources-btn";
    btn.innerHTML = `📁 <span>Sources</span> <span class="sources-count">${sources.length}</span>`;

    // Popover
    const pop = document.createElement("div");
    pop.className = "sources-pop hidden";
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-label", "Sources");

    const title = document.createElement("div");
    title.className = "sources-pop-title";
    title.textContent = "Sources";
    pop.appendChild(title);

    const list = document.createElement("ul");
    list.className = "sources-pop-list";

    // Build items
    sources.forEach((s) => {
      const li = document.createElement("li");
      li.className = "sources-pop-item";

      const srcName = s && s.source ? String(s.source) : "";
      const url = s && s.url ? String(s.url) : "";

      // If URL exists -> show clickable domain badge
      if (url) {
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "url-badge website-badge";
        a.title = url;
        a.innerHTML = `<span>${domainLabel(url, 18)}</span>`;
        li.appendChild(a);
      } else {
        // Local source -> show file-ish chip
        const chip = document.createElement("span");
        chip.className = "source-chip";
        chip.title = srcName;
        chip.textContent = formatSourceName(srcName);
        li.appendChild(chip);
      }

      list.appendChild(li);
    });

    pop.appendChild(list);

    // Add to DOM
    wrap.appendChild(btn);
    wrap.appendChild(pop);
    container.appendChild(wrap);

    // Open/close helpers
    let closeTimer = null;
    let pinnedOpen = false;

    const open = () => {
      if (closeTimer) clearTimeout(closeTimer);
      pop.classList.remove("hidden");
    };

    const close = () => {
      if (closeTimer) clearTimeout(closeTimer);
      pop.classList.add("hidden");
      pinnedOpen = false;
    };

    const scheduleClose = () => {
      if (pinnedOpen) return; // don't auto-close if pinned
      if (closeTimer) clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        pop.classList.add("hidden");
      }, 220);
    };

    // ✅ Hover behavior: open on hover, close with delay (so user can move into popover)
    wrap.addEventListener("mouseenter", () => open());
    wrap.addEventListener("mouseleave", () => scheduleClose());

    // ✅ Keep open while hovering popover itself
    pop.addEventListener("mouseenter", () => open());
    pop.addEventListener("mouseleave", () => scheduleClose());

    // ✅ Click button toggles + "pin open"
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isHidden = pop.classList.contains("hidden");
      pinnedOpen = isHidden; // if opening via click, pin it
      if (isHidden) open();
      else close();
    });

    // ✅ Clicking inside the popover should NOT close it
    pop.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // ✅ Click outside closes
    document.addEventListener(
      "click",
      (e) => {
        if (!wrap.contains(e.target)) close();
      },
      { passive: true }
    );

    // ✅ Esc closes
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  window.testContext = function () {
    console.log("Current context:", lastDetectedSubject);
    return lastDetectedSubject;
  };

  // Format plain-text answers into structured HTML elements
  function formatAnswer(answerText) {
    const wrapper = document.createElement("div");
    wrapper.className = "answer-body";

      const lines = String(answerText).split(/\r?\n/);
      let currentList = null;
      let currentListType = null;
      let isInImageSection = false;

      function appendImagePreview(container, imageUrl) {
        if (!container || !imageUrl) return;
        const imgLink = document.createElement("a");
        imgLink.href = imageUrl;
        imgLink.target = "_blank";
        imgLink.className = "image-preview-link";

        const img = document.createElement("img");
        img.src = imageUrl;
        img.className = "url-image-preview";
        img.onerror = function () {
          this.parentElement.className = "url-badge";
          this.parentElement.innerHTML = "<span>View Image</span>";
        };

        imgLink.appendChild(img);
        container.appendChild(imgLink);
      }

      function closeList() {
        if (currentList) {
          wrapper.appendChild(currentList);
          currentList = null;
        currentListType = null;
      }
    }

    let stopAtSources = false;

    for (let raw of lines) {
      const line = raw.trim();
      if (!line) {
        closeList();
        const gap = document.createElement("div");
        gap.className = "answer-gap";
        wrapper.appendChild(gap);
        continue;
      }

      if (/^sources\s*:?\s*$/i.test(line)) {
        stopAtSources = true;
      }
      if (stopAtSources) break;

      // Optional: ignore divider lines like ______
      if (/^_{3,}$/.test(line)) continue;

      if (/image/i.test(line) && (line.endsWith(":") || line.length < 30)) {
        closeList();
        isInImageSection = true;
        const title = document.createElement("div");
        title.className = "answer-title";
        title.textContent = line.replace(/:$/, "");
        wrapper.appendChild(title);

        const imageContainer = document.createElement("div");
        imageContainer.className = "image-gallery";
        wrapper.appendChild(imageContainer);
        continue;
      }

      if (/.:$/.test(line)) {
        closeList();
        isInImageSection = false;
        const title = document.createElement("div");
        title.className = "answer-title";
        title.textContent = line.replace(/:$/, "");
        wrapper.appendChild(title);
        continue;
      }

      const isLink = /(https?:\/\/[^\s\)]+)/.test(line);

      if (isInImageSection && (isLink || /^[\u25cf\u2022\-*]\s+/.test(line))) {
        const imageGallery = wrapper.querySelector(
          ".image-gallery:last-of-type"
        );
        if (imageGallery) {
          const cleanLine = line.replace(/^[\u25cf\u2022\-*]\s+/, "").trim();
          let imageUrl = null;
          const markdownMatch = cleanLine.match(/!\[[^\]]*\]\(([^)]+)\)/);
          if (markdownMatch) {
            imageUrl = markdownMatch[1].trim();
          } else {
            const urlMatch = cleanLine.match(/https?:\/\/[^\s\)]+/);
            if (urlMatch) {
              imageUrl = urlMatch[0];
            }
          }

          if (imageUrl) {
            appendImagePreview(imageGallery, imageUrl);
          }
          // CRITICAL: Skip to next line - don't process this URL again
          continue;
        }
      }

      const markdownImageMatch = line.match(/!\[[^\]]*\]\(([^)]+)\)/);
      if (markdownImageMatch) {
        closeList();
        const imageContainer = document.createElement("div");
        imageContainer.className = "image-gallery";
        appendImagePreview(imageContainer, markdownImageMatch[1].trim());
        wrapper.appendChild(imageContainer);
        continue;
      }

      const orderedMatch = line.match(/^(\d{1,2})[.)]\s+(.*)$/);
      if (orderedMatch) {
        if (!currentList || currentListType !== "ol") {
          closeList();
          currentList = document.createElement("ol");
          currentList.className = "custom-olist";
          currentListType = "ol";
        }
        const li = document.createElement("li");
        li.value = parseInt(orderedMatch[1], 10);
        const elements = processTextWithCommands(orderedMatch[2], false);
        elements.forEach((el) => li.appendChild(el));
        currentList.appendChild(li);
        continue;
      }

      const m = line.match(/^[\u25cf\u2022\-*]\s+(.*)$/);
      if (m) {
        if (!currentList || currentListType !== "ul") {
          closeList();
          currentList = document.createElement("ul");
          currentList.className = "custom-list";
          currentListType = "ul";
        }
        const li = document.createElement("li");
        const elements = processTextWithCommands(m[1], false);
        elements.forEach((el) => li.appendChild(el));
        currentList.appendChild(li);
      } else {
        closeList();
        const p = document.createElement("p");
        p.className = "answer-para";
        const elements = processTextWithCommands(line, false);
        elements.forEach((el) => p.appendChild(el));
        wrapper.appendChild(p);
      }
    }

    closeList();
    return wrapper;
  }

  function renderCardList(container, payload) {
    if (!container) return;
    container.innerHTML = "";

    const items = (payload && payload.items) || [];
    const list = document.createElement("div");
    list.className = "card-carousel";
    list.setAttribute("role", "list");
    list.setAttribute(
      "aria-label",
      payload && payload.menu ? `${payload.menu} results` : "Service items"
    );

    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "menu-card";
      empty.innerHTML = `
        <div class="card-body">
          <div class="card-title">No items available</div>
          <div class="card-desc">Try again later or select another menu.</div>
        </div>
      `;
      list.appendChild(empty);
      container.appendChild(list);
      return;
    }

    items.forEach((item) => {
      const card = createCardElement(item);
      if (card) list.appendChild(card);
    });

    container.appendChild(list);
  }

  function createCardElement(item) {
    if (!item) return null;
    const title = (item.title || "").trim();

    const card = document.createElement("div");
    card.className = "menu-card";
    card.setAttribute("role", "listitem");
    card.tabIndex = 0;
    card.dataset.source = item.source || item.id || "";
    card.dataset.title = title;

    const media = document.createElement("div");
    media.className = "card-media";
    if (item.image) {
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = title || "Item image";
      media.innerHTML = "";
      media.appendChild(img);
    } else {
      media.classList.add("empty");
      media.setAttribute("aria-hidden", "true");
    }

    const body = document.createElement("div");
    body.className = "card-body";

    const titleEl = document.createElement("div");
    titleEl.className = "card-title";
    titleEl.textContent = title || "Item";

    const descEl = document.createElement("div");
    descEl.className = "card-desc";
    descEl.textContent = item.short_desc || "Details available.";

    const priceEl = document.createElement("div");
    priceEl.className = "card-price";
    if (item.price) {
      priceEl.textContent = item.price;
    } else {
      priceEl.textContent = "Price: Not listed";
      priceEl.classList.add("empty");
    }

    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    actionBtn.className = "card-action";
    actionBtn.textContent = item.action_button || "More";
    actionBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      requestCardDetails(item);
    });

    card.addEventListener("click", () => requestCardDetails(item));
    card.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        requestCardDetails(item);
      }
    });

    body.appendChild(titleEl);
    body.appendChild(descEl);
    body.appendChild(priceEl);
    body.appendChild(actionBtn);
    card.appendChild(media);
    card.appendChild(body);
    return card;
  }

  function renderActionButtons(container, payload) {
    if (!container) return;
    container.innerHTML = "";

    const wrap = document.createElement("div");
    wrap.className = "action-buttons";
    const actions = (payload && payload.actions) || [];

    actions.forEach((action) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "action-btn";
      btn.textContent = action.label || "Action";
      btn.dataset.action = action.action || action.label || "";
      wrap.appendChild(btn);
    });

    container.appendChild(wrap);
  }

  function requestCardDetails(item) {
    if (submitBtn && submitBtn.dataset.mode === "stop") {
      statusEl.textContent =
        "A request is currently running - click Stop to cancel first.";
      return;
    }

    const title = (item && item.title) || "Details";
    const source = item && (item.source || item.id);
    const queryText = `${UI_CMD_PREFIX} Tell me about ${title}`;
    handleSendMessage(queryText, {
      displayUserMessage: true,
      displayText: stripUiCmdPrefix(queryText),
    });
  }

  function setupServiceMenu() {
    const buttons = document.querySelectorAll(".menu-chip");
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const label = (btn.dataset.menu || btn.textContent || "").trim();
        if (!label) return;

        if (submitBtn && submitBtn.dataset.mode === "stop") {
          statusEl.textContent =
            "A request is currently running - click Stop to cancel first.";
          return;
        }

        if (heroForm) heroForm.classList.add("hidden");
        if (form) form.classList.remove("hidden");
        document.body.classList.remove("hero-centered");

        const normalized = label.toLowerCase();
        const queryText =
          normalized === "talk to agent"
            ? `${UI_CMD_PREFIX} Talk to Agent`
            : `${UI_CMD_PREFIX} Want to know ${label}`;
        handleSendMessage(queryText, {
          displayUserMessage: true,
          displayText: stripUiCmdPrefix(queryText),
        });
      });
    });
  }

  function processTextWithCommands(text, forceImage = false) {
    function extractDomainName(url, maxLength = 20) {
      try {
        const urlObj = new URL(url);
        let domain = urlObj.hostname.replace(/^www\./, "");
        if (domain.length > maxLength) {
          domain = domain.substring(0, maxLength - 3) + "...";
        }
        return domain;
      } catch (e) {
        const match = url.match(/^https?:\/\/(?:www\.)?([^\/\?#]+)/i);
        if (match) {
          let domain = match[1];
          if (domain.length > maxLength) {
            domain = domain.substring(0, maxLength - 3) + "...";
          }
          return domain;
        }
        return "website";
      }
    }

    const combinedRegex =
      /(!\[([^\]]*)\]\(([^)]+)\))|(\[([^\]]+)\]\(([^)]+)\))|(https?:\/\/[^\s\)]+)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: text.substring(lastIndex, match.index),
        });
      }

      if (match[1]) {
        const rawUrl = match[3];
        parts.push({
          type: "image",
          content: rawUrl,
        });
      } else if (match[4]) {
        parts.push({
          type: "markdown-link",
          label: match[5],
          target: match[6],
        });
      } else if (match[7]) {
        const rawUrl = match[7];
        let urlType = "website";
        if (forceImage || /\.(jpg|jpeg|png|webp|gif)/i.test(rawUrl)) {
          urlType = "image";
        } else if (
          /maps\.google|google\.com\/maps|goo\.gl\/maps/i.test(rawUrl) ||
          (/map/i.test(rawUrl) && /example\.com/i.test(rawUrl))
        ) {
          urlType = "map";
        }

        parts.push({
          type: urlType,
          content: rawUrl,
        });
      }
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ type: "text", content: text.substring(lastIndex) });
    }

    if (parts.length === 0) return [document.createTextNode(text)];

    return parts.map((part) => {
      if (part.type === "text") return document.createTextNode(part.content);

      if (part.type === "markdown-link") {
        const label = (part.label || "").trim();
        const target = (part.target || "").trim();
        if (!label || !target) {
          return document.createTextNode(label || target || "");
        }

        const isExternal = /^https?:\/\//i.test(target);
        const isContact = /^(tel:|mailto:)/i.test(target);
        if (isExternal || isContact) {
          const link = document.createElement("a");
          link.href = target;
          if (isExternal) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
          }
          link.className = "cmd-btn";
          link.textContent = label;
          return link;
        }

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cmd-btn";
        btn.textContent = label;
        btn.addEventListener("click", () => {
          if (submitBtn && submitBtn.dataset.mode === "stop") {
            statusEl.textContent =
              "A request is currently running - click Stop to cancel first.";
            return;
          }
          if (isSecureUiCommand(target)) {
            handleSendMessage(target, {
              displayUserMessage: true,
              displayText: stripUiCmdPrefix(target),
            });
          } else {
            handleSendMessage(target);
          }
        });
        return btn;
      }

      if (part.type === "image") {
        const imgLink = document.createElement("a");
        imgLink.href = part.content;
        imgLink.target = "_blank";
        imgLink.className = "image-preview-link";

        const img = document.createElement("img");
        img.src = part.content;
        img.className = "url-image-preview";
        img.onerror = function () {
          this.parentElement.className = "url-badge";
          this.parentElement.innerHTML = "<span>View Image</span>";
        };

        imgLink.appendChild(img);
        return imgLink;
      } else if (part.type === "map") {
        const badge = document.createElement("a");
        badge.href = part.content;
        badge.target = "_blank";
        badge.className = "url-badge map-badge";
        badge.innerHTML = "<span>Location</span>";
        return badge;
      } else {
        const badge = document.createElement("a");
        badge.href = part.content;
        badge.target = "_blank";
        badge.className = "url-badge website-badge";
        badge.title = part.content;

        const displayName = extractDomainName(part.content, 12);
        badge.innerHTML = `<span>${displayName}</span>`;
        return badge;
      }
    });
  }

  const elements = {
    form,
    queryEl,
    nResultsEl,
    apiUrlEl,
    submitBtn,
    statusEl,
    resultSection,
    answerEl,
    sourcesEl,
  };
  let missing = Object.entries(elements)
    .filter(([_, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    if (missing.includes("apiUrlEl")) {
      apiUrlEl = null;
      console.info("apiUrl input not present — using default /chat/stream");
    }
    if (missing.includes("nResultsEl")) {
      nResultsEl = null;
      console.info("nResults input not present — using default 15");
    }

    const critical = missing.filter(
      (m) => !["apiUrlEl", "nResultsEl"].includes(m)
    );
    if (critical.length) {
      console.error(
        `Frontend missing required UI elements: ${critical.join(", ")}`,
        elements
      );
      try {
        const banner = document.createElement("div");
        banner.style.cssText =
          "position:fixed;top:12px;left:50%;transform:translateX(-50%);background:#ffdede;border:1px solid #ff6b6b;color:#541212;padding:8px 12px;border-radius:6px;z-index:9999;font-weight:600;";
        banner.textContent = `Frontend error: missing UI elements: ${critical.join(
          ", "
        )}`;
        document.body.appendChild(banner);
      } catch (e) {
        try {
          alert(`Frontend error: missing UI elements: ${critical.join(", ")}`);
        } catch (__) {}
      }
      return;
    }
  }

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    // Prevent submitting a new query while one is running
    if (submitBtn && submitBtn.dataset.mode === "stop") {
      statusEl.textContent =
        "A request is currently running — click Stop to cancel first.";
      return;
    }

    const query = (queryEl.value || "").trim();
    if (!query) {
      statusEl.textContent = "Please type a question.";
      return;
    }

    await handleSendMessage(query);
  });

  if (queryEl) {
    queryEl.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        form.dispatchEvent(new Event("submit"));
      }
    });
  }

  requestAnimationFrame(() => {
    const MIN_VISIBLE = 220;
    setTimeout(() => {
      document.body.classList.remove("no-anim");
      document.body.classList.remove("initializing");
      const loader = document.getElementById("initLoader");
      if (loader) loader.setAttribute("aria-hidden", "true");
    }, MIN_VISIBLE);
  });

  setupServiceMenu();
  restoreChatHistory();

  // --- Onboarding modal: "Siem Reap AI mini" ---
  (function initializeSrAIModal() {
    const srModal = document.getElementById("srAIModal");
    const srCloseBtn = document.getElementById("srAIModalClose");
    const srDontShow = document.getElementById("srAIModalDontShow");

    function showSrModal() {
      if (!srModal) return;
      srModal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      setTimeout(() => srCloseBtn && srCloseBtn.focus(), 50);
    }

    function closeSrModal() {
      if (!srModal) return;
      srModal.classList.add("hidden");
      document.body.style.overflow = "";
      if (srDontShow && srDontShow.checked) {
        try {
          localStorage.setItem("sr_ai_mini_dont_show", "true");
        } catch (e) {}
      }
    }

    try {
      const optedOut = localStorage.getItem("sr_ai_mini_dont_show") === "true";
      if (!optedOut) showSrModal();
    } catch (e) {
      /* ignore storage errors */
    }

    if (srCloseBtn) srCloseBtn.addEventListener("click", closeSrModal);
    const srCloseX = document.getElementById("srAIModalCloseX");
    if (srCloseX) srCloseX.addEventListener("click", closeSrModal);

    if (srModal) {
      srModal.addEventListener("click", (ev) => {
        // close when backdrop is clicked
        if (ev.target === srModal.querySelector(".sr-modal-backdrop")) {
          closeSrModal();
        }
      });
    }

    // close on Escape
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        if (srModal && !srModal.classList.contains("hidden")) {
          closeSrModal();
        }
        // close any open source tooltips
        document.querySelectorAll(".source-btn.open").forEach((b) => {
          b.classList.remove("open");
          b.setAttribute("aria-expanded", "false");
        });
      }
    });

    // close open source tooltips when clicking outside
    document.addEventListener("click", (ev) => {
      // if click inside a source button, do nothing (handlers on buttons take care of toggle)
      if (ev.target.closest && ev.target.closest(".source-btn")) return;
      document.querySelectorAll(".source-btn.open").forEach((b) => {
        b.classList.remove("open");
        b.setAttribute("aria-expanded", "false");
      });
    });

    // allow reopening from console for debugging: window.showSrAiMini()
    window.showSrAiMini = showSrModal;
  })();

  window.clearChatHistory = clearChatHistory;
});
