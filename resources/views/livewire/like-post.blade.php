<div class="p-4">
    <div class="flex items-center mt-4 text-gray-500">
        <span class="">{{ $likesCount }} likes</span>
        <span class="ml-auto">{{ $commentsCount }} comments</span>
    </div>
    <div class="flex justify-around border-t p-4 text-gray-500">
        <button class="" wire:click="toggleLike">
            <img src="/images/like.svg" class="w-6 h-6">
            <span>{{ $liked ? 'Unlike' : 'Like' }}</span>
        </button>

        <button class="ml-auto" wire:click="showAllComments">
            <img src="/images/comment.svg" class="w-6 h-6">
            <span>Comments</span>
        </button>
    </div>
    @foreach ($comments->sortBy('created_at') as $comment)
        <div class="flex items-center p-4 border-b">
            <img
                class="w-10 h-10 rounded-full mx-3 ml-0"
                src="{{ $comment->user->avatar_image }}"
                alt="Profile Picture"
            />
            <div class="ml-3">
                <p class="text-gray-600 text-sm font-semibold">
                    <a href="{{ url('administrator/' . $tenantId . '/users/' . $comment->user->id) }}" class="text-blue-500 hover:underline">{{ $comment->user->name }}</a>
                </p>
                <p class="text-gray-600 text-sm">{!! $comment->content !!}</p> <!-- Updated to render HTML -->
                <p class="text-gray-400 text-xs">{{ $comment->formatted_published_time }}</p>
            </div>
        </div>
    @endforeach

    @if (!$showAllComments && $commentsCount > 2)
        <button wire:click="showAll">View more comments</button>
    @endif

    <div style="margin-top: 10px;" class="flex">
        <input type="text" wire:model="newComment" placeholder="Add a comment..."/>
        <button class="bg-primary-600 mx-3 px-1 ml-3 text-white button" wire:click="addComment">Post</button>
        @error('newComment') <span class="error">{{ $message }}</span> @enderror
    </div>
</div>
