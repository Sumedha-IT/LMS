<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CheckFeatureAccessMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
    
        $user = Auth::user();
        if (empty($user) || !($user->getIsStudentAttribute() || $user->getIsPlacementStudentAttribute()) ) {
            return $next($request);
        }
    
        if (!$user->feature_access && $request->path() === 'livewire/update') {
            // Ensure 'components' key exists and contains at least one item
            if (isset($request->components[0]['snapshot'])) {
                $snapshot = json_decode($request->components[0]['snapshot'], true);
    
                if (!empty($snapshot['memo']['path'])) {
                    $path = '/' . ltrim($snapshot['memo']['path'], '/');  // Normalize path with leading slash
                    // Define patterns in a single regex with alternation
                    $modelToDisablePattern = "/^\/administrator\/\d+(\/(calendar|calendars|timeline|examinations|feedback|my-profile|announcements|attendances|leaves|holidays|teaching-material-statuses|master\/batches)?)?$/";

                    // Match pattern but exclude payment-details from blocking
                    if (preg_match($modelToDisablePattern, $path) && !str_contains($path, 'payment-details')) {
                        // Redirect if match is found
                        $branchId = 1;
                        return redirect('/administrator/'.$branchId.'/payment-details');
                    }
                }
            }
        }
    
        return $next($request);
    }
}
