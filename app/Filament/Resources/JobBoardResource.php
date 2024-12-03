<?php

namespace App\Filament\Resources;

use App\Filament\Resources\JobBoardResource\Pages;
use App\Filament\Resources\JobBoardResource\RelationManagers;
use App\Models\Job;
use App\Models\JobBoard;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class JobBoardResource extends Resource
{
    protected static ?string $model = Job::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $label = 'Apply Jobs';
    protected static ?string $navigationGroup = 'Job Panel';

    public static function shouldRegisterNavigation(): bool
    {
        if (auth()->check() && auth()->user()) {
            return (auth()->user()->getIsStudentAttribute());
        }
    
        // Return false if no user is logged in or role is not 'Student'
        return false;
    }
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                //
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                //
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\JobBoard::route('/'),
            // 'create' => Pages\CreateJobBoard::route('/create'),
            // 'edit' => Pages\EditJobBoard::route('/{record}/edit'),
        ];
    }
}
