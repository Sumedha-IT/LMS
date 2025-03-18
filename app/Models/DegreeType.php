<?php

namespace App\Models;

use App\Models\Specialization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DegreeType extends Model
{
    use HasFactory;
    protected $fillable = ['name'];
    public function specializations() {
        return $this->hasMany(Specialization::class);
    }
    
}
