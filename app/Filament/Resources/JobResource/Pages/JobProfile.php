<?php

namespace App\Filament\Resources\JobResource\Pages;

use App\Filament\Resources\JobResource;
use Filament\Resources\Pages\Page;

class JobProfile extends Page
{
    protected static string $resource = JobResource::class;

    protected static string $view = 'filament.resources.job-resource.pages.job-profile';
}
