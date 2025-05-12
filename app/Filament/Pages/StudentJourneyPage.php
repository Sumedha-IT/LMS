<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;

class StudentJourneyPage extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-map';
    protected static string $view = 'filament.pages.student-journey';
    protected static ?string $title = 'Student Journey';
    protected static ?string $slug = 'student-journey';
    protected static ?int $navigationSort = 1; // Position in the sidebar
    protected static ?string $navigationGroup = 'Learning';

    public function mount(): void
    {
        // Only allow students to access this page
        if (!Auth::user()->is_student) {
            redirect()->to('/administrator/dashboard');
        }
    }

    public static function shouldRegisterNavigation(): bool
    {
        return Auth::check() && Auth::user()->is_student;
    }
}
