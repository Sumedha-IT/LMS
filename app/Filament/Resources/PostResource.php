<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PostResource\Pages;
use App\Filament\Resources\PostResource\RelationManagers;
use App\Models\Post;
use Carbon\Carbon;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Pages\Page;
use Filament\Pages\SubNavigationPosition;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use App\Models\User;
use Filament\Forms\Components\Hidden;
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\Summarizers\Count;
use Illuminate\Support\HtmlString;

class PostResource extends Resource
{
    protected static ?string $model = Post::class;

    protected static ?string $navigationGroup = 'Timeline';
    protected static ?string $pluralLabel = 'Timeline';
    protected static ?string $navigationLabel = 'Timeline';

    protected static SubNavigationPosition $subNavigationPosition = SubNavigationPosition::Top;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {

        return $form
            ->schema([
                Forms\Components\Section::make()
                    ->schema([
                        Forms\Components\RichEditor::make('content')
                            ->disableToolbarButtons([
                                'attachFiles'
                            ])
                            ->required()
                            ->columnSpanFull(),
                        Forms\Components\DateTimePicker::make('publish_date')
                            ->default(Carbon::now())
                            ->required(),
                        Hidden::make('user_id')->default(fn() => auth()->id()),
                        Forms\Components\FileUpload::make('image')
                            ->maxSize(8192)
                            ->image()
                            ->required(),
                    ])
                    ->columns(1)
            ]);
    }

    public static function getRecordSubNavigation(Page $page): array
    {
        return $page->generateNavigationItems([
            Pages\ListPosts::class,
            Pages\EditPost::class,
            Pages\ManagePostComments::class,
            Pages\ManageLike::class,

        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')->square(),
                Tables\Columns\TextColumn::make('content')
                    ->limit(50)
                    ->html(true)
                    ->columnSpanFull(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Author')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('comments_count')
                    ->label('Comments')
                    ->counts('comments')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('likes_count')
                    ->label('Likes')
                    ->counts('likes')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('publish_date')
                    ->dateTime()
                    ->sortable(),
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
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\ViewAction::make(),

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
            // RelationManagers\CommentRelationManager::class,
            // RelationManagers\LikeRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPosts::route('/'),
            // 'create' => Pages\CreatePost::route('/create'),
            'edit' => Pages\EditPost::route('/{record}/edit'),
            'view' => Pages\ViewPost::route('/{record}'),
            'comments' => Pages\ManagePostComments::route('/{record}/comments'),
            'likes' => Pages\ManageLike::route('/{record}/likes'),
        ];
    }
}
