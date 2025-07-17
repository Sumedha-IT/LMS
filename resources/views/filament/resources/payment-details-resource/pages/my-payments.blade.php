<x-filament-panels::page>
<div id="hello-react"></div>
    @viteReactRefresh()
    @include('layouts/react-vite')

    @if(isset($disableInteraction) && $disableInteraction) {{-- Replace $disableInteraction with your actual condition --}}
        <style>
            .fi-sidebar-item a {
                pointer-events: none; /* Disables click interaction */
                opacity: 0.5; /* Visually indicate that it is disabled */
            }
        </style>
    @endif
</x-filament-panels::page>
