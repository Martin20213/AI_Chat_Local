// src/api/chatApi.ts

import { apiPost } from './client';
import type { SendMessageRequest, SendMessageResponse, ChatMessage } from '../types/chat';

export const chatApi = {
  sendMessage: (messages: ChatMessage[]): Promise<SendMessageResponse> => {
    const payload: SendMessageRequest = {
      messages: messages.map(({ role, content }) => ({ role, content })),
    };
    return apiPost<SendMessageResponse, SendMessageRequest>('/chat', payload);
  },
};