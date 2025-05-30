<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentDeviceRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'device_fingerprint',
        'device_name',
        'device_type',
        'device_info',
        'is_active',
        'last_used_at'
    ];

    protected $casts = [
        'device_info' => 'array',
        'is_active' => 'boolean',
        'last_used_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 