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

    protected static ?int $navigationSort = 1;

    public static function shouldRegisterNavigation(): bool
    {
        return Auth::check() && (Auth::user()->is_student || Auth::user()->is_placement_student);
    }

    public function mount(): void
    {
        // Allow students and placement students to access this page
        if (!Auth::user()->is_student && !Auth::user()->is_placement_student) {
            redirect()->to('/administrator/dashboard');
        }
    }

    public function getTitle(): string
    {
        return 'My Profile';
    }
}