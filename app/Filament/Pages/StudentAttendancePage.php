<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;

class StudentAttendancePage extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-calendar';
    protected static ?string $navigationLabel = 'Attendance';
    protected static ?string $title = 'Student Attendance';
    protected static ?string $slug = 'student-attendance';
    protected static ?int $navigationSort = 3; // Position in the sidebar

    protected static string $view = 'filament.pages.student-attendance';

    public function mount(): void
    {
        // Only allow regular students to access this page, not placement students
        if (!Auth::user()->is_student || Auth::user()->is_placement_student) {
            redirect()->to('/administrator/dashboard');
        }
    }

    public static function shouldRegisterNavigation(): bool
    {
        return Auth::check() && Auth::user()->is_student && !Auth::user()->is_placement_student;
    }
} 