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
    protected static ?int $navigationSort = 2;

    protected static string $view = 'filament.pages.student-placement';

    public function mount(): void
    {
        $user = Auth::user();
        
        // Allow students and placement students to access this page
        if (!$user->is_student && !$user->is_placement_student) {
            redirect()->to('/administrator/dashboard');
        }
    }

    public function getViewData(): array
    {
        $user = Auth::user();
        
        // If user doesn't have placement center access, show error message
        if (!$user->placement_center_access) {
            return [
                'showError' => true,
                'errorMessage' => 'You are not eligible for placement center access. Please contact your administrator to enable this feature.'
            ];
        }
        
        return [
            'showError' => false
        ];
    }

    public static function shouldRegisterNavigation(): bool
    {
        $user = Auth::user();
        return Auth::check() && ($user->is_student || $user->is_placement_student);
    }

    public function getTitle(): string
    {
        return 'Student Placement Center';
    }
} 