<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TeachingMaterialStatusResource\Pages;
use App\Filament\Resources\TeachingMaterialStatusResource\RelationManagers;
use App\Models\Batch;
use App\Models\TeachingMaterialStatus;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Enums\FiltersLayout;
use Illuminate\Validation\ValidationException;

class TeachingMaterialStatusResource extends Resource
{
    protected static ?string $model = TeachingMaterialStatus::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static bool $isScopedToTenant = false;

    protected static ?string $navigationGroup = 'Curriculum';

    protected static ?string $pluralLabel = 'Assignments';
    protected static ?string $label = 'Assignment';


    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('user_id')
                    ->required()
                    ->numeric(),
                Forms\Components\TextInput::make('teaching_material_id')
                    ->required()
                    ->numeric(),
                Forms\Components\TextInput::make('batch_id')
                    ->required()
                    ->numeric(),
                Forms\Components\TextInput::make('file')
                    ->maxLength(255),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->description(fn(TeachingMaterialStatus $record) => $record->user->email)
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('teaching_material.name')
                    ->label('Assignment')
                    ->description(fn(TeachingMaterialStatus $record) => "Max Marks: ".$record->teaching_material->maximum_marks)
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('batch.name')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('formatted_obtained_marks')
                    ->label('Obtained Marks')
                    ->visible(fn() => auth()->user()->is_student)
                    ->sortable(),
                Tables\Columns\TextInputColumn::make('obtained_marks')
                    ->beforeStateUpdated(function ($state, $record) {
                        $maxMarks = $record->teaching_material->maximum_marks;
                        if ($state > $maxMarks) {
                            Notification::make()
                                ->title('Validation Error')
                                ->body("Obtained marks cannot exceed the maximum marks of $maxMarks.")
                                ->danger()
                                ->send();

                            // Prevent the update by throwing a ValidationException
                            throw ValidationException::withMessages([
                                'obtained_marks' => "Obtained marks cannot exceed the maximum marks of $maxMarks."
                            ]);
                            return false;
                            // Prevent the update by throwing an exception
                            //throw new \Exception("Obtained marks cannot exceed the maximum marks of $maxMarks.");
                        }
                    })
                    ->afterStateUpdated(function () {
                        Notification::make()
                            ->success()
                            ->title('Marks Updated Successfully')
                            ->send();
                    })
                    ->visible(fn() => !auth()->user()->is_student)
                    ->searchable(),

//                Tables\Columns\TextColumn::make('file')
//                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //Tables\Filters\TrashedFilter::make(),
                SelectFilter::make('batch')
                    ->label('Batch')
                    ->relationship('batch','name')
//                    ->options(function () {
//                        $tenant = Filament::getTenant();
//                        if ($tenant) {
//                            //dd($tenant,$tenant->batches()->pluck('name','id'));
//                            return $tenant->branch_batches()->pluck('name', 'id')->toArray();
//                        }
//                        return Batch::all()->pluck('name', 'id')->toArray();
//                    })
                    ->searchable()
                    ->preload(),
                SelectFilter::make('teaching_material_id')
                    ->label('Assignment')
                    ->relationship('teaching_material_assignment', 'name')
                    ->searchable()
                    ->preload(),
            ], FiltersLayout::AboveContent)
            ->actions([
                Tables\Actions\Action::make('download')
                    ->label('Download')
                    ->url(fn (TeachingMaterialStatus $record): string => url('storage/' . $record->file))
                    ->openUrlInNewTab()->extraAttributes(['download'=>true]),
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
            'index' => Pages\ListTeachingMaterialStatuses::route('/'),
            //'create' => Pages\CreateTeachingMaterialStatus::route('/create'),
            //'edit' => Pages\EditTeachingMaterialStatus::route('/{record}/edit'),
        ];
    }
}
