<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentEducationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Debug: Log what we're getting from the model
        \Log::info('StudentEducationResource - Model data:', [
            'id' => $this->id,
            'grade_type' => $this->grade_type,
            'percentage_cgpa' => $this->percentage_cgpa,
            'all_attributes' => $this->getAttributes()
        ]);
        
        return [
            'id'=>$this->id,
            'user_id'=>$this->user_id,
            'degree_type'=>new DegreeResource($this->degreeType),
            'specialization'=>new SpeacializationResource($this->specialization),
            'other_specialization'=>$this->other_specialization,
            'grade_type'=>$this->grade_type,
            'percentage_cgpa'=>$this->percentage_cgpa, // Store the actual value (CGPA or percentage)
            'institute_name'=>$this->institute_name,
            'location'=>$this->location,
            'duration_from'=>$this->duration_from,
            'duration_to'=>$this->duration_to,
            'year_of_passout'=>$this->year_of_passout
        ];
    }
}
