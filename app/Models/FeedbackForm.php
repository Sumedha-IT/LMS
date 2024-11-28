<?php

namespace App\Models;

use App\Services\BasicService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedbackForm extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'start_date', 'end_date', 'notify_users', 'form_source_link'];

    public function batches()
    {
        return $this->belongsToMany(Batch::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

}
