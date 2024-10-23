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

        return [
            'id' =>$this->id,
            'title' => $this->title,
            'totalMarks' => $this->total_marks,
            'maxAttempts' => $this->max_attempts,
            'starts_at' => $this->starts_at,
            'ends_at' => $this->ends_at,
            'duration' => $this->duration,
            'batchId' => $this->batch_id,
            'batch' => $this->batch->name ?? "", 
            'subjectId' => $this->subject_id,
            'examDate' =>   date('Y-m-d', strtotime($this->exam_date)),
            'instructions' => $this->instructions ?? null,
            'invigilators' => $this->invigilators,
            'meta' => $this->meta
        ];
    }
}
