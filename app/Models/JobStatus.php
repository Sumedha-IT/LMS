<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobStatus extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'jobs_statuses';
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function profile()
    {
        return $this->hasOne(JobProfile::class, 'user_id', 'user_id');
    }

}
