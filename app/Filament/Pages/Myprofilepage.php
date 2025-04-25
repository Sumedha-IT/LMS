<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;

class MyProfilePage extends Page
{
    protected static string $view = 'filament.pages.my-profile';

    protected static ?string $navigationIcon = 'heroicon-o-user';

    protected static ?string $navigationLabel = 'My Profile';

    protected static ?string $slug = 'my-profile';

    protected static ?int $navigationSort = 10;

    public static function shouldRegisterNavigation(): bool
    {
        return Auth::check() && Auth::user()->is_student;
    }

    public function mount(): void
    {
        // Only allow students to access this page
        if (!Auth::user()->is_student) {
            redirect()->to('/administrator/dashboard');
        }
    }

    public function getTitle(): string
    {
        return 'My Profile';
    }
}