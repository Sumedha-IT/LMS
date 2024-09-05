<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
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
            "question_id" => $this->question_bank_id,
            "option" => $this->audio_file,
            "name" => $this->name,
            "email" => $this->email,
            "country_code" => $this->country_code,
            "phone" => $this->phone,
            "registration_number" => $this->registration_number,
            "birthday" => $this->birthday,
            "contact_number" => $this->contact_number,
            "gender" => $this->gender,
            "qualification_id" => $this->qualification_id,
            "qualification" => $this->qualification,
            "year_of_passed_out" => $this->year_of_passed_out,
            "address" => $this->address,
            "city_id" => $this->city_id,
            "city" => $this->city,
            "state_id" => $this->state_id,
            "pincode" => $this->pincode,
            "school" => $this->school,
            "aadhaar_number" => $this->aadhaar_number,
            "linkedin_profile" => $this->linkedin_profile,
            "upload_resume" => $this->upload_resume,
            "upload_aadhar" => $this->upload_aadhar,
            "upload_picture" => $this->upload_picture,
            "upload_marklist" => $this->upload_marklist,
            "upload_agreement" => $this->upload_agreement,
            "parent_name" => $this->parent_name,
            "parent_contact" => $this->parent_contact,
            "parent_email" => $this->parent_email,
            "parent_aadhar" => $this->parent_aadhar,
            "parent_occupation" => $this->parent_occupation,
            "residential_address" => $this->residential_address,
            "designation_id" => $this->designation_id,
            "experience" => $this->experience,
            "domain_id" => $this->domain_id,
            "subject" => $this->subject,
            "is_active" => $this->is_active,
            "receive_email_notification" => $this->receive_email_notification,
            "receive_sms_notification" => $this->receive_sms_notification,
            "avatar_url" => $this->avatar_url
        ];
    }
}
