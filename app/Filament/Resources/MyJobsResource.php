<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MyJobsResource\Pages;
use App\Filament\Resources\MyJobsResource\RelationManagers;
use App\Models\JobStatus;
use App\Models\MyJobs;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class MyJobsResource extends Resource
{
    protected static ?string $model = JobStatus::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $label = 'My Jobs';
    protected static ?string $navigationGroup = 'Job Panel';

    public static function shouldRegisterNavigation(): bool
    {
        return false; // Temporarily hiding my jobs menu item
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
            'index' => Pages\MyJobs::route('/'),
        ];
    }
}
