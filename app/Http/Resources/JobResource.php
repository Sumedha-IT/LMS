<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'status' => $this->status,
            'jobType' => $this->job_type,
            'officePolicy' => $this->office_policy,
            'minExperience' => $this->min_experience,
            'maxExperience' => $this->max_experience,
            'company' => $this->company ?? 'N/A', // Provide default if null
            'location' => $this->location,
            'description' => $this->description,
            'salary' => $this->salary,
            'meta' => $this->meta,
            'expiredAt' => $this->expired_at,
            'createdAt' => $this->created_at->toDateTimeString(),
            'updatedAt' => $this->updated_at->toDateTimeString(),
        ];
        
        if($request->user->id !=  $this->recruiter_id){
            $data['recruiterDetails'] = $request->user->id == $this->recruiter_id ? null : [
                'id' => $this->recruiter_id,
                'name' => $this->recruiter->name
            ];
        }

        return $data;
    }
}
