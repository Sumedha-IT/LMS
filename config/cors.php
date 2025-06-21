<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        env('APP_URL', 'http://localhost:8000'),
        env('VITE_APP_API_URL', 'http://localhost:8000/api'),
        env('VITE_DEV_SERVER_URL', 'http://localhost:8000')
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
