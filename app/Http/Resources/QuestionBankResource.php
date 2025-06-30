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
            'questionBankSubjectId' => $this->question_bank_subject_id,
            'subjectName' => $this->curriculum?->name ?? 'Unknown Subject',
            'name' => $this->name,
            'questionBankChapter' => $this->question_bank_chapter,
            'questionBankDifficultyId' => $this->question_bank_difficulty_id,
            'difficultyName' => $this->question_bank_difficulty?->name ?? 'Unknown Difficulty',
            'questionBankTypeId' => $this->question_bank_type_id,
            'typeName' => $this->question_bank_type?->name ?? 'Unknown Type',
            'description' => $this->description,
            'questionsCount' => $this->questions_count
        ];
    }
}
