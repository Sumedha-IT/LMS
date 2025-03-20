<?php

return [
    'paths' => ['api/*','sanctum/csrf-cookie'], // Ensure this covers your API routes
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:8000'], // Exact origin (adjust to match your frontend)
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // Must be true for withCredentials
];
