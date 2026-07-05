// src/components/ChatInput.tsx

import { useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { Bot } from "lucide-react";

interface Props {
  onSend: (message: string) => void;
  onStop?: () => void;
  disabled: boolean;
}

export function ChatInput({ onSend, onStop, disabled }: Props) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (disabled || !value.trim()) return;
    onSend(value);
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
        <span className="chat-input__prefix">
            <Bot size={18} />
        </span>
      <textarea
        className="chat-input__field"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="type a message..."
        rows={1}
        disabled={disabled}
      />
      {disabled ? (
        <button className="chat-input__send chat-input__stop" type="button" onClick={onStop} disabled={!onStop}>
          stop
        </button>
      ) : (
        <button className="chat-input__send" type="submit" disabled={!value.trim()}>
          send
        </button>
      )}
    </form>
  );
}