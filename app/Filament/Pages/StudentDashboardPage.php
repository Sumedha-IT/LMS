<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;

class StudentDashboardPage extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-home';
    protected static string $view = 'filament.pages.student-dashboard';
    protected static ?string $title = 'Student Dashboard';
    protected static ?int $navigationSort = -2;
    
    public static function shouldRegisterNavigation(): bool
    {
        return true;
    }
}