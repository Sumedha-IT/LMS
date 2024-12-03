<?php

namespace App\Filament\Resources\JobBoardResource\Pages;

use App\Filament\Resources\JobBoardResource;
use Filament\Resources\Pages\Page;

class JobBoard extends Page
{
    protected static string $resource = JobBoardResource::class;

    protected static string $view = 'filament.resources.job-board-resource.pages.job-board';
}
