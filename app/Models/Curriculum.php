<?php

namespace App\Models;

use App\Models\Topic;
use Filament\Facades\Filament;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Curriculum extends Model
{
    use HasFactory;

    protected $table = 'curriculum';

    protected $guarded = ['id'];

    public function branches()
    {
        return $this->belongsToMany(Branch::class, 'branch_curriculum',
            'curriculum_id', 'branch_id');
    }
    public function batches()
    {
        $tenant = Filament::getTenant();

        return $this->belongsToMany(Batch::class, 'batch_curriculum',
            'curriculum_id', 'batch_id')
            ->wherePivot('branch_id', $tenant->id)
            ->withPivot('tutor_id', 'topic_id', 'is_topic_completed');
    }
    public function topics()
    {
        return $this->hasMany(Topic::class);
    }

    /** @return MorphToMany<Course> */
    public function courses(): MorphToMany
    {
        return $this->morphedByMany(Course::class, 'curricula','curricula');
    }

//    public function batches(): MorphToMany
//    {
//        return $this->morphedByMany(Batch::class, 'curricula','curricula');
//    }

    /** @return MorphToMany<Course> */
    public function courseStudents(): MorphToMany
    {
        return $this->courses();
    }

    public function sections(): HasMany
    {
        return $this->hasMany(Section::class);
    }

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class);
    }

    public function team()
    {
        return $this->teams()->where('team_id', Filament::getTenant()->id);
    }
}
