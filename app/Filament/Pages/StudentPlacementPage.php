<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;

class StudentPlacementPage extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-briefcase';
    protected static ?string $navigationLabel = 'Placement Center';
    protected static ?string $title = 'Student Placement Center';
    protected static ?string $slug = 'student-placement';
    protected static ?int $navigationSort = 3;

    protected static string $view = 'filament.pages.student-placement';

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

    public function getTitle(): string
    {
        return 'Student Placement Center';
    }
} 