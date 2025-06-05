<?php

namespace App\Filament\Resources;

use App\Filament\Exports\QuestionExporter;
use App\Filament\Resources\QuestionResource\Pages;
use App\Filament\Resources\QuestionResource\RelationManagers;
use App\Models\Question;
use App\Models\QuestionBank;
use App\Models\QuestionOption;
use Awcodes\TableRepeater\Components\TableRepeater;
use Awcodes\TableRepeater\Header;
use Filament\Forms;
use Filament\Forms\Components\Select;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Support\Enums\FontWeight;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\HtmlString;

class QuestionResource extends Resource
{
    protected static ?string $model = Question::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static bool $isScopedToTenant = false;
    protected static bool $shouldRegisterNavigation = false;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Hidden::make('question_bank_id')
                    ->default(request('question_bank_id'))
                    ->required(),
                Forms\Components\Section::make('Add Paragraph')
                    ->schema([
                        Forms\Components\FileUpload::make('audio_file'),
                        Forms\Components\RichEditor::make('paragraph')
                            ->hintIcon('heroicon-m-question-mark-circle', tooltip: 'Paragraph can be added for comprehension type questions where the question(s) have to be answered based on the information provided in the paragraph.')
                    ])->columns(2)
                    ->collapsible(true)
                    ->collapsed(),
                Forms\Components\Section::make()
                    ->schema([
                        Forms\Components\RichEditor::make('question')
                            ->required(),
                        Forms\Components\Group::make()
                            ->schema([
                                Forms\Components\Select::make('question_type')
                                    ->label('Question Type')
                                    ->relationship('question_bank_type', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->reactive()
                                    ->createOptionForm([
                                        Forms\Components\TextInput::make('name')
                                            ->required(),
                                    ])
                                    ->default((request('question_bank_id') &&
                                        QuestionBank::find(request('question_bank_id')))
                                        ? QuestionBank::find(request('question_bank_id'))->question_bank_type_id
                                        : '')
                                    ->required(),
//                                    ->options([
//                                        'MCQ - Single Correct' => 'MCQ - Single Correct',
//                                        'MCQ - Multiple Correct' => 'MCQ - Multiple Correct',
//                                        'Fill In The Correct' => 'Fill In The Correct',
//                                        'Subjective' => 'Subjective',
//                                        'True/False' => 'True/False',
//                                        'English Transcription' => 'English Transcription',
//                                    ])
                                Forms\Components\Placeholder::make('difficulty')
                                    ->content((request('question_bank_id') &&
                                        QuestionBank::find(request('question_bank_id')))
                                        ? QuestionBank::find(request('question_bank_id'))->formatted_difficulty
                                        : '')
                                    ->extraAttributes(['class' => 'inline-html-field']),
                                Forms\Components\Placeholder::make('topic')
                                    ->content((request('question_bank_id') &&
                                        QuestionBank::find(request('question_bank_id')))
                                        ? QuestionBank::find(request('question_bank_id'))->question_bank_chapter
                                        : '')
                                    ->extraAttributes(['class' => 'inline-html-field']),
//                                Forms\Components\Select::make('difficulty')
//                                    ->options([
//                                        'Beginner' => 'Beginner',
//                                        'Intermediate' => 'Intermediate',
//                                        'Difficult' => 'Difficult'
//                                    ])
//                                    ->required(),
//                                Forms\Components\TextInput::make('topic')
//                                    ->required()
//                                    ->maxLength(255),
                            ]),
                        Forms\Components\Group::make()
                            ->schema([
                                Forms\Components\TextInput::make('marks')
                                    ->required()
                                    ->numeric(),
                                Forms\Components\TextInput::make('negative_marks')
                                    ->required()
                                    ->numeric()
                                    ->hidden(fn(Forms\Get $get): bool => $get('question_type') == 4)
                                    ->default(0),
                            ])->columns(2),
                        Forms\Components\TextInput::make('answer')
                            ->columnSpanFull()
                            ->hidden(fn(Forms\Get $get): bool => $get('question_type') != 3)
                            ->helperText(new HtmlString("Separate all the possible answers by '|'. For eg., if both 'Tamil Nadu' and 'TN' are correct, then write it as 'Tamil Nadu | TN'")),

                        Forms\Components\Group::make()
                            ->schema([
                                Forms\Components\Checkbox::make('check_capitalization'),
                                Forms\Components\Checkbox::make('check_punctuation')
                            ])
                            ->columns(4)
                            ->columnSpanFull()
                            ->hidden(fn(Forms\Get $get): bool => $get('question_type') != 6),

                        Forms\Components\Section::make('Options')
                            ->schema([
                                Forms\Components\Repeater::make('questions_options')
                                    ->schema([
                                        Forms\Components\RichEditor::make('option')
                                            ->label('Option Text')
                                            ->required()
                                            ->columnSpan(2),
                                        Forms\Components\Toggle::make('is_correct')
                                            ->label('Mark as Correct')
                                            ->helperText('Toggle to mark this as a correct answer')
                                            ->columnSpan(2)
                                            ->inline(false)
                                            ->onIcon('heroicon-m-check-circle')
                                            ->offIcon('heroicon-m-x-circle')
                                            ->onColor('success')
                                            ->offColor('danger')
                                            ->default(false)
                                            ->required()
                                            ->validationAttribute('correct answer')
                                    ])
                                    ->columns(2)
                                    ->defaultItems(4)
                                    ->minItems(2)
                                    ->maxItems(8)
                                    ->reorderable()
                                    ->reorderableWithButtons()
                                    ->reorderableWithDragAndDrop()
                                    ->hidden(fn(Forms\Get $get): bool => !in_array($get('question_type'), [1,2]))
                                    ->validationMessages([
                                        'min' => 'Please add at least 2 options',
                                        'max' => 'Maximum 8 options allowed',
                                    ])
                                    ->afterStateUpdated(function ($state, callable $set, callable $get) {
                                        // For single correct MCQ, ensure only one option is correct
                                        if ($get('question_type') == 1 && is_array($state)) {
                                            $correctCount = 0;
                                            $lastCorrectKey = null;
                                            
                                            foreach ($state as $key => $option) {
                                                if (isset($option['is_correct']) && $option['is_correct']) {
                                                    $correctCount++;
                                                    $lastCorrectKey = $key;
                                                }
                                            }
                                            
                                            // If more than one correct answer, keep only the last one
                                            if ($correctCount > 1) {
                                                foreach ($state as $key => $option) {
                                                    if ($key !== $lastCorrectKey) {
                                                        $set("questions_options.{$key}.is_correct", false);
                                                    }
                                                }
                                            }
                                        }
                                    })
                                    ->saveRelationshipsUsing(function (Model $record, $state) {
                                        // Validate that at least one option is marked as correct
                                        $hasCorrectAnswer = false;
                                        foreach ($state as $option) {
                                            if ($option['is_correct']) {
                                                $hasCorrectAnswer = true;
                                                break;
                                            }
                                        }
                                        
                                        if (!$hasCorrectAnswer) {
                                            throw new \Exception('At least one option must be marked as correct.');
                                        }
                                        
                                        // Delete existing options
                                        $record->questions_options()->delete();
                                        
                                        // Create new options
                                        foreach ($state as $option) {
                                            $record->questions_options()->create([
                                                'option' => $option['option'],
                                                'is_correct' => $option['is_correct'],
                                            ]);
                                        }
                                    }),
                            ])
                            ->collapsible()
                            ->collapsed(),

                        Forms\Components\Section::make('True/False Options')
                            ->schema([
                                Forms\Components\Repeater::make('questions_options')
                                    ->schema([
                                        Forms\Components\RichEditor::make('option')
                                            ->label('Option Text')
                                            ->required()
                                            ->columnSpan(2),
                                        Forms\Components\Toggle::make('is_correct')
                                            ->label('Mark as Correct')
                                            ->helperText('Toggle to mark this as a correct answer')
                                            ->columnSpan(2)
                                            ->inline(false)
                                            ->onIcon('heroicon-m-check-circle')
                                            ->offIcon('heroicon-m-x-circle')
                                            ->onColor('success')
                                            ->offColor('danger')
                                            ->default(false)
                                            ->required()
                                            ->validationAttribute('correct answer')
                                    ])
                                    ->columns(2)
                                    ->defaultItems(2)
                                    ->minItems(2)
                                    ->maxItems(2)
                                    ->reorderable()
                                    ->reorderableWithButtons()
                                    ->reorderableWithDragAndDrop()
                                    ->hidden(fn(Forms\Get $get): bool => $get('question_type') != 5)
                                    ->validationMessages([
                                        'min' => 'Please add exactly 2 options for True/False questions',
                                        'max' => 'Please add exactly 2 options for True/False questions',
                                    ])
                                    ->afterStateUpdated(function ($state, callable $set, callable $get) {
                                        // For True/False, ensure exactly one option is correct
                                        if (is_array($state)) {
                                            $correctCount = 0;
                                            $lastCorrectKey = null;
                                            
                                            foreach ($state as $key => $option) {
                                                if (isset($option['is_correct']) && $option['is_correct']) {
                                                    $correctCount++;
                                                    $lastCorrectKey = $key;
                                                }
                                            }
                                            
                                            // If more than one correct answer, keep only the last one
                                            if ($correctCount > 1) {
                                                foreach ($state as $key => $option) {
                                                    if ($key !== $lastCorrectKey) {
                                                        $set("questions_options.{$key}.is_correct", false);
                                                    }
                                                }
                                            }
                                        }
                                    })
                                    ->saveRelationshipsUsing(function (Model $record, $state) {
                                        // Validate that exactly one option is marked as correct for True/False
                                        $correctCount = 0;
                                        foreach ($state as $option) {
                                            if ($option['is_correct']) {
                                                $correctCount++;
                                            }
                                        }
                                        
                                        if ($correctCount !== 1) {
                                            throw new \Exception('True/False questions must have exactly one correct answer.');
                                        }
                                        
                                        // Delete existing options
                                        $record->questions_options()->delete();
                                        
                                        // Create new options
                                        foreach ($state as $option) {
                                            $record->questions_options()->create([
                                                'option' => $option['option'],
                                                'is_correct' => $option['is_correct'],
                                            ]);
                                        }
                                    }),
                            ])
                            ->collapsible()
                            ->collapsed(),

                        Forms\Components\Section::make('Hint and Explanation')
                            ->schema([
                                Forms\Components\RichEditor::make('hint')
                                    ->columnSpanFull(),
                                Forms\Components\RichEditor::make('explanation')
                                    ->columnSpanFull(),
                            ])->collapsible(true)
                            ->collapsed(),
                    ])
                    ->columns(2)
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\Layout\Split::make([
                    Tables\Columns\TextColumn::make('question')
                        ->description(fn(Question $record) => "Question: #" . $record->id, 'above')
                        ->columnSpan(4)
                        ->html(),
                    Tables\Columns\TextColumn::make('marks')
                        ->description('Mark', 'above')
                        ->prefix('+')
                        ->badge()
                        ->color('success')
                    ,
                    Tables\Columns\TextColumn::make('negative_marks')
                        ->description('Negative', 'above')
                        ->prefix('-')
                        ->badge()
                        ->color('danger'),

                    //->description(fn(Question $record) =>  $record->question),
//                    Tables\Columns\TextColumn::make('question_type')
//                        ->label('Batch Name')
//                        ->description(fn(Question $record) => "Admitted Students: " . $record->questions_options->count())
//                        ->weight(FontWeight::SemiBold)
//                        ->searchable(),
                ])->columnSpanFull(),
                Tables\Columns\Layout\Panel::make([
                    Tables\Columns\Layout\Split::make([
                        Tables\Columns\TextColumn::make('questions_options.option')
                            ->html()
                            ->listWithLineBreaks()
                            ->bulleted(),
                        Tables\Columns\TextColumn::make('questions_options.is_correct')
                            ->formatStateUsing(fn(string $state) => $state ? 'true' : 'false')
                            //->html()
                            ->listWithLineBreaks()
                    ]),
//                    Tables\Columns\TextColumn::make('difficulty')
//                        ->searchable(),
//                    Tables\Columns\TextColumn::make('topic')
//                        ->searchable(),
//
//                    Tables\Columns\TextColumn::make('created_at')
//                        ->dateTime()
//                        ->sortable()
//                        ->toggleable(isToggledHiddenByDefault: true),
//                    Tables\Columns\TextColumn::make('updated_at')
//                        ->dateTime()
//                        ->sortable()
//                        ->toggleable(isToggledHiddenByDefault: true),
                ])
                    ->columnSpan(3)
                    ->collapsible(),
            ])
//            ->headerActions([
//                Tables\Actions\ExportBulkAction::make()
//                    ->exporter(QuestionExporter::class)
//            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label(''),
                Tables\Actions\DeleteAction::make()->label(''),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ExportBulkAction::make()
                        ->exporter(QuestionExporter::class)
                ]),
            ]);
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->when(request('question_bank_id'), function (Builder $query) {
                $query->where('question_bank_id', request('question_bank_id'));
            });
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
            'index' => Pages\ListQuestions::route('/'),
            'create' => Pages\CreateQuestion::route('/create'),
            'edit' => Pages\EditQuestion::route('/{record}/edit'),
        ];
    }
}
