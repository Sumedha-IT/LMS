<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;

class QuestionBankPage extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static string $view = 'filament.pages.question-bank';
    protected static ?string $title = 'Question Bank';
    protected static ?string $slug = 'question-bank';
    protected static ?int $navigationSort = 3;

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