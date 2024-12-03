<?php

namespace App\Models;

use Filament\Facades\Filament;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\BatchTeachingMaterial;
use App\Models\TeachingMaterialStatus;

class TeachingMaterial extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'prerequisite' => 'boolean',
    ];

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function batches()
    {
        // $tenant = Filament::getTenant();
        // return $this->belongsToMany(Batch::class, 'batch_teaching_materials',
        //     'teaching_material_id', 'batch_id')
        //     ->wherePivot('batches.branch_id', $tenant->id);;

        $tenant = Filament::getTenant();
        return $this->belongsToMany(Batch::class, 'batch_teaching_materials',
            'teaching_material_id', 'batch_id')
            ->where('batches.branch_id', $tenant->id);
        
        // $tenant = Filament::getTenant();
        // return $this->belongsToMany(Batch::class, 'batch_teaching_materials',
        //     'teaching_material_id', 'batch_id')
        //     ->whereHas('batches', function($query) use ($tenant) {
        //         $query->where('branch_id', $tenant->id);
        //     });

    }


    public function batchTeachingMaterials()
    {
        return $this->hasMany(BatchTeachingMaterial::class);
    }

    public function teachingMaterialStatuses()
    {
        return $this->hasMany(TeachingMaterialStatus::class);
    }
}
