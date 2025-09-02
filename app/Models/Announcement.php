<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected static function booted(): void
    {
        // Removed global scope so students can see all announcements, including future ones.
    }

    protected $guarded = [];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    // Add a cast for batch_ids
    protected $casts = [
        'batch_ids' => 'array',
        'schedule_at' => 'datetime',
    ];

    // Getter for batch_ids
    public function getBatchIdsAttribute($value)
    {
        return explode(',', $value);
    }

    // Setter for batch_ids
    public function setBatchIdsAttribute($value)
    {
        $this->attributes['batch_ids'] = implode(',', $value);
    }

    // Setter for schedule_at to handle d/m/Y H:i:s format
    public function setScheduleAtAttribute($value)
    {
        if ($value && is_string($value)) {
            try {
                // Try to parse the date in d/m/Y H:i:s format
                $this->attributes['schedule_at'] = Carbon::createFromFormat('d/m/Y H:i:s', $value);
            } catch (\Exception $e) {
                // If that fails, try the default Carbon parse
                $this->attributes['schedule_at'] = Carbon::parse($value);
            }
        } else {
            $this->attributes['schedule_at'] = $value;
        }
    }
}
