<x-filament-panels::page>

    <style>
        .dropdown-content {
            display: none;
            position: absolute;
            background-color: #f1f1f1;
            min-width: 160px;
            overflow: auto;
            box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
            z-index: 1;
        }

        .dropdown-content a {
            color: black;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
        }

        .dropdown a:hover {
            background-color: #ddd;
        }

        .show {
            display: block;
        }
    </style>
    @foreach($posts as $post)
        <div class="bg-white rounded-lg shadow-md max-w-2xl mx-auto">
            <div class="flex items-center p-4 border-b">
                <img
                    class="w-10 h-10 rounded-full"
                    src="{{ $post->user->avatar_image }}"
                    alt="Profile Picture"
                />
                <div class="ml-3" style="margin-left: 20px;">
                    <p class="font-bold text-orange-500">{{ $post->user->name }}</p>
                    <p class="text-gray-400 text-xs">{{ $post->formatted_published_time }}</p>
                </div>
{{--                <div class="ml-auto">--}}
{{--                    <button class="text-gray-500 dropdown relative inline-block" onclick="myFunction()">--}}
{{--                        <svg--}}
{{--                            xmlns="http://www.w3.org/2000/svg"--}}
{{--                            class="h-6 w-6 dropbtn"--}}
{{--                            fill="none"--}}
{{--                            viewBox="0 0 24 24"--}}
{{--                            stroke="currentColor"--}}
{{--                        >--}}
{{--                            <path--}}
{{--                                stroke-linecap="round"--}}
{{--                                stroke-linejoin="round"--}}
{{--                                stroke-width="2"--}}
{{--                                d="M6 12h.01M12 12h.01M18 12h.01M6 12h.01M12 12h.01M18 12h.01"--}}
{{--                            />--}}
{{--                        </svg>--}}
{{--                    </button>--}}
{{--                    <div class="dropdown">--}}
{{--                        <div id="myDropdown" class="dropdown-content">--}}
{{--                            <a>Edit</a>--}}
{{--                            <a>Delete</a>--}}
{{--                        </div>--}}
{{--                    </div>--}}
{{--                </div>--}}
            </div>
            <div class="p-4">
                <img
                    class="w-full rounded-lg"
                    src="{{ url($post->image_url) }}"
                    alt="Post Image"
                />
                <p class="text-gray-700 mt-4">
                    {!! Str::limit($post->content, 100) !!}
                    <span class="full-text" style="display: none;">
                        {!! substr($post->content, 100) !!}
                    </span>
                    <a href="javascript:void(0);" class="read-more" data-id="{{ $post->id }}" style="display: none;">Read
                        more...</a>
                    <a href="javascript:void(0);" class="read-less" data-id="{{ $post->id }}" style="display: none;">Read
                        less</a>


                    {{--                    {{ $post->content }}<a href="#" class="text-orange-500 font-semibold"--}}
                    {{--                    >read more</a--}}
                    {{--                    >--}}
                </p>
                {{--<div class="flex items-center mt-4 text-gray-500">
--}}{{--                    <span>{{ $post->likes->count() }} likes</span>--}}{{--
                    @livewire('like-post', ['postId' => $post->id, 'showCount' => true])
                    <span class="ml-auto">{{ $post->comments->count() }} comments</span>
                </div>--}}
            </div>
            @livewire('like-post', ['postId' => $post->id,  'showCount' => false])
{{--            <div class="flex justify-around border-t p-4 text-gray-500">--}}
{{--                <button class="flex items-center space-x-2">--}}
{{--                    <img src="/images/like.svg" class="w-6 h-6">--}}
{{--                    </svg>--}}
{{--                    <span>Like</span>--}}
{{--                </button>--}}
{{--                <button wire:click="\$dispatch('toggleLike({{ $post->id }})')">--}}
{{--                <button wire:click="toggleLike({{ $post->id }})">--}}
{{--                    <img src="/images/like.svg" class="w-6 h-6"></svg>--}}
{{--                    {{ auth()->user() && $post->likes()->where('user_id', auth()->user()->id)->exists() ? 'Unlike' : 'Like' }}--}}
{{--                </button>--}}
{{--                @livewire('like-post', ['postId' => $post->id,  'showCount' => false])--}}

{{--                <button class="flex items-center space-x-2">--}}
{{--                    <img src="/images/comment.svg" class="w-6 h-6">--}}
{{--                    <span>Comment</span>--}}
{{--                </button>--}}
{{--            </div>--}}
        </div>
    @endforeach

    <script>

        function myFunction() {
            document.getElementById("myDropdown").classList.toggle("show");
        }

        window.onclick = function (event) {
            if (!event.target.matches('.dropbtn')) {
                var dropdowns = document.getElementsByClassName("dropdown-content");
                var i;
                for (i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        }

        document.addEventListener('DOMContentLoaded', function () {
            const readMoreLinks = document.querySelectorAll('.read-more');
            const readLessLinks = document.querySelectorAll('.read-less');

            readMoreLinks.forEach(link => {
                link.addEventListener('click', function () {
                    const id = this.getAttribute('data-id');
                    document.querySelector(`#desc-${id} .full-text`).style.display = 'inline';
                    this.style.display = 'none';
                    document.querySelector(`#desc-${id} .read-less`).style.display = 'inline';
                });
            });

            readLessLinks.forEach(link => {
                link.addEventListener('click', function () {
                    const id = this.getAttribute('data-id');
                    document.querySelector(`#desc-${id} .full-text`).style.display = 'none';
                    this.style.display = 'none';
                    document.querySelector(`#desc-${id} .read-more`).style.display = 'inline';
                });
            });
        });
    </script>

</x-filament-panels::page>
