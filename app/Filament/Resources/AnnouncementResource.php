<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AnnouncementResource\Pages;
use App\Filament\Resources\AnnouncementResource\RelationManagers;
use App\Models\Announcement;
use App\Models\Course;
use Carbon\Carbon;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\HtmlString;
use Filament\Support\Enums\FontWeight;

class AnnouncementResource extends Resource
{
    protected static ?string $model = Announcement::class;

    protected static ?string $navigationIcon = 'heroicon-o-megaphone';
    protected static ?string $navigationGroup = 'Announcement';

    protected static bool $isScopedToTenant = false;

    public static function shouldRegisterNavigation(): bool
    {
        // Show in navigation for admin, academic coordinator, tutor, and placement coordinator users
        return auth()->check() && (auth()->user()->is_admin || auth()->user()->is_coordinator || auth()->user()->is_tutor || auth()->user()->is_placement_coordinator);
    }


    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make()
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\DateTimePicker::make('schedule_at')
                            ->native(false)
                            ->displayFormat('d/m/Y H:i:s')
                            ->format('d/m/Y H:i:s')
                            ->required(),
                        Forms\Components\Textarea::make('description')
                            ->required()
                            ->columnSpanFull(),
                        Forms\Components\FileUpload::make('image')
                            ->acceptedFileTypes(['image/*'])
                            ->columnSpanFull(),
                        Forms\Components\Radio::make('visibility')
                            ->label('Announcement visibility')
                            ->hidden(!(auth()->user()->is_admin || auth()->user()->is_coordinator || auth()->user()->is_tutor || auth()->user()->is_placement_coordinator))
                            ->options([
                                'existing_user' => 'Visible to existing users only',
                                'both' => 'Visible to both existing and new users in future'
                            ])
                            ->required(),
                        Forms\Components\Radio::make('audience')
                            ->label('Announcement audience')
                            ->options([
                                'all' => 'All Students',
                                'course_wise' => 'Course Wise'
                            ])
                            ->reactive()
                            ->hidden(!(auth()->user()->is_admin || auth()->user()->is_coordinator || auth()->user()->is_tutor || auth()->user()->is_placement_coordinator))
                            ->required(),
                        Forms\Components\Select::make('course_id')
                            ->label('Course')
                            ->options(function () {
                                if (auth()->user()->is_admin || auth()->user()->is_coordinator || auth()->user()->is_placement_coordinator) {
                                    return \App\Models\Course::all()->pluck('name', 'id');
                                } else if (auth()->user()->is_tutor) {
                                    // Only show courses assigned to the tutor's batches
                                    $batchCourseIds = auth()->user()->batches->pluck('course_id')->unique();
                                    return \App\Models\Course::whereIn('id', $batchCourseIds)->pluck('name', 'id');
                                }
                                return [];
                            })
                            ->preload()
                            ->hidden(fn(Forms\Get $get): bool => $get('audience') != 'course_wise' || !(auth()->user()->is_admin || auth()->user()->is_coordinator || auth()->user()->is_tutor || auth()->user()->is_placement_coordinator))
                            ->required(),
                        Forms\Components\Select::make('batch_ids')
                            ->label('Batches')
                            ->options(function (callable $get) {
                                $courseId = $get('course_id');
                                if (auth()->user()->is_admin || auth()->user()->is_coordinator || auth()->user()->is_placement_coordinator) {
                                    if ($courseId) {
                                        return \App\Models\Course::with('batches')->find($courseId)?->batches->pluck('name', 'id') ?? [];
                                    }
                                    return \App\Models\Batch::all()->pluck('name', 'id');
                                } else if (auth()->user()->is_tutor) {
                                    // Only show batches assigned to the tutor
                                    $batches = auth()->user()->batches;
                                    if ($courseId) {
                                        $batches = $batches->where('course_id', $courseId);
                                    }
                                    return $batches->pluck('name', 'id');
                                }
                                return [];
                            })
                            ->preload()
                            ->multiple()
                            ->hidden(fn(Forms\Get $get): bool => $get('audience') != 'course_wise' || !(auth()->user()->is_admin || auth()->user()->is_coordinator || auth()->user()->is_tutor || auth()->user()->is_placement_coordinator))
                            ->required()
                    ])->columns(2)
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')->height(100)->width(100),
                Tables\Columns\TextColumn::make('title')
                    ->description(fn(Announcement $record) => new HtmlString($record->description
                    . '<br>' .
                        (auth()->user()->is_admin || auth()->user()->is_coordinator || auth()->user()->is_tutor ?
                            ($record->schedule_at ?
                                (\Carbon\Carbon::parse($record->schedule_at)->format('d M Y h:i'))
                                : 'Not scheduled')
                            : ($record->schedule_at ?
                                (\Carbon\Carbon::parse($record->schedule_at)->format('d M Y'))
                                : 'Not scheduled')
                        )
                    ))
                    ->searchable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Infolists\Components\ImageEntry::make('image')
                    ->label(false)
                    //->width(100)
                    ->columnSpanFull(),
                Infolists\Components\TextEntry::make('title')
                    ->label(false)
                    ->weight(FontWeight::SemiBold)
                    ->columnSpanFull(),

                Infolists\Components\TextEntry::make('schedule_at')
                    ->label(false)
                    ->formatStateUsing(function (Announcement $record) {
                        return $record->schedule_at ?
                            \Carbon\Carbon::parse($record->schedule_at)->format('d M Y') :
                            'Not scheduled';
                    })
                    ->columnSpanFull(),
                Infolists\Components\TextEntry::make('description')
                    ->label(false)
                    ->columnSpanFull(),
            ])->columns(2);
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
            'index' => Pages\ListAnnouncements::route('/'),
            'create' => Pages\CreateAnnouncement::route('/create'),
            'edit' => Pages\EditAnnouncement::route('/{record}/edit'),
        ];
    }
}
