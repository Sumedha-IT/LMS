<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Like;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index(Request $request)
{
    $user = $request->user();
    $userId=$user->id;

    $posts = Post::withCount(['likes', 'comments'])
        ->with('user:id,name,avatar_url')
        ->when($userId, function ($query) use ($userId) {
            $query->withExists(['likes as is_liked' => function ($query) use ($userId) {
                $query->where('user_id', $userId);
            }]);
        })
        ->get()
        ->map(function ($post) {
            return $this->formatPost($post);
        });

    return response()->json($posts);
}

    public function show(Request $request, $id)
    {
        $userId = $request->input('user_id');

        $post = Post::withCount(['likes', 'comments'])
            ->with('user:id,name,avatar_url')
            ->when($userId, function ($query) use ($userId) {
                $query->withExists(['likes as is_liked' => function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                }]);
            })
            ->findOrFail($id);

        return response()->json($this->formatPost($post));
    }

    public function getComments(Request $request)
    {
        $validatedData = $request->validate([
            'limit' => 'sometimes|integer|min:1|max:100',
            'start' => 'sometimes|integer|min:0',
            'post_id' => 'required|exists:posts,id',
        ]);

        $limit = $validatedData['limit'] ?? 20;
        $start = $validatedData['start'] ?? 0;

        $post = Post::findOrFail($validatedData['post_id']);

        $comments = Comment::where('post_id', $post->id)
            ->with('user:id,name,avatar_url')
            ->orderBy('created_at', 'desc')
            ->skip($start)
            ->take($limit)
            ->get()
            ->map(function ($comment) {
                return $this->formatComment($comment);
            });

        return response()->json([
            'post_id' => $post->id,
            'comments' => $comments,
        ]);
    }

    public function like(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'post_id' => 'required|exists:posts,id',
        ]);

        $post = Post::findOrFail($validatedData['post_id']);

        $like = Like::where([
            'user_id' => $validatedData['user_id'],
            'post_id' => $post->id,
        ])->first();

        if ($like) {
            $like->delete();
            $message = 'Post unliked successfully';
            $isLiked = false;
        } else {
            Like::create([
                'user_id' => $validatedData['user_id'],
                'post_id' => $post->id,
            ]);
            $message = 'Post liked successfully';
            $isLiked = true;
        }

        $likesCount = $post->likes()->count();

        return response()->json([
            'message' => $message,
            'is_liked' => $isLiked,
            'likes_count' => $likesCount
        ]);
    }

    public function comment(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'content' => 'required|string',
            'post_id' => 'required|exists:posts,id',
        ]);

        $post = Post::findOrFail($validatedData['post_id']);

        $comment = Comment::create([
            'user_id' => $validatedData['user_id'],
            'post_id' => $post->id,
            'content' => $validatedData['content'],
        ]);

        $comment->load('user:id,name,avatar_url');

        return response()->json($this->formatComment($comment), 201);
    }

    private function formatPost($post)
{
    return [
        'id' => $post->id,
        'content' => $post->content,
        'image' => $post->image ? url("storage/" . $post->image) : "",
        'user' => [
            'id' => $post->user->id,
            'name' => $post->user->name,
            'avatar_url' => $post->user->avatar_url ? url("storage/" . $post->user->avatar_url) : "",
        ],
        'likes_count' => $post->likes_count,
        'comments_count' => $post->comments_count,
        'is_liked' => $post->is_liked ?? false,
        'created_at' => $post->created_at,
        'updated_at' => $post->updated_at,
    ];
}

    private function formatComment($comment)
    {
        return [
            'id' => $comment->id,
            'content' => $comment->content,
            'created_at' => $comment->created_at,
            'user' => [
                'id' => $comment->user->id,
                'name' => $comment->user->name,
                'avatar_url' => $comment->user->avatar_url ? url("storage/" . $comment->user->avatar_url) : "",
            ],
        ];
    }
}