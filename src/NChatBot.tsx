import React, { useState, useRef, useEffect } from 'react';
import './NChatBot.css';

export interface NNChatBotMessage {
  id: string;
  from: 'user' | 'bot' | 'system';
  text: string;
  /** Optional display name for the sender */
  name?: string;
  /** ISO timestamp string */
  timestamp?: string;
  /** Controls whether the timestamp is shown immediately; useful for streaming placeholders */
  showTimestamp?: boolean;
  /** Optional sources returned by the backend (e.g. ['web', 'doc1.txt']) */
  sources?: string[];
  /** Optional structured UI payload (cards/menu) */
  ui?: any;
}

export interface NNChatBotProps {
  /** The API endpoint to call when a user submits a message (required) */
  apiEndpoint: string;
  /** Optional headers to include in fetch requests */
  headers?: Record<string, string>;
  /** Optional API key; if provided it will be sent as Bearer token in Authorization header */
  apiKey?: string;
  /** Placeholder text for the input box */
  placeholder?: string;
  /** Optional title shown at the top of the chat */
  title?: string;
  /** Optional class name for the root element */
  className?: string;
  /** Inline style for the root */
  style?: React.CSSProperties;
  /**
   * Optional helper to shape the request payload. Useful to send `{ query: text }`
   * to backends that expect that format (like the `app.js` streaming backend).
   */
  preparePayload?: (text: string, history: NNChatBotMessage[]) => any;
  /** If true the component will try to read and render streaming responses */
  streaming?: boolean;
  /** Optional callback that receives each raw stream chunk and an updater to modify bot text */
  onStreamChunk?: (chunk: string, updateBotText: (append: string) => void) => void;
  /** If true the chat container will use width: 100% */
  fullWidth?: boolean;
  /** Optional fixed width (e.g. '480px' or '100%'). Overrides default width when provided */
  width?: string;
  /** Optional URL for the bot avatar image */
  botAvatar?: string;
  /** Optional short label shown in the header pill */
  headerLabel?: string;
  /** Optional headline in the header */
  headerHeadline?: string | null;
  /** Optional subtext in the header */
  headerSubtext?: string | null;
  /** Optional status line in the header */
  headerStatus?: string | null;
  /** Optional agent name shown above bot messages */
  agentName?: string | null;
  /** Optional initial prompt message; set null/empty to omit */
  initialMessage?: string | null;
  /** Optional footer text under the input; set null to hide */
  footerText?: string | null;
  /** Optional footer link for the footer text */
  footerLink?: string;
  /** If true the chat will be positioned fixed at bottom of viewport (sticky footer) */
  stickyFooter?: boolean;
  /** Render a floating action button to open the chat */
  floatButton?: boolean;
  /** Whether the floating chat is open initially */
  initialOpen?: boolean;
  /** Label to show in the floating action button (short) */
  floatLabel?: string;
  /** Header background (CSS color or gradient). */
  headerBg?: string;
  /** Header text color */
  headerTextColor?: string;
  /** Whether the header should have rounded top corners */
  headerRounded?: boolean;
  /** Optional inline style for the header */
  headerStyle?: React.CSSProperties;
}

