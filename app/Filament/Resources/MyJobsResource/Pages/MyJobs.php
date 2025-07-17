<?php

namespace App\Filament\Resources\MyJobsResource\Pages;

use App\Filament\Resources\MyJobsResource;
use Filament\Resources\Pages\Page;

class MyJobs extends Page
{
    protected static string $resource = MyJobsResource::class;

    protected static string $view = 'filament.resources.my-jobs-resource.pages.my-jobs';
}
