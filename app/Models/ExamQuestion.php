<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamQuestion extends Model
{
    use HasFactory;
    protected $fillable = [
        'exam_id',
        'part_id',
        'meta',
        'question',
        'question_bank_id',
        'question_id',
        'score',
        'negative_score'
    ];

    protected $casts = [
        'meta' => 'array',
    ];
    public function exam()
    {
        return $this->belongsTo(Exam::class,'exam_id','id');
    }

    public function questions()
    {
        return $this->belongsTo(Question::class,'question_id','id');
    }

    public function section()
    {
        return $this->belongsTo(ExamSection::class,'section_id','id');
    }

    public function questionAttempts()
    {
        return $this->hasMany(QuestionAttemptLog::class, 'exam_question_id', 'question_id');
    }
    
}
