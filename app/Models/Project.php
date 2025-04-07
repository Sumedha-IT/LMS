<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'role',
        'technologies',
        'project_url',
        'github_url',
        'start_date',
        'end_date',
        'is_ongoing',
        'team_size',
        'key_achievements',
        'project_type',
        'client_name',
        'organization'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_ongoing' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
