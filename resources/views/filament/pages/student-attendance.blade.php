<x-filament-panels::page>
    <div id="hello-react"></div>
    @viteReactRefresh()

    @if (session('message'))
    <script>
        window.flashMessage = "{{ session('message') }}";
    </script>
    @endif

    @include('layouts/react-vite')
</x-filament-panels::page>