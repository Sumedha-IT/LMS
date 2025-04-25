<?php

// namespace App\Filament\Pages;

// use App\Models\Post;
// use Filament\Pages\Page;
// use Illuminate\Support\Facades\Auth;
// use Carbon\Carbon;

// class Timeline extends Page
// {
//     protected static ?string $navigationIcon = 'heroicon-o-document-text';

//     protected static string $view = 'filament.pages.timeline';

//     public $posts;

//     public function mount()
//     {
//         $this->posts = Post::where('publish_date', '<=', Carbon::now())->orderBy('publish_date', 'desc')->get();
//     }

//     public function toggleLike($post_id)
//     {
//         $user = Auth::user();

//         $post = Post::find($post_id);

//         if ($post->likes()->where('user_id', $user->id)->exists()) {
//             $post->likes()->where('user_id', $user->id)->delete();
//         } else {
//             $post->likes()->create(['user_id' => $user->id]);
//         }

//         $this->posts = Post::paginate(10);
//     }

// }
