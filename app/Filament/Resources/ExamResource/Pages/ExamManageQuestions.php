<?php

namespace App\Filament\Resources\ExamResource\Pages;

use App\Filament\Resources\ExamResource;
use Filament\Resources\Pages\Page;

class ExamManageQuestions extends Page
{
    protected static string $resource = ExamResource::class;
    protected static string $view = 'filament.resources.exam-resource.pages.exam-manage-questions';

}
