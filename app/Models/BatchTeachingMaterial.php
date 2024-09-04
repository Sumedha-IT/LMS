<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TeachingMaterial;

class BatchTeachingMaterial extends Model
{
    use HasFactory;
    public function teachingMaterial()
    {
        return $this->belongsTo(TeachingMaterial::class);
    }
}
