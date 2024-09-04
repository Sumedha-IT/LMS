<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionBankResource extends JsonResource
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
            'question_bank_subject_id' => $this->question_bank_subject_id,
            'name' => $this->name,
            'question_bank_chapter' => $this->question_bank_chapter,
            'question_bank_difficulty_id' => $this->question_bank_difficulty_id,
            'question_bank_type_id' => $this->question_bank_type_id,
            'description' => $this->description,
        ];
    }
}
