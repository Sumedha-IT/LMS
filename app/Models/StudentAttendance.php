<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentAttendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'check_in_datetime',
        'check_out_datetime',
        'status'
    ];

    protected $casts = [
        'check_in_datetime' => 'datetime',
        'check_out_datetime' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 