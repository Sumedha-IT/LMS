<?php

namespace App\Filament\Resources\ExaminationResource\Pages;

use App\Filament\Resources\ExaminationResource;
use Filament\Resources\Pages\Page;

class ReviewExam extends Page
{
    protected static string $resource = ExaminationResource::class;

    protected static string $view = 'filament.resources.examination-resource.pages.review-exam';
}
