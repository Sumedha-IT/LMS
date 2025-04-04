<?php


namespace App\Models;


use App\Models\User;
use App\Models\Topic;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
//use Illuminate\Database\Eloquent\Relations\Pivot;

class BatchCurriculum extends Model
{
    protected $table = 'batch_curriculum';

    protected $guarded = [];

    public function batch(): BelongsTo
    {
        return $this->belongsTo(Batch::class);
    }
    public function tutor()
    {
        return $this->belongsTo(User::class, 'tutor_id'); // Ensure this matches your column name
    }

    public function curriculum(): BelongsTo
    {
        return $this->belongsTo(Curriculum::class);
    }
    public function topics()
    {
        return $this->hasMany(BatchCurriculumTopic::class, 'batch_curriculum_id');
    }
}
