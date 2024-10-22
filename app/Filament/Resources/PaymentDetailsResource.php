<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PaymentDetailsResource\Pages;
use App\Filament\Resources\PaymentDetailsResource\RelationManagers;
use App\Models\PaymentDetails;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Auth;


class PaymentDetailsResource extends Resource
{
    protected static ?string $model = PaymentDetails::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

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
            'index' => Pages\MyPayments::route('/'),
            // 'form' => Pages\ExamForm::route('/ExamForm'),
            // 'question' => Pages\ExamAddQuestion::route('/addquestion'),
            // 'questionbank' => Pages\ExamAddQuestionBank::route('/addquestionBank'),
            // 'managequestions' => Pages\ExamManageQuestions::route('/manageQuestions'),

        ];
    }
}
