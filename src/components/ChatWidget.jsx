import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function ChatWidget() {
  return (
    <a
      href="https://wa.me/1234567890" // Replace with actual WhatsApp number
      target="_blank"
      rel="noreferrer"
      className="chat-widget"
      title="Chat with Support"
    >
      <MessageCircle size={28} />
    </a>
  );
}
