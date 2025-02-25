<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\StateResource;
use Illuminate\Http\Resources\Json\JsonResource;

class UserProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return  [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'registration_number' => $this->registration_number,
            'phone' => $this->phone,
            'gender' => $this->gender,
            'birthday' => $this->birthday,
            //'year_of_passed_out' => $this->year_of_passed_out,
            'address' => $this->address,
            'pincode' => $this->pincode,
            //'school' => $this->school,
            'city' => $this->city,
            // 'state_id' => $this->state_id,
            'country_code' => $this->country_code,

            'state' => new StateResource($this->state),
            'aadhaar_number' => $this->aadhaar_number,
            'linkedin_profile' => $this->linkedin_profile,
            'avatar_url' => $this->avatar_url ? url("storage/" . $this->avatar_url) : "",
            // 'branch' => new BranchResource($this->batches->select('id', 'name')),
            'domain'=>$this->domain_id,
            'parent_name' => $this->parent_name,
            'parent_email' => $this->parent_email,
            'parent_aadhar' => $this->parent_aadhar,
            'parent_occupation' => $this->parent_occupation,
            'residential_address' => $this->residential_address,
            // Add any additional fields as needed
        ];
    }
}
