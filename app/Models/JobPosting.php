<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPosting extends Model
{
    use HasFactory;

    protected $casts = [
        'eligible_courses' => 'array',
        'specializations' => 'array',
        'skills_required' => 'array',
        'btech_percentage_min' => 'decimal:2',
        'mtech_percentage_min' => 'decimal:2',
    ];

    protected $fillable = [
        'company_id',
        'posted_by',
        'title',
        'course_id',
        'description',
        'requirements',
        'responsibilities',
        'job_type',
        'location',
        'salary_min',
        'salary_max',
        'experience_required',
        'vacancies',
        'status',
        'application_deadline',
        // New fields added to job_postings table
        'eligible_courses',
        'specializations',
        'backlogs_allowed',
        'training_period_stipend',
        'bond_service_agreement',
        'mandatory_original_documents',
        'recruitment_process_steps',
        'mode_of_recruitment',
        'interview_date',
        'interview_mode',
        'venue_link',
        // Eligibility criteria fields (moved from separate table)
        'btech_year_of_passout_min',
        'btech_year_of_passout_max',
        'mtech_year_of_passout_min',
        'mtech_year_of_passout_max',
        'btech_percentage_min',
        'mtech_percentage_min',
        'skills_required',
        'additional_criteria',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function postedBy()
    {
        return $this->belongsTo(User::class, 'posted_by');
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }

    public function eligibilityCriteria()
    {
        return $this->hasOne(JobEligibilityCriteria::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
} 