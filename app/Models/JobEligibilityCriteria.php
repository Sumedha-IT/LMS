<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobEligibilityCriteria extends Model
{
    use HasFactory;

    protected $table = 'job_eligibility_criteria';

    protected $fillable = [
        'job_posting_id',
        'btech_year_of_passout_min',
        'btech_year_of_passout_max',
        'mtech_year_of_passout_min',
        'mtech_year_of_passout_max',
        'btech_percentage_min',
        'mtech_percentage_min',
        'skills_required',
        'additional_criteria',
    ];

    protected $casts = [
        'btech_percentage_min' => 'decimal:2',
        'mtech_percentage_min' => 'decimal:2',
        'skills_required' => 'array',
    ];

    public function jobPosting()
    {
        return $this->belongsTo(JobPosting::class);
    }
} 