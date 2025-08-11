<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BatchResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Add logging for debugging
        \Log::info('BatchResource toArray called', [
            'batch_id' => $this->id,
            'batch_name' => $this->name,
            'has_students' => $this->relationLoaded('students'),
            'student_count' => $this->whenLoaded('students', function() {
                return $this->students->count();
            }, 0)
        ]);

        return [
            'batch_id' => $this->id,
            'batch_name' => $this->name,
            'batch_start' => $this->start_date,
            'batch_end' => $this->end_date,
            'batch_manager_id' => $this->manager_id,
            'batch_manager_name' => $this->user->name ?? null,
            'curriculum' => $this->curriculum_data,
            'course_id' => $this->course_package ? $this->course_package->id : '',
            'course_name' => $this->course_package ? $this->course_package->name : '',
            'course_type' => $this->course_package ? $this->course_package->get_formatted_course_type : '',
            'description' => $this->course_package ? $this->course_package->short_description : '',
            //'image_url' => $this->course_package ? url("storage/" . $this->course_package->image_url) : '',
            'image_url' => $this->course_package && $this->course_package->image_url ? url('storage/' . $this->course_package->image_url) : null,
            'completed' => 50,
            'attendance' => rand(1,100),
            'students' => $this->whenLoaded('students', function() {
                \Log::info('Processing students in BatchResource', [
                    'student_count' => $this->students->count(),
                    'first_student' => $this->students->first() ? [
                        'id' => $this->students->first()->id,
                        'name' => $this->students->first()->name
                    ] : null
                ]);
                
                return $this->students->map(function($student) {
                    return [
                        'id' => $student->id,
                        'name' => $student->name,
                        'email' => $student->email,
                        'phone' => $student->phone,
                        'course' => $this->course_package ? [
                            'id' => $this->course_package->id,
                            'name' => $this->course_package->name,
                        ] : null,
                        'batches' => $student->batches ? $student->batches->map(function($batch) {
                            return [
                                'id' => $batch->id,
                                'batch_name' => $batch->name,
                                'batch_id' => $batch->id,
                                'course' => $batch->course_package ? [
                                    'id' => $batch->course_package->id,
                                    'name' => $batch->course_package->name,
                                ] : null,
                            ];
                        }) : [],
                    ];
                });
            }, []),
        ];
    }
}
