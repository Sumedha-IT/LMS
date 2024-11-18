<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;
    protected $guarded = [];
 

    public function recruiter()
    {
        return $this->belongsTo(User::class, 'recruiter_id');
    }

    public function jobStatuses()
    {
        return $this->hasMany(JobStatus::class);
    }
}
