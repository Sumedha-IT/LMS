<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;

class AnnouncementsPage extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-megaphone';
    protected static ?string $navigationLabel = 'Announcements';
    protected static ?string $title = 'Announcements';
    protected static ?string $slug = 'student-announcements';
    protected static ?int $navigationSort = 2; // Position in the sidebar
    protected static ?string $navigationGroup = 'Communication';


    protected static string $view = 'filament.pages.announcements-page';

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
