<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceCheckinStandard extends Model
{
    use HasFactory;

    protected $fillable = [
        'check_in_starttime',
        'checkin_buffertime'
    ];

    protected $casts = [
        'check_in_starttime' => 'datetime'
    ];
} 