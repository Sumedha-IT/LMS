<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;

class AnnouncementsPage extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-megaphone';
    protected static ?string $navigationLabel = 'Announcements';
    protected static ?string $title = '';
    protected static ?string $slug = 'student-announcements';
    protected static ?int $navigationSort = 3; // Position in the sidebar


    protected static string $view = 'filament.pages.announcements-page';

    public function mount(): void
    {
        // Allow students and placement students to access this page
        if (!Auth::user()->is_student && !Auth::user()->is_placement_student) {
            redirect()->to('/administrator/dashboard');
        }
    }

    public static function shouldRegisterNavigation(): bool
    {
        return Auth::check() && (Auth::user()->is_student || Auth::user()->is_placement_student);
    }
}
