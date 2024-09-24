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
        $startsAt = strtotime($this->starts_at); // Convert to timestamp
        $endsAt = strtotime($this->ends_at); // Convert to timestamp

        // Subtract the two timestamps to get the difference in seconds
        $timeDifferenceInSeconds = $endsAt - $startsAt;

        // Convert the difference to hours and minutes
        $hours = floor($timeDifferenceInSeconds / 3600);
        $minutes = floor(($timeDifferenceInSeconds % 3600) / 60);

        // Format the hours and minutes with leading zeros (e.g., 03:00)
        $timeDifferenceFormatted = sprintf('%02d:%02d', $hours, $minutes);

        return [
            'id' =>$this->id,
            'title' => $this->title,
            'totalMarks' => $this->total_marks,
            'maxAttempts' => $this->max_attempts,
            'starts_at' => $this->starts_at,
            'ends_at' => $this->ends_at,
            'duration' => $timeDifferenceFormatted,
            'immediateResult' => $this->immediate_result,
            'batchId' => $this->batch_id,
            'batch' => $this->batch->name, 
            'subjectId' => $this->subject_id,
            'examDate' =>   date('Y-m-d', strtotime($this->exam_date)),
            'instructions' => $this->instructions,
            'invigilators' => $this->invigilators,
            'meta' => $this->meta
        ];
    }
}
