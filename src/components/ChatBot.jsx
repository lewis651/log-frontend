import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

const BOT_RESPONSES = {
  greeting: [
    "Hello! Welcome to Logistiqo. I'm your virtual logistics assistant. How can I help you today?",
  ],
  keywords: [
    {
      match: ['track', 'tracking', 'where', 'shipment', 'package', 'cargo', 'order'],
      response: "To track your shipment, head over to our **Track Shipment** page and enter your unique tracking ID (e.g. LQO-2024-001). You'll get real-time updates including current location, live map, and estimated delivery. Need me to take you there?"
    },
    {
      match: ['quote', 'price', 'cost', 'rate', 'how much', 'pricing'],
      response: "We'd love to give you a custom quote! Just visit our **Get a Quote** page and fill in your shipment details — transport mode, origin, destination, weight, and cargo type. Our team responds within 2 hours with a competitive rate."
    },
    {
      match: ['ocean', 'sea', 'ship', 'vessel', 'fcl', 'lcl', 'container'],
      response: "Our **Ocean Freight** service covers FCL and LCL shipments across all major global shipping lanes. We partner with Maersk, MSC, and CMA CGM for reliable schedules. Typical transit times range from 10–35 days depending on your route. Would you like a quote?"
    },
    {
      match: ['air', 'flight', 'plane', 'airfreight', 'express', 'urgent'],
      response: "Our **Air Freight** service delivers to 200+ destinations worldwide. We offer both express (1–3 days) and economy (3–7 days) options. It's ideal for time-critical or high-value cargo. Shall I point you to our quote form?"
    },
    {
      match: ['truck', 'road', 'ground', 'ftl', 'ltl', 'trucking', 'transport'],
      response: "Our **Road Transport** network covers North America and Europe with GPS-tracked FTL and LTL options. We also handle cross-border and overnight delivery. Want to request a quote for road freight?"
    },
    {
      match: ['warehouse', 'storage', 'store', 'inventory', 'fulfillment', 'distribution'],
      response: "Logistiqo operates over 1M sq ft of bonded warehouse space globally. We offer pick-and-pack, climate-controlled storage, and full inventory management integrated with our digital platform. Interested in our warehousing solutions?"
    },
    {
      match: ['customs', 'clearance', 'duty', 'import', 'export', 'broker', 'compliance'],
      response: "Our in-house **Customs Clearance** team handles all documentation, duties, and regulatory compliance in 30+ countries — so your cargo moves without border delays. Contact our team at sales@logistiqo.com for a consultation."
    },
    {
      match: ['insurance', 'insured', 'damage', 'loss', 'claim'],
      response: "Yes, all shipments are eligible for comprehensive **cargo insurance**. We offer multiple coverage tiers to suit your cargo value and risk profile. Our team can walk you through the options when you request a quote."
    },
    {
      match: ['contact', 'call', 'email', 'speak', 'human', 'agent', 'support', 'help'],
      response: "You can reach our team directly:\n📧 support@logistiqo.com\n📧 sales@logistiqo.com\n📞 +1 (800) 555-LOGQ\n\nOr visit our **Contact** page to send us a message directly. Our team is available Mon–Fri, 8am–8pm EST."
    },
    {
      match: ['location', 'office', 'address', 'where are you', 'country', 'region'],
      response: "Logistiqo has offices and logistics hubs across **North America, Europe, and Asia-Pacific** — including New York, Rotterdam, London, Singapore, and Shanghai. Check our **Global Network** page for full details."
    },
    {
      match: ['delivery', 'time', 'how long', 'transit', 'days'],
      response: "Transit times vary by mode and route:\n• 🚢 Ocean Freight: 10–35 days\n• ✈️ Air Freight: 1–7 days\n• 🚛 Road Transport: 1–10 days\n\nWe'll give you an exact ETA when you request a quote."
    },
    {
      match: ['service', 'offer', 'provide', 'what do you do', 'solutions'],
      response: "Logistiqo offers a full range of global logistics solutions:\n• 🚢 Ocean Freight (FCL & LCL)\n• ✈️ Air Freight\n• 🚛 Road Transport\n• 🏭 Warehousing & Distribution\n• 🌐 Customs Clearance\n• 📦 Last-Mile Delivery\n\nWould you like details on any of these?"
    },
  ],
  fallback: [
    "I'm not sure I fully understand that. Could you rephrase? Or feel free to ask about tracking, quotes, our services, customs, insurance, or how to contact us.",
    "Great question! For more specific information, please reach out to our team at support@logistiqo.com or call +1 (800) 555-LOGQ.",
    "I'd love to help! You can also explore our website for detailed information, or contact our team directly for personalized assistance."
  ]
};

function getBotReply(message) {
  const lower = message.toLowerCase();
  for (const item of BOT_RESPONSES.keywords) {
    if (item.match.some(kw => lower.includes(kw))) {
      return item.response;
    }
  }
  return BOT_RESPONSES.fallback[Math.floor(Math.random() * BOT_RESPONSES.fallback.length)];
}

function formatText(text) {
  // Bold **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: BOT_RESPONSES.greeting[0], time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, typing]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input.trim(), time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = getBotReply(userMsg.text);
      setTyping(false);
      setMessages(prev => [...prev, { from: 'bot', text: reply, time: new Date() }]);
    }, 1000 + Math.random() * 800);
  };

  const formatTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar"><Bot size={20} /></div>
              <div>
                <div className="chatbot-name">Logistiqo Support</div>
                <div className="chatbot-status"><span className="chatbot-dot" />Online now</div>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)}><X size={20} /></button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg-row ${msg.from}`}>
                {msg.from === 'bot' && <div className="chatbot-msg-avatar"><Bot size={14} /></div>}
                <div className="chatbot-bubble">
                  <p>{msg.text.split('\n').map((line, j) => (
                    <span key={j}>{formatText(line)}{j < msg.text.split('\n').length - 1 && <br />}</span>
                  ))}</p>
                  <span className="chatbot-time">{formatTime(msg.time)}</span>
                </div>
              </div>
            ))}
            {typing && (
              <div className="chatbot-msg-row bot">
                <div className="chatbot-msg-avatar"><Bot size={14} /></div>
                <div className="chatbot-bubble typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Prompts */}
          <div className="chatbot-prompts">
            {['Track a shipment', 'Get a quote', 'Our services', 'Contact support'].map(p => (
              <button key={p} onClick={() => {
                setInput(p);
                setTimeout(() => {
                  const userMsg = { from: 'user', text: p, time: new Date() };
                  setMessages(prev => [...prev, userMsg]);
                  setInput('');
                  setTyping(true);
                  setTimeout(() => {
                    setTyping(false);
                    setMessages(prev => [...prev, { from: 'bot', text: getBotReply(p), time: new Date() }]);
                  }, 900);
                }, 0);
              }}>{p}</button>
            ))}
          </div>

          {/* Input */}
          <form className="chatbot-input-row" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit"><Send size={16} /></button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        className={`chatbot-toggle ${open ? 'active' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Open chat"
      >
        {open ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </>
  );
}
