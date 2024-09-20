<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamQuestion extends Model
{
    use HasFactory;

    protected $casts = [
        'meta' => 'json',
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
    
}
