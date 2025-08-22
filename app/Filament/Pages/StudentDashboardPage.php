<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;

class StudentDashboardPage extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-home';
    protected static string $view = 'filament.pages.student-dashboard';
    protected static ?string $title = 'Student Dashboard';
    protected static ?int $navigationSort = -2;

    public static function shouldRegisterNavigation(): bool
    {
        return Auth::check() && Auth::user()->is_student && !Auth::user()->is_placement_student;
    }

    public function mount(): void
    {
        // Only allow regular students to access this page, not placement students
        if (!Auth::user()->is_student || Auth::user()->is_placement_student) {
            redirect()->to('/administrator/dashboard');
        }
    }
}