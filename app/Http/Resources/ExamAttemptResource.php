<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamAttemptResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "examAttemptId" => $this['examAttemptLog']->id,
            "examId" => $this['examAttemptLog']->exam_id,
            "attemptCount" => $this['examAttemptLog']->attempt_count,
            "status" => $this['examAttemptLog']->status,
            "endsAt" => $this['examAttemptLog']->ends_at,
            "examDetails" => new ExamResource($this['exam']),
            "userDetails" => new StudentResource($this['user'])
        ];
    }
}
