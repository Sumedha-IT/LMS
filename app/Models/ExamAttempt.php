<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamAttempt extends Model
{
    use HasFactory;
    public function student()
    {
        return $this->belongsTo(User::class, 'id');
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class,'id');
    }

  
}
