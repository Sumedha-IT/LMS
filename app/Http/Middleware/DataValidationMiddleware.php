<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DataValidationMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the 'data' key is present in the request payload (either in POST data or query parameters)
        if (!$request->has('data')) {
            return response()->json(['message' => "Data key required", "status" => 400, "success" => false], 400);
        }
        return $next($request);
    }
}
