<x-filament-panels::page>

<style>
    /* Container to center and style the iframe */
    .iframe-container {
        width: 100%;
        max-width: 800px; /* Limit width for larger screens */
        margin: 0 auto;
        padding: 20px;
        box-sizing: border-box;
    }

    /* Styling for responsive iframe */
    .iframe-container iframe {
        width: 100%;
        height: 500px;
        border: none;
    }

    /* Optional: Make iframe height dynamic on smaller screens */
    @media (max-width: 768px) {
        .iframe-container iframe {
            height: 400px;
        }
    }

    @media (max-width: 480px) {
        .iframe-container iframe {
            height: 300px;
        }
    }
</style>


<div class="iframe-container">
    <iframe aria-label="Feedback Form" frameborder="0" 
            src="https://forms.zohopublic.in/mycompan11/form/FeedbackForm/formperma/2wCNeLjdGhJ0WM5GT374IamA8eAXUQdtk_gxdRvik7A">
    </iframe>
</div>


</x-filament-panels::page>

