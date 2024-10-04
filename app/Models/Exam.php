<?php

namespace App\Models;

use Carbon\Carbon;
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

    protected $appends = ['duration'];

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

    public function subject()
    {
        return $this->belongsTo(Subject::class);

    }

    /**
     * Get the duration between starts_at and ends_at as a formatted string.
     *
     * @return string
     */
    public function getDurationAttribute()
    {
        // Convert `starts_at` and `ends_at` to Carbon instances
        $startsAt = Carbon::parse($this->starts_at);
        $endsAt = Carbon::parse($this->ends_at);

        // Get the difference in seconds
        $timeDifferenceInSeconds = $endsAt->diffInSeconds($startsAt);

        // Convert the difference to hours and minutes
        $hours = floor($timeDifferenceInSeconds / 3600);
        $minutes = floor(($timeDifferenceInSeconds % 3600) / 60);

        // Format the hours and minutes with leading zeros (e.g., 03:00)
        return sprintf('%02d:%02d', $hours, $minutes);
    }
}
