<?php

namespace App\Filament\Resources\MyJobProfileResource\Pages;

use App\Filament\Resources\MyJobProfileResource;
use Filament\Resources\Pages\Page;

class MyJobProfile extends Page
{
    protected static string $resource = MyJobProfileResource::class;

    protected static string $view = 'filament.resources.my-job-profile-resource.pages.my-job-profile';
}
