// src/components/MessageBubble.tsx

import type { ChatMessage } from '../types/chat';

interface Props {
  message: ChatMessage;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming = false }: Props) {
  const isUser = message.role === 'user';
  const prompt = isUser ? 'user@you' : 'ollama@local';

  return (
    <div className={`message ${isUser ? 'message--user' : 'message--assistant'}`}>
      <div className="message__prompt">
        <span className="message__prompt-user">{prompt}</span>
        <span className="message__prompt-symbol">:~$</span>
      </div>
      <div className="message__content">
        {message.content}
        {isStreaming && <span className="cursor-blink">▍</span>}
      </div>
    </div>
  );
}