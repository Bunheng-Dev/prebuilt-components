import React, { useState, useRef, useEffect } from 'react';
import './NChatBot.css';

export interface NNChatBotMessage {
  id: string;
  from: 'user' | 'bot' | 'system';
  text: string;
  /** Optional display-only text shown in the UI */
  displayText?: string;
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

export interface NNChatBotQuickAction {
  id: string;
  label: string;
  /** Optional prompt text appended after the command token */
  prompt?: string;
  /** Optional message to send; overrides command format when provided */
  message?: string;
  /** Optional display-only text shown in the user bubble */
  displayText?: string;
  /** Optional image URL for the quick action */
  image?: string;
  /** Optional command tag override */
  commandTag?: string;
  /** Optional command id override */
  commandId?: string;
  /** Optional action type */
  actionType?: 'message' | 'live_chat';
  /** Optional aria label for the button */
  ariaLabel?: string;
}

type NChatBotUiCard = {
  id?: string | number;
  title?: string;
  name?: string;
  label?: string;
  description?: string;
  desc?: string;
  image?: string;
  imageUrl?: string;
  thumbnail?: string;
  price?: string | number;
  amount?: string | number;
  priceUnit?: string;
  unit?: string;
  ctaLabel?: string;
  actionLabel?: string;
  buttonText?: string;
  ctaUrl?: string;
  url?: string;
  link?: string;
};

type NChatBotStoredMessage = {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  sources?: any;
  ui?: any;
  timestamp?: string;
};

type SourceDisplay = {
  label: string;
  title: string;
  url?: string;
};

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
  /** Key used for the user prompt payload (e.g. "message" or "query") */
  payloadKey?: 'message' | 'query';
  /** Additional payload fields merged into the request body */
  payloadExtras?: Record<string, any>;
  /** If false, do not include history in the payload */
  includeHistory?: boolean;
  /** Optional quick action tiles shown under the greeting */
  quickActions?: NNChatBotQuickAction[];
  /** Optional title shown above quick actions */
  quickActionsTitle?: string;
  /** Command tag used when building quick action messages */
  quickActionCommandTag?: string;
  /** Command id used when building quick action messages */
  quickActionCommandId?: string;
  /** If true, hide quick actions after the first user message */
  hideQuickActionsAfterSend?: boolean;
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
  /** Whether to show the card menu label above the carousel */
  showCardMenuLabel?: boolean;
  /** Enable live chat mode */
  enableLiveChat?: boolean;
  /** Title shown in live chat header */
  liveChatTitle?: string;
  /** Placeholder for live chat input */
  liveChatPlaceholder?: string;
  /** Initial message shown by staff when live chat opens */
  liveChatWelcomeMessage?: string | null;
  /** Agent name shown in live chat */
  liveChatAgentName?: string | null;
  /** Optional phone link for live chat header (e.g. "tel:+123") */
  liveChatPhoneLink?: string;
  /** Live chat endpoint for staff messaging */
  liveChatEndpoint?: string;
  /** Optional headers for live chat requests */
  liveChatHeaders?: Record<string, string>;
  /** Optional API key for live chat requests */
  liveChatApiKey?: string;
  /** Optional helper to shape live chat payloads */
  liveChatPreparePayload?: (text: string, history: NNChatBotMessage[]) => any;
  /** Key used for the live chat payload (e.g. "message" or "query") */
  liveChatPayloadKey?: 'message' | 'query';
  /** Additional fields merged into the live chat request body */
  liveChatPayloadExtras?: Record<string, any>;
  /** If true, include history in live chat payload */
  liveChatIncludeHistory?: boolean;
  /** If true, attempt to read live chat streaming responses */
  liveChatStreaming?: boolean;
  /** Optional callback when user sends a live chat message */
  onLiveChatSend?: (text: string) => void;
}

const defaultQuickActions: NNChatBotQuickAction[] = [
  { id: 'about-siem-reap', label: 'About Siem Reap' },
  { id: 'happening-now', label: 'Happening Now' },
  { id: 'thing-to-do', label: 'Thing To Do' },
  { id: 'private-villa', label: 'Private Villa' },
  { id: 'tour-guide', label: 'Tour Guide' },
  { id: 'talk-to-agent', label: 'Talk To Agent', prompt: 'Talk to Agent', actionType: 'live_chat' },
];

const STORAGE_KEY = 'siem_reap_chat_history';
const CONTEXT_KEY = 'siem_reap_last_context';
const LIST_CONTEXT_KEY = 'siem_reap_last_list_context';

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readFromStorage(key: string): string | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeToStorage(key: string, value: string): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(key, value);
  } catch {
    // ignore storage errors
  }
}

function removeFromStorage(key: string): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch {
    // ignore storage errors
  }
}

