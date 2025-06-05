<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentExamResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $totalQuestions = $this->examQuestions()->count();
        return [
            'id' =>$this->id,
            'title' => $this->title,
            'totalMarks' => $this->total_marks,
            'maxAttempts' => $this->max_attempts,
            'starts_at' => $this->starts_at,
            'ends_at' => $this->ends_at,
            'duration' => $this->duration,
            // 'immediateResult' => $this->immediate_result,
            'batchId' => $this->batch_id,
            'batch' => $this->batch->name ?? "", 
            'subjectId' => $this->subject_id,
            'subjectName' => $this->subject->name ?? null,
            'examDate' =>   date('Y-m-d', strtotime($this->exam_date)),
            'instructions' => $this->instructions,
            'invigilators' => $this->invigilators,
            // 'meta' => $this->meta
            'status' =>$this->status ?? null,
            'totalMarksObtained' => $this->totalMarksObtained ?? 0,
            'attemptId' => $this->attemptId ?? null,
            'totalQuestions' => $totalQuestions,
        ];
    }
}
