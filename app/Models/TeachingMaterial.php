<?php

namespace App\Models;

use App\Models\Batch;
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

    public function teachingMaterialStatuses()
    {
        return $this->hasMany(TeachingMaterialStatus::class, 'teaching_material_id', 'id');
    }

    public function topic()
    {
        return $this->belongsTo(Topic::class, 'topic_id', 'id');
    }
    public function batches()
    {
        return $this->belongsToMany(Batch::class, 'batch_teaching_materials');
    }

    protected static function booted()
    {
        static::saving(function ($model) {
            \Log::info('Saving TeachingMaterial', [
                'start_submission' => $model->start_submission,
                'stop_submission' => $model->stop_submission,
                'attributes' => $model->getAttributes(),
            ]);
        });
    }
}
