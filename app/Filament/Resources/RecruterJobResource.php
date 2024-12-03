<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RecruterJobResource\Pages;
use App\Filament\Resources\RecruterJobResource\RelationManagers;
use App\Models\Job;
use App\Models\RecruterJob;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class RecruterJobResource extends Resource
{
    protected static ?string $model = Job::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function shouldRegisterNavigation(): bool
    {
        if (auth()->check() && auth()->user()) {
            return (auth()->user()->isRecruitor());
        }
    
        // Return false if no user is logged in or role is not 'Student'
        return false;
    }

    protected static ?string $label = 'Create Job';
    protected static ?string $navigationGroup = 'Job Panel';

    

    public static function getPages(): array
    {
        return [
            'index' => Pages\CreateJobPage::route('/'),
            // 'create' => Pages\CreateRecruterJob::route('/create'),
            // 'edit' => Pages\EditRecruterJob::route('/{record}/edit'),
        ];
    }
}
