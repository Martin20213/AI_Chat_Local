<?php
// app/Services/AiService.php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Generator;
use RuntimeException;

class AiService
{
    protected string $baseUrl;
    protected string $model;
    protected int $timeout;
    protected string $systemPrompt;

    public function __construct()
    {
        $this->baseUrl = config('services.ollama.base_url');
        $this->model = config('services.ollama.model');
        $this->timeout = config('services.ollama.timeout');
        $this->systemPrompt = config('services.ollama.system_prompt');
    }

    /**
     * Send a message to the AI service and get a response.
     *
     * @param array $messages
     * @return Generator<string>
     */
    public function streamMessage(array $messages): Generator
    {
        $response = Http::withOptions(['stream' => true])
            ->timeout($this->timeout)
            ->post("{$this->baseUrl}/api/chat", [
                'model' => $this->model,
                'messages' => $this->withSystemPrompt($messages),
                'stream' => true,
                'options' => [
                    'num_predict' => 500, // Adjust as needed
                ],
            ]);

        $body = $response->toPsrResponse()->getBody();

        while (!$body->eof()) {
            $line = $this->readLine($body);
            if (!$line) {
                continue;
            }

            $data = json_decode($line, true);
            if (!$data) {
                continue;
            }

            if (isset($data['message']['content'])) {
                yield $data['message']['content'];
            }

            if (!empty($data['done'])) {
                break;
            }
        }
    }

    /**
     * Prepend the system prompt, unless one is already present.
     */
    private function withSystemPrompt(array $messages): array
    {
        if (empty($this->systemPrompt)) {
            return $messages;
        }

        $hasSystemMessage = collect($messages)->contains(
            fn ($m) => ($m['role'] ?? null) === 'system'
        );

        if ($hasSystemMessage) {
            return $messages;
        }

        return [
            ['role' => 'system', 'content' => $this->systemPrompt],
            ...$messages,
        ];
    }

    private function readLine($stream): string
    {
        $buffer = '';
        while (!$stream->eof()) {
            $char = $stream->read(1);
            if ($char === "\n") {
                break;
            }
            $buffer .= $char;
        }
        return trim($buffer);
    }
}