<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;

class AdminPlacementPage extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-briefcase';
    protected static ?string $navigationLabel = 'Placement Management';
    protected static ?string $title = 'Placement Management';
    protected static ?string $slug = 'admin-placement';
    protected static ?int $navigationSort = 4;

    protected static string $view = 'filament.pages.admin-placement';

    public function mount(): void
    {
        // Only allow admin, coordinator, and tutor to access this page
        $user = Auth::user();
        $allowedRoles = ['Administrator', 'Academic Coordinator', 'Tutor'];
        
        if (!$user || !in_array($user->role->name, $allowedRoles)) {
            redirect()->to('/administrator/dashboard');
        }
    }

    public static function shouldRegisterNavigation(): bool
    {
        $user = Auth::user();
        $allowedRoles = ['Administrator', 'Academic Coordinator', 'Tutor'];
        
        return $user && $user->role && in_array($user->role->name, $allowedRoles);
    }

    public function getTitle(): string
    {
        return 'Placement Management';
    }
} 