function toStoredMessage(message: NNChatBotMessage): NChatBotStoredMessage | null {
  if (!message) return null;
  if (message.from === 'system') return null;
  const role = message.from === 'bot' ? 'ai' : message.from;
  const content = message.from === 'user' ? (message.displayText ?? message.text) : message.text;
  const hasContent = Boolean(content && String(content).trim().length);
  const hasUi = Boolean(message.ui);
  if (!hasContent && !hasUi) return null;

  return {
    id: message.id,
    role,
    content: content || '',
    sources: message.sources ?? null,
    ui: message.ui ?? null,
    timestamp: message.timestamp,
  };
}

function loadChatFromStorage(): NChatBotStoredMessage[] {
  const raw = readFromStorage(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveChatToStorage(messages: NNChatBotMessage[]): void {
  const stored = messages.map(toStoredMessage).filter(Boolean) as NChatBotStoredMessage[];
  if (stored.length === 0) {
    removeFromStorage(STORAGE_KEY);
    return;
  }
  writeToStorage(STORAGE_KEY, JSON.stringify(stored));
}

function mapStoredRole(role?: string): 'user' | 'bot' | 'system' {
  if (role === 'ai') return 'bot';
  if (role === 'system') return 'system';
  return 'user';
}

function fromStoredMessage(message: NChatBotStoredMessage, index: number): NNChatBotMessage | null {
  if (!message || typeof message !== 'object') return null;
  const from = mapStoredRole(message.role);
  const content = typeof message.content === 'string' ? message.content : '';
  if (!content && !message.ui) return null;

  return {
    id: message.id || `restored-${Date.now()}-${index}`,
    from,
    text: content,
    displayText: from === 'user' ? content : undefined,
    timestamp: message.timestamp,
    showTimestamp: from !== 'system',
    sources: Array.isArray(message.sources) ? message.sources : message.sources ? [message.sources] : undefined,
    ui: message.ui ?? undefined,
  };
}

function loadContextFromStorage(): string | null {
  return readFromStorage(CONTEXT_KEY);
}

function saveContextToStorage(context: string | null): void {
  if (context) {
    writeToStorage(CONTEXT_KEY, context);
  } else {
    removeFromStorage(CONTEXT_KEY);
  }
}

function loadListContextFromStorage(): any {
  const raw = readFromStorage(LIST_CONTEXT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveListContextToStorage(context: any): void {
  if (context) {
    writeToStorage(LIST_CONTEXT_KEY, JSON.stringify(context));
  } else {
    removeFromStorage(LIST_CONTEXT_KEY);
  }
}

function withContextPayload(payload: any, lastSubject: string | null, listContext: any): any {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return payload;
  const next = { ...payload };
  if (!Object.prototype.hasOwnProperty.call(next, 'last_subject')) {
    next.last_subject = lastSubject ?? null;
  }
  if (!Object.prototype.hasOwnProperty.call(next, 'list_context')) {
    next.list_context = listContext ?? null;
  }
  return next;
}

function extractContextSourceName(sources: any): string | null {
  if (!sources) return null;
  const list = Array.isArray(sources) ? sources : [sources];
  if (!list.length) return null;
  const first = list[0];
  if (typeof first === 'string') return first;
  if (first && typeof first === 'object') {
    if (typeof first.source === 'string') return first.source;
    if (typeof first.name === 'string') return first.name;
  }
  return null;
}

function isWebishSourceName(name: string): boolean {
  const cleaned = String(name || '').toLowerCase().trim();
  return cleaned === 'web' || cleaned === 'wikipedia';
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
  payloadKey = 'message',
  payloadExtras,
  includeHistory = true,
  quickActions = defaultQuickActions,
  quickActionsTitle,
  quickActionCommandTag = 'UI_CMD',
  quickActionCommandId = 'SR_SECURE_2026',
  hideQuickActionsAfterSend = true,
  stickyFooter = false,
  floatButton = false,
  initialOpen = false,
  floatLabel = 'Chat',
  headerBg = 'linear-gradient(180deg, #f47b20 0%, #e56c12 100%)',
  headerTextColor = '#ffffff',
  headerRounded = true,
  headerStyle,
  showCardMenuLabel = true,
  enableLiveChat = true,
  liveChatTitle = 'Live Chat',
  liveChatPlaceholder = 'Type a message...',
  liveChatWelcomeMessage,
  liveChatAgentName,
  liveChatPhoneLink,
  liveChatEndpoint,
  liveChatHeaders,
  liveChatApiKey,
  liveChatPreparePayload,
  liveChatPayloadKey = payloadKey,
  liveChatPayloadExtras,
  liveChatIncludeHistory = includeHistory,
  liveChatStreaming = false,
  onLiveChatSend,
}) => {
  const resolvedHeaderLabel = headerLabel ?? title;
  const resolvedHeaderHeadline = headerHeadline === null ? '' : headerHeadline ?? 'Questions? Chat with us!';
  const resolvedHeaderSubtext = headerSubtext === null ? '' : headerSubtext ?? '';
  const resolvedHeaderStatus = headerStatus === null ? '' : headerStatus ?? 'Typically replies within minutes';
  const resolvedAgentName = agentName === null ? '' : agentName ?? 'Support';
  const resolvedFooterText = footerText === null ? '' : footerText ?? 'We run on crisp like a AI Mini';
  const resolvedInitialMessage = initialMessage === null ? '' : initialMessage ?? 'How can we help you today?';
  const resolvedLiveChatAgentName = liveChatAgentName === null ? '' : liveChatAgentName ?? resolvedAgentName;
  const resolvedLiveChatWelcome =
    liveChatWelcomeMessage === null ? '' : liveChatWelcomeMessage ?? 'Connecting to our team...';

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
  const [liveChatMessages, setLiveChatMessages] = useState<NNChatBotMessage[]>(() => {
    if (!resolvedLiveChatWelcome) return [];
    return [
      {
        id: 'lc-1',
        from: 'bot',
        text: resolvedLiveChatWelcome,
        timestamp: new Date().toISOString(),
        showTimestamp: true,
        name: resolvedLiveChatAgentName || undefined,
      },
    ];
  });
  const [input, setInput] = useState('');
  const [liveChatInput, setLiveChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveChatLoading, setLiveChatLoading] = useState(false);
  const [liveChatError, setLiveChatError] = useState<string | null>(null);
  const storageReadyRef = useRef(false);
  const lastContextRef = useRef<string | null>(null);
  const listContextRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const liveContainerRef = useRef<HTMLDivElement | null>(null);
  const [liveChatMode, setLiveChatMode] = useState<boolean>(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState<boolean>(
    () => !hideQuickActionsAfterSend || !messages.some((m) => m.from === 'user')
  );

  useEffect(() => {
    const stored = loadChatFromStorage();
    if (stored.length > 0) {
      const restored = stored
        .map((msg, index) => fromStoredMessage(msg, index))
        .filter(Boolean) as NNChatBotMessage[];
      if (restored.length > 0) {
        setMessages(restored);
        if (hideQuickActionsAfterSend) {
          setQuickActionsOpen(!restored.some((m) => m.from === 'user'));
        }
      }
    }
    lastContextRef.current = loadContextFromStorage();
    listContextRef.current = loadListContextFromStorage();
    storageReadyRef.current = true;
  }, []);

  useEffect(() => {
    // scroll to bottom when messages change
    const target = liveChatMode ? liveContainerRef.current : containerRef.current;
    if (target) {
      target.scrollTop = target.scrollHeight;
    }
  }, [messages, liveChatMessages, loading, liveChatLoading, quickActionsOpen, liveChatMode]);

  useEffect(() => {
    if (!storageReadyRef.current) return;
    saveChatToStorage(messages);
    const lastBot = [...messages].reverse().find((m) => m.from === 'bot' && m.sources && m.sources.length);
    if (lastBot) {
      const sourceName = extractContextSourceName(lastBot.sources);
      if (sourceName && !isWebishSourceName(sourceName) && sourceName !== lastContextRef.current) {
        lastContextRef.current = sourceName;
        saveContextToStorage(sourceName);
      }
    }
  }, [messages]);

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

  const resolvedQuickActions = Array.isArray(quickActions) ? quickActions : [];
  const hasUserMessage = messages.some((m) => m.from === 'user');
  const shouldShowQuickActions =
    resolvedQuickActions.length > 0 && (hideQuickActionsAfterSend ? quickActionsOpen : true);

  const buildQuickActionDisplay = (action: NNChatBotQuickAction) => {
    return action.displayText || action.prompt || `Want to know ${action.label}`;
  };

  const buildQuickActionMessage = (action: NNChatBotQuickAction) => {
    if (action.message) return action.message;
    const tag = action.commandTag ?? quickActionCommandTag;
    const id = action.commandId ?? quickActionCommandId;
    const prompt = action.prompt || `Want to know ${action.label}`;
    if (!tag || !id) return prompt;
    return `[${tag}:${id}] ${prompt}`;
  };

  const handleQuickAction = (action: NNChatBotQuickAction) => {
    if (loading) return;
    const isLiveChatAction =
      enableLiveChat &&
      (action.actionType === 'live_chat' ||
        action.id === 'talk-to-agent' ||
        String(action.label).toLowerCase() === 'talk to agent');
    if (isLiveChatAction) {
      setLiveChatMode(true);
      setQuickActionsOpen(false);
      return;
    }
    const fullMessage = buildQuickActionMessage(action);
    const displayText = buildQuickActionDisplay(action);
    sendMessage(fullMessage, { displayText });
  };

  const revealQuickActions = () => {
    if (!resolvedQuickActions.length) return;
    if (liveChatMode) return;
    setQuickActionsOpen(true);
  };

  const closeLiveChat = () => {
    setLiveChatMode(false);
  };

  const sendLiveChatMessage = async () => {
    const trimmed = liveChatInput.trim();
    if (!trimmed || liveChatLoading) return;
    const userMsg: NNChatBotMessage = {
      id: `lc-u-${Date.now()}`,
      from: 'user',
      text: trimmed,
      timestamp: new Date().toISOString(),
      showTimestamp: true,
    };
    const nextMessages = [...liveChatMessages, userMsg];
    const historyForPayload = nextMessages.map((m) => ({ from: m.from, text: m.text }));
    setLiveChatMessages((prev) => [...prev, userMsg]);
    setLiveChatInput('');
    setLiveChatError(null);
    if (onLiveChatSend) onLiveChatSend(trimmed);
    if (!liveChatEndpoint) return;

    try {
      setLiveChatLoading(true);
      const reqHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream, text/plain',
        ...(liveChatHeaders ?? headers),
      };
      if (liveChatApiKey ?? apiKey) {
        reqHeaders['Authorization'] = `Bearer ${liveChatApiKey ?? apiKey}`;
      }

      const payloadBase = { [liveChatPayloadKey]: trimmed };
      const payload = liveChatPreparePayload
        ? liveChatPreparePayload(trimmed, nextMessages)
        : {
            ...payloadBase,
            ...(liveChatIncludeHistory ? { history: historyForPayload } : {}),
            ...(liveChatPayloadExtras || {}),
          };

      const res = await fetch(liveChatEndpoint, {
        method: 'POST',
        headers: reqHeaders,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`API error: ${res.status} ${txt}`);
      }

      const contentType = res.headers.get('content-type') || '';
      const hasReadable = !!res.body && typeof (res.body as any).getReader === 'function';
      const shouldStream =
        liveChatStreaming ||
        liveChatEndpoint.includes('/stream') ||
        (hasReadable && (contentType.includes('text/event-stream') || contentType.includes('text/plain')));

      if (shouldStream && hasReadable) {
        const botId = `lc-b-${Date.now()}`;
        setLiveChatMessages((m) => [
          ...m,
          {
            id: botId,
            from: 'bot',
            text: '',
            timestamp: new Date().toISOString(),
            showTimestamp: false,
            name: resolvedLiveChatAgentName || undefined,
          },
        ]);

        const reader = (res.body as ReadableStream<Uint8Array>).getReader();
        const decoder = new TextDecoder();

        const appendToBot = (append: string) => {
          setLiveChatMessages((prev) =>
            prev.map((msg) => (msg.id === botId ? { ...msg, text: (msg.text || '') + append } : msg))
          );
        };

        const processChunk = (rawChunk: string) => {
          const lines = rawChunk.split(/\r?\n/);
          for (let line of lines) {
            if (!line) continue;
            line = line.replace(/^\s*data:\s*/i, '').trim();
            if (!line) continue;
            if (line === '[DONE]' || line.toLowerCase() === 'done') continue;

            try {
              const parsed = JSON.parse(line);
              if (parsed && parsed.type && String(parsed.type).toLowerCase() === 'done') continue;

              if (typeof parsed === 'string') {
                appendToBot(parsed);
                continue;
              }

              if (parsed.choices && Array.isArray(parsed.choices)) {
                for (const c of parsed.choices) {
                  if (c && c.delta && (c.delta.content || c.delta.text)) {
                    appendToBot(c.delta.content || c.delta.text);
                  } else if (c && c.text) {
                    appendToBot(c.text);
                  }
                }
                continue;
              }

              let txt = parsed.reply || parsed.message || parsed.text || parsed.content || parsed.delta || parsed.chunk || null;
              if (!txt && parsed.data) {
                if (typeof parsed.data === 'string') txt = parsed.data;
                else if (parsed.data.content) txt = parsed.data.content;
                else if (parsed.data.text) txt = parsed.data.text;
              }

              if (txt) appendToBot(String(txt));
            } catch (e) {
              appendToBot(line);
            }
          }
        };

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (!chunk) continue;
          processChunk(chunk);
        }

        setLiveChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === botId ? { ...msg, showTimestamp: true, timestamp: new Date().toISOString() } : msg
          )
        );
      } else {
        const isJson = contentType.includes('application/json');
        let data: any = null;
        let text = '';
        if (isJson) {
          try {
            data = await res.json();
          } catch (e) {
            text = await res.text();
          }
        } else {
          text = await res.text();
        }

        if (data !== null && data !== undefined) {
          if (typeof data === 'string') text = data;
          else {
            text =
              data.reply ||
              data.message ||
              data.text ||
              data.content ||
              (typeof data.data === 'string' ? data.data : '') ||
              '';
          }
        }

        const botMsg: NNChatBotMessage = {
          id: `lc-b-${Date.now()}`,
          from: 'bot',
          text: text || 'Thanks! Our team will be with you shortly.',
          timestamp: new Date().toISOString(),
          showTimestamp: true,
          name: resolvedLiveChatAgentName || undefined,
        };
        setLiveChatMessages((m) => [...m, botMsg]);
      }
    } catch (err: any) {
      setLiveChatError(err?.message || 'An unknown error occurred');
      const botMsg: NNChatBotMessage = {
        id: `lc-b-${Date.now()}`,
        from: 'bot',
        text: 'Sorry, something went wrong while contacting live support.',
        timestamp: new Date().toISOString(),
        showTimestamp: true,
        name: resolvedLiveChatAgentName || undefined,
      };
      setLiveChatMessages((m) => [...m, botMsg]);
    } finally {
      setLiveChatLoading(false);
    }
  };

  const onLiveChatKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!liveChatLoading) sendLiveChatMessage();
    }
  };

  const extractUiCards = (ui: any): NChatBotUiCard[] => {
    if (!ui) return [];
    if (Array.isArray(ui)) return ui as NChatBotUiCard[];
    if (ui.type && typeof ui.type === 'string') {
      const type = ui.type.toLowerCase();
      if (type === 'cards' && ui.data && Array.isArray(ui.data.items)) {
        return ui.data.items as NChatBotUiCard[];
      }
    }
    if (Array.isArray(ui.cards)) return ui.cards as NChatBotUiCard[];
    if (Array.isArray(ui.items)) return ui.items as NChatBotUiCard[];
    if (Array.isArray(ui.data)) return ui.data as NChatBotUiCard[];
    if (ui.data && Array.isArray(ui.data.items)) return ui.data.items as NChatBotUiCard[];
    return [];
  };

  const renderUiCards = (ui: any) => {
    const cards = extractUiCards(ui);
    if (!cards.length) return null;
    const menuLabel = ui?.menu || ui?.data?.menu || '';
    const shouldShowMenuLabel = showCardMenuLabel && menuLabel;

    return (
      <div className="nchatbot-card-wrap">
        {shouldShowMenuLabel && <div className="nchatbot-card-menu">{String(menuLabel)}</div>}
        <div className="nchatbot-card-list" role="list">
          {cards.map((card, index) => {
            const title = card.title || card.name || card.label || '';
            const description = card.description || card.desc || (card as any).short_desc || (card as any).shortDesc || '';
            const image = card.image || card.imageUrl || card.thumbnail || '';
            const price = card.price ?? card.amount;
            const priceUnit = card.priceUnit || card.unit || '';
            const ctaLabel = card.ctaLabel || card.actionLabel || (card as any).action_button || card.buttonText || 'More';
            const ctaUrl = card.ctaUrl || card.url || card.link || '';

            return (
              <div key={card.id ?? `${title}-${index}`} className="nchatbot-card" role="listitem">
                <div className="nchatbot-card-media">
                  {image ? <img src={image} alt={title || 'card'} /> : <div className="nchatbot-card-placeholder" />}
                </div>
                <div className="nchatbot-card-body">
                  {title && <div className="nchatbot-card-title">{title}</div>}
                  {description && <div className="nchatbot-card-desc">{description}</div>}
                  <div className="nchatbot-card-meta">
                    {price !== undefined && price !== null && (
                      <div className="nchatbot-card-price">
                        {String(price)}
                        {priceUnit && typeof price !== 'string' ? <span className="nchatbot-card-unit">/{priceUnit}</span> : null}
                      </div>
                    )}
                    {ctaLabel && (
                      ctaUrl ? (
                        <a className="nchatbot-card-cta" href={ctaUrl} target="_blank" rel="noreferrer noopener">
                          {ctaLabel}
                        </a>
                      ) : (
                        <button type="button" className="nchatbot-card-cta">
                          {ctaLabel}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const sendMessage = async (text: string, options?: { displayText?: string }) => {
    if (!text.trim()) return;
    if (hideQuickActionsAfterSend) {
      setQuickActionsOpen(false);
    }

    const userMsg: NNChatBotMessage = {
      id: `u-${Date.now()}`,
      from: 'user',
      text,
      displayText: options?.displayText ?? text,
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
      const payloadBase = { [payloadKey]: text };
      const payloadRaw = preparePayload
        ? preparePayload(text, [...messages, userMsg])
        : {
            ...payloadBase,
            ...(includeHistory ? { history: historyForPayload } : {}),
            ...(payloadExtras || {}),
          };
      const payload = withContextPayload(payloadRaw, lastContextRef.current, listContextRef.current);

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

              if (parsed.type && typeof parsed.type === 'string') {
                const type = parsed.type.toLowerCase();
                if ((type === 'cards' || type === 'actions') && parsed.data) {
                  setMeta({ ui: parsed });
                }
                if (type === 'sources' && Array.isArray(parsed.data)) {
                  setMeta({ sources: parsed.data });
                }
                if (type === 'list_context') {
                  listContextRef.current = parsed.data || null;
                  saveListContextToStorage(parsed.data || null);
                }
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
        const uiPayload =
          Array.isArray(data)
            ? data
            : data?.ui || (data?.type ? data : undefined) || data?.cards || data?.items;
        const botTextCandidate =
          (data && (data.reply || data.message || data.text || data.content || (typeof data === 'string' ? data : undefined))) ||
          '';
        const botText = botTextCandidate || (uiPayload ? '' : 'Sorry, I could not understand the response.');

        const listContext = (data && (data.list_context ?? data.listContext)) ?? undefined;
        if (listContext !== undefined) {
          listContextRef.current = listContext || null;
          saveListContextToStorage(listContext || null);
        }
        const botMsg: NNChatBotMessage = {
          id: `b-${Date.now()}`,
          from: 'bot',
          text: botText,
          timestamp: new Date().toISOString(),
          showTimestamp: true,
          sources: Array.isArray(data?.sources) ? data.sources : undefined,
          ui: uiPayload,
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
  const rootClass = `nchatbot ${fullWidth ? 'fullwidth' : ''} ${stickyFooter ? 'sticky-footer' : ''} ${floatButton ? 'floating' : ''} ${liveChatMode ? 'live-mode' : ''} ${open ? 'open' : 'closed'} ${className}`;
  const headerClass = `nchatbot-header ${headerRounded ? 'rounded-top' : ''}`;
  const headerInlineStyle = {
    ...(headerStyle || {}),
    ...(headerBg ? { ['--nchatbot-header-bg' as any]: headerBg } : {}),
    ...(headerTextColor ? { ['--nchatbot-header-color' as any]: headerTextColor } : {}),
  } as React.CSSProperties;
  const avatarInitials = getInitials(resolvedAgentName || title || 'Bot');
  const quickActionsNode = shouldShowQuickActions ? (
    <div className="nchatbot-quick-actions">
      {quickActionsTitle && <div className="nchatbot-quick-title">{quickActionsTitle}</div>}
      <div className="nchatbot-quick-grid" role="list">
        {resolvedQuickActions.map((action) => (
          <button
            key={action.id}
            type="button"
            className="nchatbot-quick-card"
            onClick={() => handleQuickAction(action)}
            disabled={loading}
            aria-label={action.ariaLabel || action.label}
          >
            <div className={`nchatbot-quick-thumb ${action.image ? 'has-image' : 'no-image'}`}>
              {action.image ? <img src={action.image} alt="" /> : <span className="nchatbot-quick-placeholder" aria-hidden="true" />}
            </div>
            <span className="nchatbot-quick-label">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  ) : null;
  const showQuickActionsAfterGreeting = !!quickActionsNode && !hasUserMessage;
  const showQuickActionsAtEnd = !!quickActionsNode && hasUserMessage;

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
        {liveChatMode ? (
          <>
            <div className="nchatbot-live-header">
              <button
                type="button"
                className="nchatbot-live-back"
                onClick={closeLiveChat}
                aria-label="Back to chatbot"
                title="Back to chatbot"
              >
                <MinusIcon />
              </button>
              <div className="nchatbot-live-title">{liveChatTitle}</div>
              {liveChatPhoneLink ? (
                <a className="nchatbot-live-phone" href={liveChatPhoneLink} aria-label="Call support">
                  <PhoneIcon />
                </a>
              ) : (
                <button type="button" className="nchatbot-live-phone" disabled aria-hidden="true">
                  <PhoneIcon />
                </button>
              )}
            </div>

            <div className="nchatbot-live-messages" ref={liveContainerRef}>
              {liveChatMessages.map((m, index) => {
                const isUser = m.from === 'user';
                const showAgentMeta = !isUser && (index === 0 || liveChatMessages[index - 1].from === 'user');
                const displayName = m.name || resolvedLiveChatAgentName;
                const messageText = !isUser ? addApologyEmoji(m.text) : m.text;

                return (
                  <div key={m.id} className={`msg ${isUser ? 'user' : 'ai'}`}>
                    {!isUser && (
                      <div className={`avatar ${showAgentMeta ? '' : 'is-hidden'}`} aria-hidden={!showAgentMeta}>
                        {botAvatar ? (
                          <img src={botAvatar} alt={displayName ? `${displayName} avatar` : 'staff avatar'} />
                        ) : (
                          <div className="avatar-initials">{getInitials(displayName || 'Staff')}</div>
                        )}
                      </div>
                    )}

                    <div className="bubble-wrap">
                      {displayName && showAgentMeta && <div className="msg-sender">{displayName}</div>}
                      <div className="msg-text">
                        {formatMessageContent(messageText)}
                        {m.timestamp && (
                          <div className="meta in-bubble">{formatTime(m.timestamp)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {liveChatLoading && !liveChatStreaming && (
                <div className="msg ai thinking-wrap" aria-live="polite" aria-busy="true">
                  <div className="avatar" aria-hidden>
                    {botAvatar ? <img src={botAvatar} alt="" /> : <div className="avatar-initials">{getInitials(resolvedLiveChatAgentName || 'Staff')}</div>}
                  </div>
                  <div className="bubble-wrap">
                    <div className="msg-text thinking-bubble">
                      <span className="thinking-text">Connecting</span>
                      <span className="thinking-dots" aria-hidden></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="nchatbot-input-area">
              <div className="nchatbot-input-row">
                <input
                  className="nchatbot-input"
                  placeholder={liveChatPlaceholder}
                  value={liveChatInput}
                  onChange={(e) => setLiveChatInput(e.target.value)}
                  onKeyDown={onLiveChatKeyDown}
                  disabled={liveChatLoading}
                />
                <button
                  type="button"
                  className="nchatbot-send"
                  onClick={sendLiveChatMessage}
                  disabled={liveChatLoading || !liveChatInput.trim()}
                  aria-label="Send live chat message"
                >
                  <SendIcon />
                </button>
              </div>
            </div>
            {liveChatError && <div className="nchatbot-error">{liveChatError}</div>}
          </>
        ) : (
          <>
            <div className={headerClass} style={headerInlineStyle}>
              <div className="nchatbot-header-top">
                <div className="nchatbot-header-pill">
                  <span className="nchatbot-header-dot" />
                  <span>{resolvedHeaderLabel}</span>
                </div>
              </div>
              <div className="nchatbot-header-hero">
                <div className="nchatbot-header-copy">
                  {resolvedHeaderHeadline && <div className="nchatbot-header-headline">{resolvedHeaderHeadline}</div>}
                  {resolvedHeaderSubtext && <div className="nchatbot-header-subtext">{resolvedHeaderSubtext}</div>}
                  {resolvedHeaderStatus && <div className="nchatbot-header-status">{resolvedHeaderStatus}</div>}
                </div>
              </div>
            </div>

          <div className="nchatbot-messages messages" ref={containerRef} data-testid="message-container">
            {messages.length === 0 && quickActionsNode}
            {messages.map((m, index) => {
              const isUser = m.from === 'user';
              const isSystem = m.from === 'system';
              const showAgentMeta = !isUser && (index === 0 || messages[index - 1].from === 'user');
              const displayName = m.name || resolvedAgentName;
              const rawMessageText = m.displayText ?? m.text;
              const messageText = !isUser ? addApologyEmoji(rawMessageText) : rawMessageText;
              const uiCards = !isUser ? renderUiCards(m.ui) : null;
              const hasUi = !!uiCards;
              const showThinking = !messageText && !hasUi;

              const messageNode = (
                <div className={`msg ${isUser ? 'user' : 'ai'} ${isSystem ? 'system' : ''} ${hasUi ? 'has-ui' : ''}`}>
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
                    {(messageText || showThinking) && (
                      <div className="msg-text">
                        {messageText ? (
                          formatMessageContent(messageText)
                        ) : (
                          /* when placeholder text is empty, show small thinking indicator */
                          <div className="thinking-small" aria-hidden />
                        )}

                        {/* timestamp inside bubble (bottom-right) for both bot and user; only show when allowed */}
                        {m.timestamp && m.showTimestamp !== false && (
                          <div className="meta in-bubble">{formatTime(m.timestamp)}</div>
                        )}
                      </div>
                    )}

                    {(() => {
                      const sourceItems = Array.isArray(m.sources)
                        ? (m.sources.map((s) => toSourceDisplay(s)).filter(Boolean) as SourceDisplay[])
                        : [];
                      if (!sourceItems.length) return null;
                      return (
                        <div className="sources-wrap" aria-label="Sources">
                          <button type="button" className="sources-btn" aria-haspopup="dialog">
                            <span className="sources-btn-icon" aria-hidden="true">
                              <FolderIcon />
                            </span>
                            <span>Sources</span>
                            <span className="sources-count">{sourceItems.length}</span>
                          </button>
                          <div className="sources-pop" role="dialog" aria-label="Sources">
                            <div className="sources-pop-title">Sources</div>
                            <ul className="sources-pop-list">
                              {sourceItems.map((s, i) => (
                                <li key={`${s.label}-${i}`} className="sources-pop-item">
                                  {s.url ? (
                                    <a
                                      className="source-chip source-link"
                                      href={s.url}
                                      target="_blank"
                                      rel="noreferrer noopener"
                                      title={s.title}
                                    >
                                      {s.label}
                                    </a>
                                  ) : (
                                    <span className="source-chip" title={s.title}>
                                      {s.label}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })()}

                    {uiCards}
                  </div>
                </div>
              );

              if (index === 0 && showQuickActionsAfterGreeting) {
                return (
                  <React.Fragment key={m.id}>
                    {messageNode}
                    {quickActionsNode}
                  </React.Fragment>
                );
              }

              return <React.Fragment key={m.id}>{messageNode}</React.Fragment>;
            })}
            {showQuickActionsAtEnd && quickActionsNode}

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
              <div className="nchatbot-input-icons">
                <span className="nchatbot-icon" aria-hidden="true">
                  <SmileIcon />
                </span>
                <button
                  type="button"
                  className="nchatbot-icon-btn"
                  onClick={revealQuickActions}
                  disabled={!resolvedQuickActions.length}
                  aria-label="Show quick actions"
                  title="Quick actions"
                >
                  <GridIcon />
                </button>
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
          </>
        )}
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

function formatSourceName(source: string): string {
  if (!source) return '';
  let s = String(source).replace(/\.txt$/i, '').trim();
  s = s.replace(/[_\-]+/g, ' ');
  const parts = s
    .split(/\s*\/\s*/)
    .map((part) =>
      part
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    )
    .filter(Boolean);
  return parts.join(' / ');
}

function toSourceDisplay(source: any): SourceDisplay | null {
  if (!source) return null;
  if (typeof source === 'string') {
    const label = formatSourceName(source) || source;
    return { label, title: source };
  }
  if (typeof source === 'object') {
    const url = typeof source.url === 'string' ? source.url : '';
    if (url) {
      return { label: domainLabel(url) || url, title: url, url };
    }
    const rawName =
      typeof source.source === 'string' ? source.source : typeof source.name === 'string' ? source.name : '';
    if (rawName) {
      const label = formatSourceName(rawName) || rawName;
      return { label, title: rawName };
    }
  }
  return null;
}

function addApologyEmoji(text?: string): string | undefined {
  if (!text) return text;
  const trimmed = text.replace(/\s+$/, '');
  const isApology = /\bsorry\b/i.test(trimmed) || /\bapolog(?:y|ies|ize|ise)\b/i.test(trimmed);
  if (!isApology) return text;
  if (trimmed.includes('🥺')) return text;
  return `${trimmed} 🥺`;
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

const MinusIcon = () => (
  <svg className="nchatbot-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 12h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="nchatbot-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M7.5 3.5l2.2 1.2c.6.3.9 1 .7 1.7l-.7 2.4c-.2.6 0 1.2.4 1.6l3.6 3.6c.4.4 1 .6 1.6.4l2.4-.7c.7-.2 1.4.1 1.7.7l1.2 2.2c.4.7.2 1.6-.5 2-1 .6-2.3 1.1-3.6 1.1-6.1 0-11-4.9-11-11 0-1.3.4-2.6 1.1-3.6.4-.7 1.3-.9 2-.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const SmileIcon = () => (
  <svg className="nchatbot-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
    <path d="M8.5 14.5c1 1 2.1 1.5 3.5 1.5s2.5-.5 3.5-1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M9 10.5h.01M15 10.5h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const GridIcon = () => (
  <svg className="nchatbot-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="5" y="5" width="6" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
    <rect x="13" y="5" width="6" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
    <rect x="5" y="13" width="6" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
    <rect x="13" y="13" width="6" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const SendIcon = () => (
  <svg className="nchatbot-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12l14-7-4 14-3-5-7-2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

const FolderIcon = () => (
  <svg className="nchatbot-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 7.5c0-1 .8-1.8 1.8-1.8h4l2 2h6.4c1 0 1.8.8 1.8 1.8v7.7c0 1-.8 1.8-1.8 1.8H5.8c-1 0-1.8-.8-1.8-1.8V7.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
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

