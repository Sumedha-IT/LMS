<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Get total number of questions for this exam
        $totalQuestions = $this->examQuestions()->count();

        return [
            'id' => $this->id,
            'title' => $this->title,
            'totalMarks' => $this->total_marks,
            'maxAttempts' => $this->max_attempts,
            'starts_at' => $this->starts_at,
            'ends_at' => $this->ends_at,
            'duration' => $this->duration,
            'batchIds' => $this->batches->pluck('id'),
            'batches' => $this->batches->map(function($batch) {
                return [
                    'id' => $batch->id,
                    'name' => $batch->name
                ];
            }),
            'examDate' => date('Y-m-d', strtotime($this->exam_date)),
            'instructions' => $this->instructions ?? null,
            'invigilators' => $this->invigilators,
            'meta' => $this->meta,
            'curriculum' => $this->curriculums,
            'totalQuestions' => $totalQuestions
        ];
    }
}
