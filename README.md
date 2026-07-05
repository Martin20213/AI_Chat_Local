# AI_Chat_Local

A minimal, ChatGPT clone chat application powered by a locally running Ollama model (e.g. `llama3`). Single-user, no auth, clean architecture — Laravel API + React/TypeScript frontend, streamed responses, and a terminal-inspired dark hacker-fintech UI.

## ✨ Features

- 💬 Real-time, token-by-token streaming (SSE) — responses appear character by character instead of waiting for the full generation
- 🧠 Full conversation history sent with every request — the model retains context
- ⚙️ Configurable system prompt (via `.env`, no code changes needed)
- 🗄️ Optional message persistence to the database (non-blocking — chat still works if logging fails)
- 🎨 Custom terminal-style UI: `user@you:~$` / `ollama@local:~$` prompts, blinking cursor while streaming
- 🧱 Clean, layered architecture on both sides (backend: Controller → Service; frontend: types → api → hooks → pages)

## 🖼️ Screenshot

<img width="896" height="692" alt="ai_chat" src="https://github.com/user-attachments/assets/13cc17c2-4f67-4cc8-9b20-4c8d0cfcdbae" />

## 🛠️ Tech stack

**Backend**
- [Laravel](https://laravel.com/) (API)
- PHP HTTP Client (for streamed Ollama requests)
- SQLite / MySQL (optional message logging)

**Frontend**
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)

**AI**
- [Ollama](https://ollama.com/) — local LLM runtime (`llama3`, `mistral`, etc.)

## 📁 Project structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/ChatController.php
│   │   └── Requests/SendMessageRequest.php
│   ├── Services/AiService.php
│   └── Models/Message.php
└── routes/api.php

frontend/
└── src/
    ├── types/chat.ts
    ├── api/
    │   ├── client.ts
    │   └── chatApi.ts
    ├── hooks/useChat.ts
    ├── components/
    │   ├── MessageBubble.tsx
    │   └── ChatInput.tsx
    └── pages/ChatPage.tsx
```

## 🚀 Installation guide

### Prerequisites

- PHP 8.2+ and Composer
- Node.js 18+ and npm
- [Ollama](https://ollama.com/download) installed and running

### 1. Pull an Ollama model

```bash
ollama pull llama3
ollama serve
```

### 2. Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Backend available at: `http://localhost:8000`

### 3. Frontend (React)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend available at: `http://localhost:5173`

### 4. Open in your browser

```
http://localhost:5173
```

## ⚙️ Environment variables

**Backend (`.env`)**

| Variable | Description | Default |
|---|---|---|
| `OLLAMA_BASE_URL` | Ollama API address | `http://localhost:11434` |
| `OLLAMA_MODEL` | Model to use | `llama3` |
| `OLLAMA_TIMEOUT` | Request timeout (seconds) | `60` |
| `OLLAMA_SYSTEM_PROMPT` | System message sent to the model | see `.env.example` |

**Frontend (`.env`)**

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the Laravel API | `http://localhost:8000/api` |

## 🧭 API endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat/stream` | Send a message, get an SSE-streamed response |

**Request body:**
```json
{
  "messages": [
    { "role": "user", "content": "hey" }
  ]
}
```

## 🗺️ Possible extensions

- [ ] Multiple conversation support (`Conversation` model)
- [ ] Markdown / code block rendering in responses

## 📄 License

Free to use for learning / chatting.
