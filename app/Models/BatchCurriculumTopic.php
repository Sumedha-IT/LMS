<?php

namespace App\Models;

use App\Models\Topic;
use App\Models\BatchCurriculum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BatchCurriculumTopic extends Model
{
    use HasFactory;
    protected $table = 'batch_curriculum_topics';
    protected $guarded = ['id'];
    protected $casts = [
        'is_topic_completed' => 'boolean',
        'topic_completed_at' => 'datetime',
    ];
    public function batchCurriculum()
    {
        return $this->belongsTo(BatchCurriculum::class, 'batch_curriculum_id');
    }

    public function topic()
    {
        return $this->belongsTo(Topic::class, 'topic_id');
    }

}
