<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ExaminationResource\Pages;
use App\Filament\Resources\ExaminationResource\RelationManagers;
use App\Models\Examination;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Auth;

class ExaminationResource extends Resource
{
    protected static ?string $model = Examination::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';


    public static function getNavigationLabel(): string
    {
        return 'Exams'; // Custom label for clarity
    }

    public static function shouldRegisterNavigation(): bool
    {
        // Ensure there's a logged-in user
        if (Auth::check() && Auth::user()) {
            // Check if the user's role is 'Student' i.e role id = 6
            return (Auth::user()->getIsStudentAttribute());
        }
    
        // Return false if no user is logged in or role is not 'Student'
        return false;
    }

    public function mount()
    {
        // Apply middleware to this page only
        $this->middleware(['checkFeatureAcc']);

        parent::mount();
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
            'index' => Pages\ExamDashboard::route(''),
            'create' => Pages\ReviewExam::route('/user/{userId}/exam/{id}/review'),
            // 'edit' => Pages\EditExamination::route('/{record}/edit'),
        ];
    }
}
