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
        'designation',
        'contact_email',
        'contact_phone',
        'address',
        // New fields
        'company_address',
        'city',
        'state',
        'country',
        'contact_person_name',
        'contact_email_new',
        'contact_number',
        'alternate_contact_number',
        'about_company',
        'linkedin_url',
        'social_media_links',
        'is_active',
    ];

    public function jobPostings()
    {
        return $this->hasMany(JobPosting::class);
    }
}
