<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'instructions',
        'starts_at',
        'ends_at',
        'immediate_result',
        'max_attempts',
        'batch_id',
        'invigilators',
        'exam_date',
        'subject_id'
    ];

    protected $casts = [
         'invigilators' => 'array'
    ];
    
    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function examAttempts()
    {
        return $this->hasMany(ExamAttempt::class,'exam_id');
    }

    public function examQuestions()
    {
        return $this->hasMany(ExamQuestion::class,'exam_id','id');
    }
}
