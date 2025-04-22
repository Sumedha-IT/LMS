<?php

namespace App\Models;

use Filament\Facades\Filament;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeachingMaterialStatus extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected static function booted(): void
    {
        $tenant = Filament::getTenant();
        static::addGlobalScope('limited', function (Builder $query)  use($tenant){
            if (auth()->check() && auth()->user()->is_student) {
                $query->where('user_id', auth()->user()->id);
            }
            if (auth()->check() && auth()->user()->is_tutor) {
                $query->select('teaching_material_statuses.*','batches.branch_id')
                    ->join('batch_user', 'teaching_material_statuses.user_id', '=', 'batch_user.user_id')
                    ->join('batch_curriculum', 'batch_user.batch_id', '=', 'batch_curriculum.batch_id')
                    ->join('batches', 'batches.id', '=', 'batch_user.batch_id')
                    ->where('batches.branch_id', $tenant->id)
                    ->where('batch_curriculum.tutor_id', auth()->user()->id)
                    ->groupBy('teaching_material_statuses.id','batches.branch_id');
            }
        });
    }

    public function teaching_material()
    {
        return $this->belongsTo(TeachingMaterial::class);
    }

    public function teaching_material_assignment()
    {
        return $this->belongsTo(TeachingMaterial::class, 'teaching_material_id', 'id')
            ->where('doc_type', 2);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function batch()
    {
        $tenant = Filament::getTenant();
        return $this->belongsTo(Batch::class)
            ->where('batches.branch_id', $tenant->id);
    }

    public function getFormattedObtainedMarksAttribute()
    {
        return $this->obtained_marks;
    }
    public function teachingMaterial()
    {
        return $this->belongsTo(TeachingMaterial::class, 'teaching_material_id', 'id');
    }
}
