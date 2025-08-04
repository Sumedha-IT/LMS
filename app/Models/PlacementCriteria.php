<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlacementCriteria extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'profile_completion_percentage',
        'course_completion_required',
        'exam_standards_required',
        'attendance_percentage',
        'fees_payment_required',
        'lab_test_cases_required',
        'assignments_required',
        'is_active',
    ];

    protected $casts = [
        'profile_completion_percentage' => 'decimal:2',
        'course_completion_required' => 'boolean',
        'exam_standards_required' => 'boolean',
        'attendance_percentage' => 'decimal:2',
        'fees_payment_required' => 'boolean',
        'lab_test_cases_required' => 'boolean',
        'assignments_required' => 'boolean',
        'is_active' => 'boolean',
    ];
} 