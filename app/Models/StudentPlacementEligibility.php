<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentPlacementEligibility extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'is_eligible',
        'eligibility_reasons',
        'profile_completion_percentage',
        'course_completion_status',
        'exam_standards_met',
        'attendance_percentage',
        'fees_payment_status',
        'lab_test_cases_completed',
        'assignments_completed',
        'is_placed',
        'placement_date',
        'placement_salary',
        'placement_company',
        'is_pap_student',
        'remaining_fee_amount',
        'google_review_status',
        'google_review_link',
        'last_eligibility_check',
    ];

    protected $casts = [
        'is_eligible' => 'boolean',
        'profile_completion_percentage' => 'decimal:2',
        'course_completion_status' => 'boolean',
        'exam_standards_met' => 'boolean',
        'attendance_percentage' => 'decimal:2',
        'fees_payment_status' => 'boolean',
        'lab_test_cases_completed' => 'boolean',
        'assignments_completed' => 'boolean',
        'is_placed' => 'boolean',
        'placement_date' => 'datetime',
        'placement_salary' => 'decimal:2',
        'is_pap_student' => 'boolean',
        'remaining_fee_amount' => 'decimal:2',
        'last_eligibility_check' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 