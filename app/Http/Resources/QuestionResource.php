<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            "question_bank_id" => $this->question_bank_id,
            "audio_file" => $this->audio_file,
            "paragraph" => $this->paragraph,
            "question" => $this->question,
            "question_type" => $this->question_type,
            "difficulty" => $this->difficulty,
            "topic" => $this->topic,
            "marks" => $this->marks,
            "negative_marks" => $this->negative_marks,
            // "hint" => $this->hint,
            // "explanation" => $this->explanation,
            // "answer" => $this->answer,
            "check_capitalization" => $this->check_capitalization,
            "check_punctuation" => $this->check_punctuation,
        ];
    }
}

