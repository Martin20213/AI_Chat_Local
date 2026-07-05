// src/types/chat.ts

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
}

export interface SendMessageRequest {
  messages: Pick<ChatMessage, 'role' | 'content'>[];
}

export interface SendMessageResponse {
  reply: string;
}

export interface ChatErrorResponse {
  error: string;
}