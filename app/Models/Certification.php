<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Certification extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'certification_name',
        'authority',
        'certification_date',
        'score',
        'certificate_number',
        'path'
    ];

    protected $casts = [
        'certification_date' => 'date',
        'score' => 'float'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 