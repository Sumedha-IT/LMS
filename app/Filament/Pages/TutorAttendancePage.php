<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;

class TutorAttendancePage extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-calendar';
    protected static ?string $navigationLabel = 'Attendance Management';
    protected static ?string $title = 'Attendance Management';
    protected static ?string $slug = 'tutor-attendance';
    protected static ?int $navigationSort = 3; // Position in the sidebar

    protected static string $view = 'filament.pages.tutor-attendance';

    public function mount(): void
    {
        // Only allow tutors to access this page
        if (!Auth::user()->is_tutor) {
            redirect()->to('/administrator/dashboard');
        }
    }

    public static function shouldRegisterNavigation(): bool
    {
        return Auth::check() && Auth::user()->is_tutor;
    }
}
