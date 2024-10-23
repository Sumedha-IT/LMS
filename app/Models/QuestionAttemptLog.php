<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionAttemptLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_attempt_id',
        'exam_id',
        'answer',
        'stage',
        'score',
        'exam_question_id', // Add this field to the fillable array
    ];

    protected $casts = [
        'answer' => 'json'
   ];

    public function examAttempt()
    {
        return $this->belongsTo(ExamAttempt::class);
    }


    public function examQuestion()
    {
        return $this->belongsTo(ExamQuestion::class, 'question_id', 'exam_question_id');
    }

    

}
