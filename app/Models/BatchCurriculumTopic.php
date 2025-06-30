<?php

namespace App\Models;

use App\Models\Topic;
use App\Models\BatchCurriculum;
use App\Models\TeachingMaterial;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class BatchCurriculumTopic extends Model
{
    use HasFactory;
    protected $table = 'batch_curriculum_topics';
    protected $guarded = ['id'];
    protected $casts = [
        'is_topic_completed' => 'boolean',
        'is_topic_started' => 'boolean',
        'topic_completed_at' => 'datetime',
        'topic_started_at' => 'datetime',
    ];
    public function batchCurriculum()
    {
        return $this->belongsTo(BatchCurriculum::class, 'batch_curriculum_id');
    }

    public function topic()
    {
        return $this->belongsTo(Topic::class, 'topic_id');
    }
    public function assignments()
    {
        return $this->hasMany(TeachingMaterial::class, 'topic_id', 'topic_id')->where('doc_type',2);
    }

    public function startTopic()
    {
        $this->update([
            'is_topic_started' => true,
            'topic_started_at' => now()
        ]);
    }

    public function completeTopic()
    {
        $this->update([
            'is_topic_completed' => true,
            'topic_completed_at' => now()
        ]);
    }

    // Custom date parsing for the form fields
    public function setTopicStartedAtAttribute($value)
    {
        if ($value) {
            // Handle different date formats
            if (is_string($value)) {
                // Try to parse the date string
                try {
                    $this->attributes['topic_started_at'] = Carbon::createFromFormat('d/m/Y H:i', $value);
                } catch (\Exception $e) {
                    // If that fails, try other formats
                    $this->attributes['topic_started_at'] = Carbon::parse($value);
                }
            } else {
                $this->attributes['topic_started_at'] = $value;
            }
        } else {
            $this->attributes['topic_started_at'] = null;
        }
    }

    public function setTopicCompletedAtAttribute($value)
    {
        if ($value) {
            // Handle different date formats
            if (is_string($value)) {
                // Try to parse the date string
                try {
                    $this->attributes['topic_completed_at'] = Carbon::createFromFormat('d/m/Y H:i', $value);
                } catch (\Exception $e) {
                    // If that fails, try other formats
                    $this->attributes['topic_completed_at'] = Carbon::parse($value);
                }
            } else {
                $this->attributes['topic_completed_at'] = $value;
            }
        } else {
            $this->attributes['topic_completed_at'] = null;
        }
    }
}
