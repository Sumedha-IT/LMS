<?php

namespace App\Models;

use App\Models\DegreeType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Specialization extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'degree_type_id'];
    public function degreeType() {
        return $this->belongsTo(DegreeType::class);
    }
}
