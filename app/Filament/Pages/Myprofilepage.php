<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;

class MyProfilePage extends Page
{
    protected static string $view = 'filament.pages.my-profile';

    protected static ?string $navigationIcon = 'heroicon-o-user';

    protected static ?string $navigationLabel = 'My Profile';

    protected static ?string $slug = 'my-profile';

    protected static ?int $navigationSort = 10;

    public function getTitle(): string
    {
        return 'My Profile';
    }
}