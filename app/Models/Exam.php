<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'instructions',
        'starts_at',
        'ends_at',
        'duration',
        'immediate_result',
        'max_attempts',
        'batch_id',
    ];

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function examAttempts()
    {
        return $this->hasMany(ExamAttempt::class,'exam_id');
    }

    public function examQuestion()
    {
        return $this->hasMany(ExamQuestion::class,'exam_id','id');
    }
}
