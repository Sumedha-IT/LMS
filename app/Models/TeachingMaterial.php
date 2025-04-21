<?php

namespace App\Models;

use App\Models\Topic;
use Filament\Facades\Filament;
use App\Models\BatchTeachingMaterial;
use App\Models\TeachingMaterialStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TeachingMaterial extends Model
{
    protected $fillable = [
        'topic_id',
        'section_id',
        'name',
        'description',
        'material_source',
        'content',
        'file',
        'doc_type',
        'start_submission',
        'stop_submission'
    ];

    protected $casts = [
        'start_submission' => 'datetime:Y-m-d H:i:s',
        'stop_submission' => 'datetime:Y-m-d H:i:s'
    ];
}
