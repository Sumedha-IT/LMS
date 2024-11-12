<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FeedbackFormResource\Pages;
use App\Filament\Resources\FeedbackFormResource\RelationManagers;
use App\Models\Batch;
use App\Models\FeedbackForm;
use Filament\Forms;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\BulkAction;
use Filament\Tables\Columns\BooleanColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;



class FeedbackFormResource extends Resource
{
    protected static ?string $model = FeedbackForm::class;

    protected static ?string $navigationIcon = 'heroicon-o-document';

    public static function shouldRegisterNavigation(): bool
    {
        // Check if there’s a logged-in user with a 'Student' role
        if (auth()->check() && auth()->user()) {
            return !auth()->user()->getIsStudentAttribute();
        }
    
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                    ->required()
                    ->label('Form Name'),
                DatePicker::make('start_date')
                    ->required()
                    ->label('Start Date'),
                DatePicker::make('end_date')
                    ->required()
                    ->label('End Date'),
                Toggle::make('notify_users')
                    ->label('Notify Users'),
                Select::make('batches')
                    ->multiple()
                    ->relationship('batches', 'name') // assuming batches have a 'name' field
                    ->options(Batch::all()->pluck('name', 'id')->toArray())
                    ->label('Select Batches'),
                TextInput::make('form_source_link')
                    ->label('Form Source Link')
                    ->url()
                    ->required()
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->label('Form Name')->sortable(),
                TextColumn::make('start_date')->sortable(),
                TextColumn::make('end_date')->sortable(),
                BooleanColumn::make('notify_users')->label('Notify Users'),
                TextColumn::make('form_source_link')->label('Form Source Link'),
            ])
            ->filters([]);
    }

    public static function getRelations(): array
    {
        return [];
    }

   

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFeedbackForms::route('/'),
            'create' => Pages\CreateFeedbackForm::route('/create'),
            'edit' => Pages\EditFeedbackForm::route('/{record}/edit'),
        ];
    }
}
