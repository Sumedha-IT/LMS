<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BatchResource\Pages;
use App\Models\Batch;
use App\Models\Branch;
use App\Models\User;
use Awcodes\TableRepeater\Components\TableRepeater;
use Awcodes\TableRepeater\Header;
use BezhanSalleh\FilamentShield\Contracts\HasShieldPermissions;
use Filament\Forms;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Form;
use Filament\Pages\Page;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class BatchResource extends Resource implements HasShieldPermissions
{
    protected static ?string $model = Batch::class;

    protected static ?string $navigationIcon = 'icon-batches';

    protected static ?string $navigationGroup = 'Batches';

    public static function shouldRegisterNavigation(): bool
    {
        $user = auth()->user();
        return !$user->is_student && !$user->is_placement_student && ($user->is_admin || $user->is_coordinator || $user->is_tutor);
    }

    public static function getPermissionPrefixes(): array
    {
        return [
            'view',
            'view_any',
            'create',
            'update',
            'delete',
            'delete_any',
            'publish'
        ];
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Tabs::make('Tabs')
                    ->tabs([
                        Tabs\Tab::make('Details')
                            ->schema([
                                Forms\Components\Section::make()
                                    ->schema([
                                        Forms\Components\Select::make('team_id')
                                            ->label('Branch (Center)')
                                            ->relationship('branch', 'name')
                                            ->preload()
                                            ->required()
                                            ->afterStateUpdated(fn(callable $set) => $set('course_package_id', null))
                                            ->reactive(),
                                        Forms\Components\Select::make('course_package_id')
                                            ->relationship('course_package', 'name')
                                            ->searchable()
                                            ->preload()
                                            ->required(),
                                        Forms\Components\TextInput::make('name')
                                            ->label('Batch Name')
                                            ->required()
                                            ->maxLength(255),

                                        Forms\Components\Select::make('clone_from_batch_id')
                                            ->label('Clone Curriculum from Batch')
                                            ->options(Batch::all()->pluck('name', 'id'))
                                            ->searchable()
                                            ->live()
                                            ->dehydrated(false)
                                            ->afterStateUpdated(function ($state, callable $set) {
                                                if ($state) {
                                                    $batch = Batch::with('curriculums.topics')->find($state);
                                                    if ($batch) {
                                                        $curriculums = [];
                                                        foreach ($batch->curriculums as $curriculum) {
                                                            $topics = [];
                                                            foreach ($curriculum->topics as $topic) {
                                                                $topics[] = [
                                                                    'topic_id' => $topic->topic_id,
                                                                    'is_topic_started' => false,
                                                                    'topic_started_at' => null,
                                                                    'is_topic_completed' => false,
                                                                    'topic_completed_at' => null,
                                                                ];
                                                            }
                                                            $curriculums[] = [
                                                                'curriculum_id' => $curriculum->curriculum_id,
                                                                'tutor_id' => $curriculum->tutor_id,
                                                                'topics' => $topics,
                                                            ];
                                                        }
                                                        $set('curriculums', $curriculums);
                                                    }
                                                }
                                            }),

                                        TableRepeater::make('curriculums')
                                            ->relationship()
                                            ->headers([
                                                Header::make('curriculum_id')->label('Subject')->width('20%'),
                                                Header::make('tutor_id')->label('Tutor')->width('20%'),
                                                Header::make('topics')->label('Topics')->width('60%'),
                                            ])
                                            ->schema([
                                                Select::make('curriculum_id')
                                                    ->options(\App\Models\Curriculum::all()->pluck('name', 'id'))
                                                    ->label('Subject')
                                                    ->required()
                                                    ->disableOptionsWhenSelectedInSiblingRepeaterItems()
                                                    ->columnSpan(1),
                                                Select::make('tutor_id')
                                                    ->options(\App\Models\User::where('role_id', 7)->pluck('name', 'id'))
                                                    ->required()
                                                    ->label('Tutor')
                                                    ->columnSpan(1),
                                                Forms\Components\Repeater::make('topics')
                                                    ->relationship()
                                                    ->schema([
                                                        Forms\Components\Grid::make(1)
                                                            ->schema([
                                                                Select::make('topic_id')
                                                                    ->options(function (callable $get) {
                                                                        $curriculumId = $get('../../curriculum_id');
                                                                        if ($curriculumId) {
                                                                            return \App\Models\Topic::where('curriculum_id', $curriculumId)
                                                                                ->pluck('name', 'id');
                                                                        }
                                                                        return [];
                                                                    })
                                                                    ->label('Topic')
                                                                    ->required()
                                                                    ->disableOptionsWhenSelectedInSiblingRepeaterItems()
                                                                    ->extraAttributes(['class' => 'mb-4']),
                                                                Forms\Components\Grid::make(2)
                                                                    ->schema([
                                                                        Forms\Components\Toggle::make('is_topic_started')
                                                                            ->label('Started')
                                                                            ->default(false)
                                                                            ->required()
                                                                            ->live()
                                                                            ->afterStateUpdated(function ($state, callable $set) {
                                                                                if ($state) {
                                                                                    $set('topic_started_at', now()->toDateTimeString());
                                                                                } else {
                                                                                    $set('topic_started_at', null);
                                                                                }
                                                                            })
                                                                            ->extraAttributes(['class' => 'mt-2']),
                                                                        Forms\Components\DatePicker::make('topic_started_at')
                                                                            ->label('Started At')
                                                                            ->displayFormat('d/m/Y H:i')
                                                                            ->format('Y-m-d H:i:s')
                                                                            ->native(false)
                                                                            ->dehydrated()
                                                                            ->extraAttributes(['class' => 'mt-2']),
                                                                    ]),
                                                                Forms\Components\Grid::make(2)
                                                                    ->schema([
                                                                        Forms\Components\Toggle::make('is_topic_completed')
                                                                            ->label('Completed')
                                                                            ->default(false)
                                                                            ->live()
                                                                            ->afterStateUpdated(function ($state, callable $set) {
                                                                                if ($state) {
                                                                                    $set('topic_completed_at', now()->toDateTimeString());
                                                                                } else {
                                                                                    $set('topic_completed_at', null);
                                                                                }
                                                                            })
                                                                            ->extraAttributes(['class' => 'mt-2']),
                                                                        Forms\Components\DatePicker::make('topic_completed_at')
                                                                            ->label('Completed At')
                                                                            ->displayFormat('d/m/Y H:i')
                                                                            ->format('Y-m-d H:i:s')
                                                                            ->native(false)
                                                                            ->dehydrated()
                                                                            ->extraAttributes(['class' => 'mt-2']),
                                                                    ]),
                                                            ]),
                                                    ])
                                                    ->columns(1)
                                                    ->defaultItems(1)
                                                    ->addActionLabel('Add to topics')
                                                    ->itemLabel(fn (array $state): ?string => $state['topic_id'] ? \App\Models\Topic::find($state['topic_id'])?->name : null)
                                                    ->collapsible()
                                                    ->extraAttributes(['class' => 'mt-4']),
                                            ])
                                            ->columnSpanFull()
                                            ->defaultItems(3)
                                            ->addActionLabel('Add curriculum')
                                            ->collapsible(),
                                        Forms\Components\Select::make('manager_id')
                                            ->label('Branch Manager')
                                            ->options(function () {
                                                return User::where('role_id', 7)->pluck('name', 'id');
                                            })
                                            ->preload()
                                            ->required(),
                                        Forms\Components\DatePicker::make('start_date')
                                            ->displayFormat('d/m/Y')
                                            ->format('Y-m-d')
                                            ->required()
                                            ->disabled(fn () => auth()->user()->is_tutor),
                                        Forms\Components\DatePicker::make('end_date')
                                            ->label('End Date')
                                            ->displayFormat('d/m/Y')
                                            ->format('Y-m-d')
                                            ->required()
                                            ->disabled(fn () => auth()->user()->is_tutor),
                                    ])->columns(2),
                            ]),
                        Tabs\Tab::make('Advance Setting')
                            ->schema([
                                Forms\Components\Section::make()
                                    ->schema([
                                        Forms\Components\Toggle::make('allow_edit_class_time')
                                            ->label('Allow teacher to edit Class Time')
                                            ->columnSpanFull()
                                            ->required(),
                                        Forms\Components\Toggle::make('allow_edit_class_date')
                                            ->label('Allow teacher to edit Class Date')
                                            ->columnSpanFull()
                                            ->required()
                                    ])->hiddenOn('create')
                                    ->columns(2),
                            ])->hiddenOn('create')
                    ])->columnSpanFull()
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Batch Name')
                    ->description(fn(Batch $record) => "Admitted Students: " . $record->students->count())
                    ->weight(FontWeight::SemiBold)
                    ->searchable(),
                Tables\Columns\TextColumn::make('course_package.name')
                    ->sortable(),
                Tables\Columns\TextColumn::make('curriculums.curriculum.name')
                    ->listWithLineBreaks()
                    ->bulleted()
                    ->searchable(),
                Tables\Columns\TextColumn::make('start_end_date')
                    ->label('Start/End')
                    ->html(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Filter::make('start_date')
                    ->form([
                        Grid::make()
                            ->schema([
                                DatePicker::make('start_from'),
                                DatePicker::make('start_until'),
                            ])
                    ])
                    ->columnSpan(2)
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['start_from'],
                                fn(Builder $query, $date): Builder => $query->whereDate('start_date', '>=', $date),
                            )
                            ->when(
                                $data['start_until'],
                                fn(Builder $query, $date): Builder => $query->whereDate('start_date', '<=', $date),
                            );
                    }),
                SelectFilter::make('user')
                    ->label('Branch Manager')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload(),
            ], FiltersLayout::AboveContent)
            ->actions([
                Tables\Actions\ViewAction::make()
                    ->hidden(auth()->user()->is_tutor),
                Tables\Actions\EditAction::make()
                    ->label('Start Topics')
                    ->icon('heroicon-o-play')
                    ->color('success')
                    ->visible(fn (Batch $record): bool => auth()->user()->is_admin || auth()->user()->is_coordinator),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ])->hidden(!auth()->user()->is_admin),
            ]);
    }

    public static function getPages(): array
    {
        $pages =  [
            'index' => Pages\ListBatches::route('/'),
            'students' => Pages\ManageStundents::route('/{record}/students'),
            'syllabi' => Pages\ManageSyllabi::route('/{record}/syllabi'),
            'edit' => Pages\EditBatch::route('/{record}/edit'),
            'view' => Pages\ViewBatch::route('/{record}'),
        ];

        if(auth()->check() && auth()->user()->is_student)
        {
            unset($pages['edit']);
        }

        return $pages;
    }

    public static function getRecordSubNavigation(Page $page): array
    {
        return $page->generateNavigationItems([
            Pages\ViewBatch::class,
            Pages\EditBatch::class,
            Pages\ManageStundents::class,
            Pages\ManageSyllabi::class,
        ]);
    }
}