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
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
