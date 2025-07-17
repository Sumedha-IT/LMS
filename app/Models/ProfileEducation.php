<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileEducation extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'profile_educations';
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
