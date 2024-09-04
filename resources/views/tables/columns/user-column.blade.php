<div style="display: flex; align-items: center;">
    <img src="{{ $getRecord()?->user?->avatar_url }}" alt="{{ $getRecord()?->user?->name }}" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;">
    <span>{{ $getRecord()->user?->name }}</span>
</div>

