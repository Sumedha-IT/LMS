<?php

namespace App\Models;

use App\Models\DegreeType;
use App\Models\Specialization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudentEducation extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'degree_type_id', 'specialization_id', 'other_specialization', 'percentage_cgpa', 'institute_name', 'location', 'duration_from', 'duration_to'];
    public function degreeType() {
        return $this->belongsTo(DegreeType::class);
    }
    public function specialization() {
        return $this->belongsTo(Specialization::class);
    }
}