const NChatBot: React.FC<NNChatBotProps> = ({
  apiEndpoint,
  headers = {},
  apiKey,
  placeholder = 'Compose your message...',
  title = 'Chat',
  className = '',
  style,
  preparePayload,
  streaming = false,
  onStreamChunk,
  fullWidth = false,
  width,
  botAvatar,
  headerLabel,
  headerHeadline,
  headerSubtext,
  headerStatus,
  agentName,
  initialMessage,
  footerText,
  footerLink,
  stickyFooter = false,
  floatButton = false,
  initialOpen = false,
  floatLabel = 'Chat',
  headerBg = 'linear-gradient(180deg, #f47b20 0%, #e56c12 100%)',
  headerTextColor = '#ffffff',
  headerRounded = true,
  headerStyle,
}) => {
  const resolvedHeaderLabel = headerLabel ?? title;
  const resolvedHeaderHeadline = headerHeadline === null ? '' : headerHeadline ?? 'Questions? Chat with us!';
  const resolvedHeaderSubtext = headerSubtext === null ? '' : headerSubtext ?? '';
  const resolvedHeaderStatus = headerStatus === null ? '' : headerStatus ?? 'Typically replies within minutes';
  const resolvedAgentName = agentName === null ? '' : agentName ?? 'Support';
  const resolvedFooterText = footerText === null ? '' : footerText ?? 'We run on crisp like a AI Mini';
  const resolvedInitialMessage = initialMessage === null ? '' : initialMessage ?? 'How can we help you today?';

  const [messages, setMessages] = useState<NNChatBotMessage[]>(() => {
    if (!resolvedInitialMessage) return [];
    return [
      {
        id: 's-1',
        from: 'system',
        text: resolvedInitialMessage,
        timestamp: new Date().toISOString(),
        showTimestamp: false,
        name: resolvedAgentName || undefined,
      },
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // scroll to bottom when messages change
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Simple formatter that mirrors the `app.js` output formatting (headings, paragraphs, lists, images, links)
  const formatMessageContent = (text?: string) => {
    if (!text) return null;
    const nodes: React.ReactNode[] = [];
    const lines = String(text).split(/\r?\n/);

    let listBuffer: string[] | null = null;
    let olistBuffer: string[] | null = null;

    const flushList = () => {
      if (listBuffer && listBuffer.length) {
        nodes.push(
          <ul key={`ul-${nodes.length}`} className="custom-list">
            {listBuffer.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        );
        listBuffer = null;
      }
      if (olistBuffer && olistBuffer.length) {
        nodes.push(
          <ol key={`ol-${nodes.length}`} className="custom-olist">
            {olistBuffer.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ol>
        );
        olistBuffer = null;
      }
    };

    for (const raw of lines) {
      const line = raw.trim();
      if (line === '') {
        flushList();
        nodes.push(<div key={`p-${nodes.length}`} className="answer-para">&nbsp;</div>);
        continue;
      }

      // Heading
      if (/^#\s+/.test(line)) {
        flushList();
        nodes.push(
          <div key={`h-${nodes.length}`} className="answer-title">
            {line.replace(/^#\s+/, '')}
          </div>
        );
        continue;
      }

      // Ordered list item
      if (/^\d+\.\s+/.test(line)) {
        if (!olistBuffer) olistBuffer = [];
        olistBuffer.push(line.replace(/^\d+\.\s+/, ''));
        continue;
      }

      // Unordered list item
      if (/^[-\*]\s+/.test(line)) {
        if (!listBuffer) listBuffer = [];
        listBuffer.push(line.replace(/^[-\*]\s+/, ''));
        continue;
      }

      // Image markdown ![alt](url)
      const imgMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (imgMatch) {
        flushList();
        nodes.push(
          <div key={`img-${nodes.length}`} className="image-gallery">
            <a className="image-preview-link" href={imgMatch[2]} target="_blank" rel="noreferrer noopener">
              <img className="url-image-preview" src={imgMatch[2]} alt={imgMatch[1] || 'image'} />
            </a>
          </div>
        );
        continue;
      }

      // Link-only line [text](url) or bare URL
      const linkMatch = line.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        flushList();
        nodes.push(
          <div key={`link-${nodes.length}`} className="answer-para">
            <a href={linkMatch[2]} target="_blank" rel="noreferrer noopener" className="url-badge website-badge">
              {linkMatch[1]}
            </a>
          </div>
        );
        continue;
      }

      const urlMatch = line.match(/^(https?:\/\/[^\s]+)$/);
      if (urlMatch) {
        flushList();
        nodes.push(
          <div key={`url-${nodes.length}`} className="answer-para">
            <a href={urlMatch[1]} target="_blank" rel="noreferrer noopener" className="url-badge website-badge">
              {domainLabel(urlMatch[1]) || urlMatch[1]}
            </a>
          </div>
        );
        continue;
      }

      // Normal paragraph line
      flushList();
      nodes.push(
        <div key={`p-${nodes.length}`} className="answer-para">
          {line}
        </div>
      );
    }

    flushList();
    return <div className="answer">{nodes}</div>;
  };

  const formatTime = (iso?: string) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: NNChatBotMessage = {
      id: `u-${Date.now()}`,
      from: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    // Build a consistent history payload including the new user message
    const historyForPayload = [...messages, userMsg].map((m) => ({ from: m.from, text: m.text }));

    // Update UI immediately
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const reqHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream, text/plain',
        ...headers,
      };
      if (apiKey) {
        reqHeaders['Authorization'] = `Bearer ${apiKey}`;
      }

      // Allow consumer to prepare a payload (e.g. { query }) or fall back to { message, history }
      const payload = preparePayload ? preparePayload(text, [...messages, userMsg]) : { message: text, history: historyForPayload };

      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: reqHeaders,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`API error: ${res.status} ${txt}`);
      }

      // Decide if we should treat the response as a stream. Auto-true for endpoints containing '/stream' or when `streaming` prop is set.
      const contentType = res.headers.get('content-type') || '';
      const hasReadable = !!res.body && typeof (res.body as any).getReader === 'function';
      const shouldStream = streaming || apiEndpoint.includes('/stream') || hasReadable && (contentType.includes('text/event-stream') || contentType.includes('text/plain'));

      if (shouldStream && hasReadable) {
        // Add a placeholder bot message we will update progressively (hide timestamp until complete)
        const botId = `b-${Date.now()}`;
        setMessages((m) => [...m, { id: botId, from: 'bot', text: '', timestamp: new Date().toISOString(), showTimestamp: false, sources: [], ui: null }]);

        const reader = (res.body as ReadableStream<Uint8Array>).getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        // Default SSE/OpenAI-like chunk processor
        const defaultProcessChunk = (rawChunk: string, appendFn: (s: string) => void, setMeta: (meta: Partial<NNChatBotMessage>) => void) => {
          // Split by newlines and treat each line as a potential 'data: ...' payload
          const lines = rawChunk.split(/\r?\n/);
          for (let line of lines) {
            if (!line) continue;
            // Remove 'data:' prefixes often used by SSE
            line = line.replace(/^\s*data:\s*/i, '').trim();
            if (!line) continue;

            // Special 'DONE' markers
            if (line === '[DONE]' || line.toLowerCase() === 'done') continue;

            // Try parse JSON payloads first
            try {
              const parsed = JSON.parse(line);

              // ignore explicit done signals
              if (parsed && parsed.type && String(parsed.type).toLowerCase() === 'done') continue;

              // Handle common streaming shapes
              if (typeof parsed === 'string') {
                appendFn(parsed);
                continue;
              }

              // OpenAI-like: { choices: [{ delta: { content: '...' } }] }
              if (parsed.choices && Array.isArray(parsed.choices)) {
                for (const c of parsed.choices) {
                  if (c && c.delta && (c.delta.content || c.delta.text)) {
                    appendFn(c.delta.content || c.delta.text);
                  } else if (c && c.text) {
                    appendFn(c.text);
                  }
                }
                continue;
              }

              // Common single-object shapes (support 'data' used by SSE / Streamlit-like backends)
              let txt = parsed.reply || parsed.message || parsed.text || parsed.content || parsed.delta || parsed.chunk || null;

              // Some servers use `data` to carry text (and sometimes it's nested)
              if (!txt && parsed.data) {
                if (typeof parsed.data === 'string') txt = parsed.data;
                else if (parsed.data.content) txt = parsed.data.content;
                else if (parsed.data.text) txt = parsed.data.text;
              }

              if (txt) {
                appendFn(String(txt));
              }

              if (parsed.sources && Array.isArray(parsed.sources)) {
                setMeta({ sources: parsed.sources });
              }
              if (parsed.ui) {
                setMeta({ ui: parsed.ui });
              }

              continue;
            } catch (e) {
              // Not JSON - append raw line
              appendFn(line);
            }
          }
        };

        while (true) {
          // Read stream chunks
          const { value, done } = await reader.read();
          if (done) break;
          let chunk = decoder.decode(value, { stream: true });

          // If consumer provided a chunk handler, delegate parsing to them and continue
          if (onStreamChunk) {
            onStreamChunk(chunk, (append) => {
              setMessages((prev) => prev.map((msg) => (msg.id === botId ? { ...msg, text: (msg.text || '') + append } : msg)));
            });
            continue;
          }

          // Default handler: process lines, parse JSON, respect [DONE], and update text/meta
          defaultProcessChunk(chunk, (append) => {
            setMessages((prev) => prev.map((msg) => (msg.id === botId ? { ...msg, text: (msg.text || '') + append } : msg)));
          }, (meta) => {
            setMessages((prev) => prev.map((msg) => (msg.id === botId ? { ...msg, ...meta } : msg)));
          });
        }

        // After stream finishes, try to parse any remaining buffer as JSON, or append leftover
        if (buffer.trim()) {
          try {
            const parsed = JSON.parse(buffer);
            if (parsed) {
              if (parsed.reply || parsed.message || parsed.text) {
                const txt = parsed.reply || parsed.message || parsed.text;
                setMessages((prev) => prev.map((msg) => (msg.id === botId ? { ...msg, text: (msg.text || '') + String(txt) } : msg)));
              }
              if (parsed.sources && Array.isArray(parsed.sources)) {
                setMessages((prev) => prev.map((msg) => (msg.id === botId ? { ...msg, sources: parsed.sources } : msg)));
              }
              if (parsed.ui) {
                setMessages((prev) => prev.map((msg) => (msg.id === botId ? { ...msg, ui: parsed.ui } : msg)));
              }
            }
          } catch (e) {
            // Not JSON - append as plain text
            setMessages((prev) => prev.map((msg) => (msg.id === botId ? { ...msg, text: (msg.text || '') + buffer } : msg)));
          }
        }

        // Mark placeholder as complete and show timestamp now that stream finished
        setMessages((prev) => prev.map((msg) => (msg.id === botId ? { ...msg, showTimestamp: true, timestamp: new Date().toISOString() } : msg)));
      } else {
        // Non-streaming response: parse JSON as before
        const data = await res.json();
        const botText =
          (data && (data.reply || data.message || (typeof data === 'string' ? data : undefined))) ||
          'Sorry, I could not understand the response.';

        const botMsg: NNChatBotMessage = {
          id: `b-${Date.now()}`,
          from: 'bot',
          text: botText,
          timestamp: new Date().toISOString(),
          showTimestamp: true,
        };

        setMessages((m) => [...m, botMsg]);
      }
    } catch (err: any) {
      setError(err?.message || 'An unknown error occurred');
      const botMsg: NNChatBotMessage = {
        id: `b-${Date.now()}`,
        from: 'bot',
        text: 'Sorry, something went wrong while contacting the API.',
        timestamp: new Date().toISOString(),
        showTimestamp: true,
      };
      setMessages((m) => [...m, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!loading) sendMessage(input);
    }
  };

  // Merge width/style preferences: fullWidth > width prop > provided style.width
  const computedWidth = fullWidth ? '100%' : width ?? (style && (style as any).width) ?? undefined;
  const rootStyle = { ...(style || {}), ...(computedWidth ? { width: computedWidth } : {}) } as React.CSSProperties;

  // Floating behavior
  const [open, setOpen] = useState<boolean>(initialOpen);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const fabRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // focus input when panel opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);



  // Add stickyFooter or floating class when requested
  const rootClass = `nchatbot ${fullWidth ? 'fullwidth' : ''} ${stickyFooter ? 'sticky-footer' : ''} ${floatButton ? 'floating' : ''} ${open ? 'open' : 'closed'} ${className}`;
  const headerClass = `nchatbot-header ${headerRounded ? 'rounded-top' : ''}`;
  const headerInlineStyle = {
    ...(headerStyle || {}),
    ...(headerBg ? { ['--nchatbot-header-bg' as any]: headerBg } : {}),
    ...(headerTextColor ? { ['--nchatbot-header-color' as any]: headerTextColor } : {}),
  } as React.CSSProperties;
  const avatarInitials = getInitials(resolvedAgentName || title || 'Bot');

  return (
    <>
      {/* floating action button */}
      {floatButton && (
        <button
          ref={fabRef}
          type="button"
          className="nchatbot-fab"
          aria-expanded={open}
          aria-controls="nchatbot-panel"
          aria-label={open ? 'Close chat' : `Open ${floatLabel}`}
          title={floatLabel}
          onClick={() => setOpen((s) => !s)}
        >
          {open ? <CloseIcon /> : <ChatBubbleIcon />}
        </button>
      )}

      {/* backdrop when open (non-clickable; FAB is the only toggle) */}
      {floatButton && open && <div className="nchatbot-backdrop" aria-hidden="true" />}

      <div id="nchatbot-panel" ref={panelRef} className={rootClass} style={rootStyle} aria-hidden={floatButton ? !open : undefined}>
        <div className={headerClass} style={headerInlineStyle}>
          <div className="nchatbot-header-top">
            <div className="nchatbot-header-pill">
              <span className="nchatbot-header-dot" />
              <span>{resolvedHeaderLabel}</span>
            </div>
          </div>
          <div className="nchatbot-header-hero">
            {/* <div className="nchatbot-avatar-stack" aria-hidden="true">
              <div className="nchatbot-avatar-stack-item">
                {botAvatar ? <img src={botAvatar} alt="" /> : <span className="avatar-initials">{avatarInitials}</span>}
              </div>
              <div className="nchatbot-avatar-stack-item is-center">
                <UserIcon />
              </div>
              <div className="nchatbot-avatar-stack-item">
                {botAvatar ? <img src={botAvatar} alt="" /> : <span className="avatar-initials">{avatarInitials}</span>}
              </div>
            </div> */}
            <div className="nchatbot-header-copy">
              {resolvedHeaderHeadline && <div className="nchatbot-header-headline">{resolvedHeaderHeadline}</div>}
              {resolvedHeaderSubtext && <div className="nchatbot-header-subtext">{resolvedHeaderSubtext}</div>}
              {resolvedHeaderStatus && <div className="nchatbot-header-status">{resolvedHeaderStatus}</div>}
            </div>
          </div>
        </div>

      <div className="nchatbot-messages messages" ref={containerRef} data-testid="message-container">
        {messages.map((m, index) => {
          const isUser = m.from === 'user';
          const isSystem = m.from === 'system';
          const showAgentMeta = !isUser && (index === 0 || messages[index - 1].from === 'user');
          const displayName = m.name || resolvedAgentName;

          return (
            <div key={m.id} className={`msg ${isUser ? 'user' : 'ai'} ${isSystem ? 'system' : ''}`}>
              {!isUser && (
                <div className={`avatar ${showAgentMeta ? '' : 'is-hidden'}`} aria-hidden={!showAgentMeta}>
                  {botAvatar ? (
                    <img src={botAvatar} alt={displayName ? `${displayName} avatar` : 'bot avatar'} />
                  ) : (
                    <div className="avatar-initials">{avatarInitials}</div>
                  )}
                </div>
              )}

              <div className="bubble-wrap">
                {displayName && showAgentMeta && <div className="msg-sender">{displayName}</div>}
                <div className="msg-text">
                  {m.text ? (
                    formatMessageContent(m.text)
                  ) : (
                    /* when placeholder text is empty, show small thinking indicator */
                    <div className="thinking-small" aria-hidden />
                  )}

                  {/* timestamp inside bubble (bottom-right) for both bot and user; only show when allowed */}
                  {m.timestamp && m.showTimestamp !== false && (
                    <div className="meta in-bubble">{formatTime(m.timestamp)}</div>
                  )}
                </div>

                {m.sources && m.sources.length > 0 && (
                  <ul className="sources">
                    {m.sources.map((s, i) => (
                      <li key={i} className="source-item">
                        <button type="button" className="source-btn" title={String(s)}>
                          <span className="source-btn-label">{String(s)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}

        {loading && !streaming && (
          <div className="msg ai thinking-wrap" aria-live="polite" aria-busy="true">
            <div className="avatar" aria-hidden>
              {botAvatar ? <img src={botAvatar} alt="" /> : <div className="avatar-initials">{avatarInitials}</div>}
            </div>
            <div className="bubble-wrap">
              <div className="msg-text thinking-bubble">
                <span className="thinking-text">Thinking</span>
                <span className="thinking-dots" aria-hidden></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="nchatbot-input-area">
        <div className="nchatbot-input-row">
          <div className="nchatbot-input-icons" aria-hidden="true">
            <span className="nchatbot-icon">
              <SmileIcon />
            </span>
            <span className="nchatbot-icon">
              <PlusIcon />
            </span>
          </div>
          <input
            ref={inputRef}
            className="nchatbot-input"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={loading}
          />
          <button
            type="button"
            className="nchatbot-send"
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
        {resolvedFooterText && (
          <div className="nchatbot-footer">
            {footerLink ? (
              <a href={footerLink} target="_blank" rel="noreferrer noopener">
                {resolvedFooterText}
              </a>
            ) : (
              <span>{resolvedFooterText}</span>
            )}
          </div>
        )}
      </div>

      {error && <div className="nchatbot-error">{error}</div>}
    </div>
    </>
  );
};

// Utility: get a short domain label (e.g. 'example.com') from a URL
function domainLabel(url: string, maxLen = 18): string {
  try {
    const u = new URL(String(url));
    let host = u.hostname.replace(/^www\./i, '');
    if (host.length > maxLen) {
      // try to use last two segments (example.com), otherwise truncate
      const parts = host.split('.').slice(-2).join('.');
      host = parts.length <= maxLen ? parts : host.slice(-maxLen);
    }
    return host;
  } catch {
    return String(url).slice(0, maxLen);
  }
}

const ChatBubbleIcon = () => (
  <svg className="nchatbot-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6 5h12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H11l-4.5 3V17H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M8 10h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M8 13h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg className="nchatbot-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const SmileIcon = () => (
  <svg className="nchatbot-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
    <path d="M8.5 14.5c1 1 2.1 1.5 3.5 1.5s2.5-.5 3.5-1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M9 10.5h.01M15 10.5h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const PlusIcon = () => (
  <svg className="nchatbot-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const SendIcon = () => (
  <svg className="nchatbot-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12l14-7-4 14-3-5-7-2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

const UserIcon = () => (
  <svg className="nchatbot-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4.5 19c1.7-3 4.6-4.6 7.5-4.6s5.8 1.6 7.5 4.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default NChatBot;

function getInitials(name: string): string {
  const trimmed = String(name || '').trim();
  if (!trimmed) return 'B';
  const parts = trimmed.split(/\s+/).slice(0, 2);
  const initials = parts.map((part) => part[0]?.toUpperCase()).join('');
  return initials || 'B';
}

