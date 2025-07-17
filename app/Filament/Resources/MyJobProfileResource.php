<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MyJobProfileResource\Pages;
use App\Filament\Resources\MyJobProfileResource\RelationManagers;
use App\Models\JobProfile;
use App\Models\MyJobProfile;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class MyJobProfileResource extends Resource
{
    protected static ?string $model = JobProfile::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $label = 'Profile Details';
    protected static ?string $navigationGroup = 'Job Panel';

    public static function shouldRegisterNavigation(): bool
    {
        return false; // Temporarily hiding job profile menu item
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
            'index' => Pages\MyJobProfile::route('/'),
            // 'create' => Pages\CreateMyJobProfile::route('/create'),
            // 'edit' => Pages\EditMyJobProfile::route('/{record}/edit'),
        ];
    }
}
