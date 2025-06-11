<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;

class StudentManagementPage extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-academic-cap';
    protected static string $view = 'filament.pages.student-management';
    protected static ?string $title = 'Student Management';
    protected static ?string $slug = 'student-management';
    protected static ?int $navigationSort = 2;

    public function mount(): void
    {
        $user = Auth::user();
        $allowedRoles = ['Tutor', 'Academic Coordinator', 'Administrator'];
        
        // Check if user has any of the allowed roles
        if (!$user || !in_array($user->role->name, $allowedRoles)) {
            redirect()->to('/administrator/dashboard');
        }
    }

    public static function shouldRegisterNavigation(): bool
    {
        $user = Auth::user();
        $allowedRoles = ['Tutor', 'Academic Coordinator', 'Administrator'];
        
        return $user && $user->role && in_array($user->role->name, $allowedRoles);
    }
} 