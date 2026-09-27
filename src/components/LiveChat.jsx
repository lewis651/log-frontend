import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User as UserIcon } from 'lucide-react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import './LiveChat.css';

const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api$/, '');

const BOT_RESPONSES = {
  greeting: ["Hello! Welcome to Logistiqo. I'm your virtual logistics assistant. How can I help you today?"],
  keywords: [
    { match: ['track', 'tracking', 'where', 'shipment', 'package', 'cargo', 'order'], response: "To track your shipment, head over to our **Track Shipment** page and enter your unique tracking ID (e.g. LQO-2024-001). You'll get real-time updates including current location, live map, and estimated delivery. Need me to take you there?" },
    { match: ['quote', 'price', 'cost', 'rate', 'how much', 'pricing'], response: "We'd love to give you a custom quote! Just visit our **Get a Quote** page and fill in your shipment details — transport mode, origin, destination, weight, and cargo type. Our team responds within 2 hours with a competitive rate." },
    { match: ['ocean', 'sea', 'ship', 'vessel', 'fcl', 'lcl', 'container'], response: "Our **Ocean Freight** service covers FCL and LCL shipments across all major global shipping lanes. We partner with Maersk, MSC, and CMA CGM for reliable schedules. Typical transit times range from 10–35 days depending on your route. Would you like a quote?" },
    { match: ['air', 'flight', 'plane', 'airfreight', 'express', 'urgent'], response: "Our **Air Freight** service delivers to 200+ destinations worldwide. We offer both express (1–3 days) and economy (3–7 days) options. It's ideal for time-critical or high-value cargo. Shall I point you to our quote form?" },
    { match: ['truck', 'road', 'ground', 'ftl', 'ltl', 'trucking', 'transport'], response: "Our **Road Transport** network covers North America and Europe with GPS-tracked FTL and LTL options. We also handle cross-border and overnight delivery. Want to request a quote for road freight?" },
    { match: ['warehouse', 'storage', 'store', 'inventory', 'fulfillment', 'distribution'], response: "Logistiqo operates over 1M sq ft of bonded warehouse space globally. We offer pick-and-pack, climate-controlled storage, and full inventory management integrated with our digital platform. Interested in our warehousing solutions?" },
    { match: ['customs', 'clearance', 'duty', 'import', 'export', 'broker', 'compliance'], response: "Our in-house **Customs Clearance** team handles all documentation, duties, and regulatory compliance in 30+ countries — so your cargo moves without border delays. Contact our team at sales@logistiqo.com for a consultation." },
    { match: ['insurance', 'insured', 'damage', 'loss', 'claim'], response: "Yes, all shipments are eligible for comprehensive **cargo insurance**. We offer multiple coverage tiers to suit your cargo value and risk profile. Our team can walk you through the options when you request a quote." },
    { match: ['contact', 'call', 'email', 'speak', 'human', 'agent', 'support', 'help'], response: "You can reach our team directly:\n📧 jefferylawrence973@gmail.com\n📧 sales@logistiqo.com\n📞 +1 (458) 344-0688\n\nOr visit our **Contact** page to send us a message directly. Our team is available Mon–Fri, 8am–8pm EST." },
    { match: ['location', 'office', 'address', 'where are you', 'country', 'region'], response: "Logistiqo has offices and logistics hubs across **North America, Europe, and Asia-Pacific** — including New York, Rotterdam, London, Singapore, and Shanghai. Check our **Global Network** page for full details." },
    { match: ['delivery', 'time', 'how long', 'transit', 'days'], response: "Transit times vary by mode and route:\n• 🚢 Ocean Freight: 10–35 days\n• ✈️ Air Freight: 1–7 days\n• 🚛 Road Transport: 1–10 days\n\nWe'll give you an exact ETA when you request a quote." },
    { match: ['service', 'offer', 'provide', 'what do you do', 'solutions'], response: "Logistiqo offers a full range of global logistics solutions:\n• 🚢 Ocean Freight (FCL & LCL)\n• ✈️ Air Freight\n• 🚛 Road Transport\n• 🏭 Warehousing & Distribution\n• 🌐 Customs Clearance\n• 📦 Last-Mile Delivery\n\nWould you like details on any of these?" },
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
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('menu'); 
  const [trackingNumber, setTrackingNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Live Chat state
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);

  // AI Chat state
  const [aiMessages, setAiMessages] = useState([
    { from: 'bot', text: BOT_RESPONSES.greeting[0], time: new Date() }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const aiMessagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (step === 'live_chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (step === 'ai') {
      aiMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, aiMessages, step, isTyping]);

  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  const openLiveChat = () => {
    setStep('live_login');
    setError('');
    setIsLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a valid tracking number.');
      return;
    }

    setIsLoading(true);
    const tNumber = trackingNumber.trim();
    console.log("Connecting to chat with tracking number:", tNumber);
    const newSocket = io(SOCKET_URL);
    
    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Cannot connect to live chat server. Please try again.');
      setIsLoading(false);
      newSocket.disconnect();
    });

    newSocket.on('connect', () => {
      newSocket.emit('join_chat', { tracking_number: tNumber, isAdmin: false });
    });

    newSocket.on('chat_history', (history) => {
      console.log("Received chat history, joining live chat room.");
      setMessages(history);
      setStep('live_chat');
      setSocket(newSocket);
      setError('');
      setIsLoading(false);
    });

    newSocket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('chat_error', (data) => {
      console.log("Chat error from server:", data.message);
      setError(data.message);
      setIsLoading(false);
      newSocket.disconnect();
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) return;

    socket.emit('send_message', {
      tracking_number: trackingNumber.trim(),
      sender: 'user',
      message: inputMessage.trim(),
    });

    setInputMessage('');
  };

  const sendAiMessageText = (text) => {
    if (!text.trim()) return;
    
    const userMsg = { from: 'user', text: text.trim(), time: new Date() };
    setAiMessages(prev => [...prev, userMsg]);
    setAiInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      const reply = getBotReply(userMsg.text);
      setIsTyping(false);
      setAiMessages(prev => [...prev, { from: 'bot', text: reply, time: new Date() }]);
    }, 1000 + Math.random() * 800);
  };

  const handleAiSubmit = (e) => {
    e.preventDefault();
    sendAiMessageText(aiInput);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setTimeout(() => {
      setStep('menu');
      setTrackingNumber('');
      setMessages([]);
      setError('');
    }, 300);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="live-chat-floating-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <MessageCircle size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="live-chat-window"
          >
            <div className="live-chat-header">
              <h3>
                {step === 'menu' && 'Need Help?'}
                {step === 'live_login' && 'Verify Access'}
                {step === 'live_chat' && 'Live Support'}
                {step === 'ai' && 'AI Assistant'}
              </h3>
              <button onClick={handleClose} className="live-chat-close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="live-chat-body">
              {step === 'menu' && (
                <div className="live-chat-menu">
                  <p>How would you like to get help today?</p>
                  <button onClick={() => setStep('ai')} className="live-chat-option-btn">
                    <div className="icon-wrapper-ai">
                      <Bot size={24} />
                    </div>
                    <div className="option-text">
                      <h4>AI Assistant</h4>
                      <p>Instant automated help</p>
                    </div>
                  </button>
                  <button onClick={openLiveChat} className="live-chat-option-btn">
                    <div className="icon-wrapper-live" style={{ backgroundColor: '#fef2f2', color: '#8B0000' }}>
                      <UserIcon size={24} />
                    </div>
                    <div className="option-text">
                      <h4>Live Chat</h4>
                      <p>Talk to a human agent</p>
                    </div>
                  </button>
                </div>
              )}

              {step === 'live_login' && (
                <div className="live-chat-login">
                  <h4>Enter Tracking Number</h4>
                  <p>To connect with an agent, please provide your tracking number for verification.</p>
                  <form onSubmit={handleLogin}>
                    <div>
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="e.g. TRK123456789"
                        className="live-chat-input"
                        required
                      />
                      {error && <p className="error-text">{error}</p>}
                    </div>
                    <button type="submit" className="live-chat-submit" disabled={isLoading}>
                      {isLoading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <svg className="spinner" viewBox="0 0 50 50" style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }}>
                            <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="5" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                          </svg>
                          Connecting...
                        </span>
                      ) : (
                        "Start Chat"
                      )}
                    </button>
                    <button type="button" onClick={() => setStep('menu')} className="live-chat-back">
                      Back to options
                    </button>
                  </form>
                </div>
              )}

              {step === 'live_chat' && (
                <>
                  <div className="live-chat-messages">
                    {messages.length === 0 ? (
                      <div style={{ textAlign: 'center', color: '#6b7280', margin: '32px 0' }}>
                        <p style={{ fontSize: '0.875rem' }}>Connected to Live Support.</p>
                        <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>An agent will be with you shortly. Send a message to get started.</p>
                      </div>
                    ) : (
                      messages.map((msg, idx) => {
                        const isUser = msg.sender === 'user';
                        return (
                          <div key={idx} className={`message-row ${isUser ? 'user' : 'admin'}`}>
                            <div className="message-bubble">
                              {msg.message}
                            </div>
                            <span className="message-time">
                              {new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
                    <button onClick={() => setStep('menu')} className="live-chat-back" style={{ marginTop: 0 }}>
                      Leave Live Chat
                    </button>
                  </div>
                  <form onSubmit={sendMessage} className="live-chat-input-area">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message..."
                    />
                    <button type="submit" disabled={!inputMessage.trim()}>
                      <Send size={18} />
                    </button>
                  </form>
                </>
              )}

              {step === 'ai' && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div className="live-chat-messages" style={{ flex: 1 }}>
                    {aiMessages.map((msg, i) => (
                      <div key={i} className={`message-row ${msg.from === 'user' ? 'user' : 'admin'}`}>
                        <div className="message-bubble">
                          <p style={{ margin: 0 }}>
                            {msg.text.split('\n').map((line, j) => (
                              <span key={j}>{formatText(line)}{j < msg.text.split('\n').length - 1 && <br />}</span>
                            ))}
                          </p>
                        </div>
                        <span className="message-time">
                          {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="message-row admin">
                        <div className="message-bubble" style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                          Typing...
                        </div>
                      </div>
                    )}
                    <div ref={aiMessagesEndRef} />
                  </div>
                  
                  {/* AI Quick Prompts */}
                  <div className="live-chat-prompts">
                    {['Track a shipment', 'Get a quote', 'Our services', 'Contact support'].map(p => (
                      <button key={p} type="button" onClick={() => sendAiMessageText(p)}>
                        {p}
                      </button>
                    ))}
                  </div>

                  <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
                    <button onClick={() => setStep('menu')} className="live-chat-back" style={{ marginTop: 0 }}>
                      Back to options
                    </button>
                  </div>
                  <form onSubmit={handleAiSubmit} className="live-chat-input-area">
                    <input
                      type="text"
                      value={aiInput}
                      onChange={e => setAiInput(e.target.value)}
                      placeholder="Ask me anything..."
                    />
                    <button type="submit" disabled={!aiInput.trim() || isTyping}>
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
