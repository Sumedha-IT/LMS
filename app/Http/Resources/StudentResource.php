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
            "avatar_url" => $this->avatar_url,
            'zoho_crm_id' => $this->zoho_crm_id,
            'course_name' => $this->course_name,
            'fees' => $this->fees,
            'no_of_installments' => $this->no_of_installments,
            'program' => $this->program,
            'lead_id' => $this->lead_id,
            'batch_name' => $this->batch_name,
            // Get course from batch's course_package relationship
            'course' => $this->whenLoaded('batches', function() {
                $firstBatch = $this->batches->first();
                if ($firstBatch && $firstBatch->course_package) {
                    return [
                        'id' => $firstBatch->course_package->id,
                        'name' => $firstBatch->course_package->name,
                    ];
                }
                return null;
            }),
            'batches' => $this->whenLoaded('batches', function() {
                return $this->batches->map(function($batch) {
                    return [
                        'id' => $batch->id,
                        'batch_name' => $batch->name,
                        'batch_id' => $batch->id,
                        'course' => $batch->course_package ? [
                            'id' => $batch->course_package->id,
                            'name' => $batch->course_package->name,
                        ] : null,
                    ];
                });
            }),
            // Add exam marks from user table
            'exam_total_marks' => $this->exam_total_marks ?? 0,
            'exam_has_negative_scores' => ($this->exam_total_marks ?? 0) < 0,
        ];
    }
}
