<?php
// app/Http/Controllers/ChatController.php

namespace App\Http\Controllers;

use App\Http\Requests\SendMessageRequest;
use App\Services\AiService;
use App\Models\Message;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ChatController extends Controller
{
    public function __construct(protected AiService $aiService)
    {
    }

    public function stream(SendMessageRequest $request): StreamedResponse
    {
        $messages = $request->validated('messages');

        return response()->stream(function () use ($messages) {
            $fullReply = '';

            foreach ($this->aiService->streamMessage($messages) as $chunk) {
                $fullReply .= $chunk;

                echo "data: " . json_encode(['content' => $chunk]) . "\n\n";
                ob_flush();
                flush();
            }

            echo "data: " . json_encode(['done' => true]) . "\n\n";
            ob_flush();
            flush();

            $this->logHistory($messages, $fullReply);
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'X-Accel-Buffering' => 'no', // fontos, ha nginx mögött fut
        ]);
    }

    private function logHistory(array $messages, string $reply): void
    {
        try {
            $lastUserMessage = end($messages);
            Message::create(['role' => 'user', 'content' => $lastUserMessage['content']]);
            Message::create(['role' => 'assistant', 'content' => $reply]);
        } catch (\Throwable $e) {
            report($e);
        }
    }
}