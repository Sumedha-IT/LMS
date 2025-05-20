<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;

class AdminAttendancePage extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-calendar';
    protected static ?string $navigationLabel = 'Attendance Management';
    protected static ?string $title = 'Attendance Management';
    protected static ?string $slug = 'admin-attendance';
    protected static ?int $navigationSort = 3; // Position in the sidebar

    protected static string $view = 'filament.pages.admin-attendance';

    public function mount(): void
    {
        // Only allow admins to access this page
        if (!Auth::user()->is_admin) {
            redirect()->to('/administrator/dashboard');
        }
    }

    public static function shouldRegisterNavigation(): bool
    {
        return Auth::check() && Auth::user()->is_admin;
    }
} 