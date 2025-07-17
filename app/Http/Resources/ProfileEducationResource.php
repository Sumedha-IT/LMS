<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileEducationResource extends JsonResource
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
            'userId' => $this->user_id,
            'institute' => $this->institute,
            'gradeType' => $this->grade_type,
            'degreeType' => $this->degree_type,
            'course' => $this->course,
            'result' => $this->result,
            'startedAt' => $this->started_at,
            'endsAt' => $this->ends_at,
            // 'createdAt' => $this->created_at,
            // 'updatedAt' => $this->updated_at,
        ];
    }
}
