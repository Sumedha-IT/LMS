<?php

namespace App\Filament\Resources\FeedbackResource\Pages;

use App\Filament\Resources\FeedbackResource;
use Filament\Resources\Pages\Page;

class FeedbackPanel extends Page
{
    protected static string $resource = FeedbackResource::class;

    protected static string $view = 'filament.resources.feedback-resource.pages.feedback-panel';
}
