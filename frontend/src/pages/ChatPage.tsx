// src/pages/ChatPage.tsx

import { useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { MessageBubble } from '../components/messageBubble';
import { ChatInput } from '../components/chatInput';

export function ChatPage() {
  const { messages, sendMessage, stopGeneration, isLoading, error, streamingId } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-page">
      <header className="chat-header">
        <span className="chat-header__dot" />
        chat.local — llama3
      </header>

      <div className="chat-log">
        {messages.length === 0 && (
          <div className="chat-empty">no messages yet. say something.</div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isStreaming={msg.id === streamingId} />
        ))}
        {error && <div className="chat-error">error: {error}</div>}
        <div ref={scrollRef} />
      </div>

      <ChatInput onSend={sendMessage} onStop={stopGeneration} disabled={isLoading} />
    </div>
  );
}