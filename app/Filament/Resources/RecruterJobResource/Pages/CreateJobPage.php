<?php

namespace App\Filament\Resources\RecruterJobResource\Pages;

use App\Filament\Resources\RecruterJobResource;
use Filament\Resources\Pages\Page;

class CreateJobPage extends Page
{
    protected static string $resource = RecruterJobResource::class;

    protected static string $view = 'filament.resources.recruter-job-resource.pages.create-job-page';

    public static function getLabel(): ?string
    {
        return null; // Returning null removes the label.
    }
}
