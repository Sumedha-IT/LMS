<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = "certificates";

    protected $casts = [
        'is_resume' => 'boolean',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
