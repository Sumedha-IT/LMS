<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FeedbackResource\Pages;
use App\Models\Feedback;
use App\Models\FeedbackForm;
use Filament\Forms;
use Filament\Forms\Components\Livewire;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Actions\Action;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class FeedbackResource extends Resource
{
    protected static ?string $model = FeedbackForm::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

  
    public static function shouldRegisterNavigation(): bool
    {
        // Check if there’s a logged-in user with a 'Student' role
        if (auth()->check() && auth()->user()) {
            return auth()->user()->getIsStudentAttribute();
        }
    
        return false;
    }

    public static function form(Form $form): Form
    {
        // The form is intentionally left empty, as users shouldn't be able to create or edit feedback entries
        return $form->schema([]);
    }

    public static function table(Table $table): Table
    {

        $today = now()->toDateString();
        $dbName = config('database.connections.mysql.database');
        $formIds = [];
        if (auth()->check() && auth()->user()) {
            $batchIds = auth()->user()->batches()->get()->pluck('id')->toArray();
            $formIds =DB::select(" SELECT feedback_form_id from ".$dbName.".batch_feedback_form where batch_id in (". implode(',',$batchIds) .") ");
            $formIds = collect($formIds)->pluck('feedback_form_id')->unique()->toArray();
        }
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')  // Ensure this is the correct column name in your model
                    ->label('Form Name')
                    ->sortable()
                    ->searchable(),
            ])->modifyQueryUsing(function (Builder $query) use ($today,$formIds){

                $query->whereIn('id',$formIds)->where('start_date', '<=', $today)
                ->where('end_date', '>=', $today);
            })
          
            ->actions([
                Action::make('viewForm')
                ->label('Fill Form')
                ->icon('heroicon-o-eye')
                ->modalWidth('4xl')
                ->modalContent(fn (FeedbackForm $record) => 
                    view('components.iframe', [
                        'src' => $record->form_source_link,
                    ]))
                ->modalFooterActions([])

            ])
 
            ->bulkActions([]);
    }
    

    protected function getTableQuery(): Builder
    {
        $today = now()->toDateString();

        return parent::getTableQuery()
            ->where(function (Builder $query) use ($today) {
                $query->where('start_date', '>', $today)
                    ->where('end_date', '<', $today);
            });
    }

    protected  static function getBatchIds($user)
    {
       
        return null;
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFeedback::route('/'),
        ];
    }

    public static function canCreate(): bool
    {
        // Disable the creation of new feedback entries
        return false;
    }

    
}
