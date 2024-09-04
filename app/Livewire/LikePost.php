<?php

namespace App\Livewire;

use App\Models\Comment;
use Livewire\Component;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Filament\Facades\Filament;

class LikePost extends Component
{
    public $postId;
    public $likesCount;
    public $commentsCount;
    public $liked;
    public $showCount = true;
    public $comments;
    public $showAllComments = false;
    public $newComment = '';
    public $tenantId = '';

    public function mount($postId, $showCount = true)
    {
        $this->postId = $postId;
        $post = Post::find($postId);
        $this->likesCount = $post->likes()->count();
        $this->commentsCount = $post->comments()->count();
        $this->liked = $post->likes()->where('user_id', Auth::id())->exists();
        $this->showCount = $showCount;
        $this->comments = $post->comments()->latest()->take(2)->get();
        $this->tenantId = Filament::getTenant()->id;
    }

    public function toggleLike()
    {
        $post = Post::find($this->postId);
        $user = Auth::user();

        if ($this->liked) {
            $post->likes()->where('user_id', $user->id)->delete();
            $this->likesCount--;
        } else {
            $post->likes()->create(['user_id' => $user->id]);
            $this->likesCount++;
        }

        $this->liked = !$this->liked;
    }

    public function showAll()
    {
        $this->showAllComments = true;
        $this->comments = Comment::where('post_id',$this->postId)->get();
        $this->commentsCount == $this->comments->count();
    }

    public function addComment()
    {
        $this->validate([
            'newComment' => 'required|string|max:255',
        ]);

        $comment = Comment::create([
            'post_id' => $this->postId,
            'user_id' => Auth::id(),
            'content' => $this->newComment,
        ]);

        $this->newComment = '';
        $this->commentsCount++;
        $this->comments = Post::find($this->postId)->comments()->latest()->take($this->showAllComments ? null : 2)->get();
    }

    public function render()
    {
        return view('livewire.like-post',['tenantId' => $this->tenantId]);
    }
}

