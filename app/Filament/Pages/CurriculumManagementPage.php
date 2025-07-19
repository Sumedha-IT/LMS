<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Filament\Support\Enums\MaxWidth;
use Illuminate\Support\Facades\Auth;

class CurriculumManagementPage extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-academic-cap';
    protected static ?string $navigationLabel = 'Curriculum Management';
    protected static ?string $title = '';
    protected static ?string $slug = 'curriculum-management';
    protected static ?int $navigationSort = 2;

    protected static string $view = 'filament.pages.curriculum-management';

    public function mount(): void
    {
        // Only allow admins and coordinators to access this page
        if (!Auth::user()->is_admin && !Auth::user()->is_coordinator) {
            redirect()->to('/administrator/dashboard');
        }
    }

    public static function shouldRegisterNavigation(): bool
    {
        return Auth::check() && (Auth::user()->is_admin || Auth::user()->is_coordinator);
    }

    public function getMaxContentWidth(): MaxWidth
    {
        return MaxWidth::Full;
    }
} 