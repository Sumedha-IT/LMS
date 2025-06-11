<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamAttempt extends Model
{
    use HasFactory;
    protected $table = 'exam_attempts';

    protected $fillable = [
        'student_id',
        'exam_id',
        'attempt_count',
        'score',
        'status',
        'ends_at',
        'report'
    ];

    protected $casts = [
        'report' => 'array'
   ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class, 'exam_id');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function getExams()
    {
        return $this->belongsTo(Exam::class, 'exam_id', 'id');
    }
    
    
  
}
