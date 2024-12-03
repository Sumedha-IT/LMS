<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobProfile extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'social_links' => 'array',  // Automatically casts the social_links column to an array
        'languages_known' => 'array',  // Automatically casts the social_links column to an array
        'awards' => 'array',  // Automatically casts the social_links column to an array
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function education()
    {
        return $this->hasMany(ProfileEducation::class, 'user_id', 'user_id');
    }

    public function experience()
    {
        return $this->hasMany(ProfileExperience::class, 'user_id', 'user_id');
    }

    public function projects()
    {
        return $this->hasMany(Project::class, 'user_id', 'user_id');

    }

    public function award()
    {
        return $this->hasMany(Award::class, 'user_id', 'user_id');
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class, 'user_id', 'user_id');
    }


}
