<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $table = 'companies';

    protected $fillable = [
        'name',
        'description',
        'website',
        'logo_path',
        'industry',
        'company_size',
        'contact_person',
        'contact_email',
        'contact_phone',
        'address',
        'is_active',
    ];

    public function jobPostings()
    {
        return $this->hasMany(JobPosting::class);
    }
}
