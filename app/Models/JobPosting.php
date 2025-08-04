<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPosting extends Model
{
    use HasFactory;

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