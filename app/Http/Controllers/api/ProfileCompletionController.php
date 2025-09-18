<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Services\ProfileCompletionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileCompletionController extends Controller
{
    protected $profileCompletionService;

    public function __construct(ProfileCompletionService $profileCompletionService)
    {
        $this->profileCompletionService = $profileCompletionService;
        $this->middleware('auth:sanctum');
    }

    /**
     * Get profile completion status for the authenticated user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Authentication required'], 401);
            }

            // Check if user is a student
            if (!$user->is_student && !$user->is_placement_student) {
                return response()->json(['error' => 'Only students can access profile completion'], 403);
            }

            $completion = $this->profileCompletionService->calculateProfileCompletion($user);
            
            return response()->json([
                'success' => true,
                'data' => $completion
            ]);

        } catch (\Exception $e) {
            \Log::error('Error getting profile completion:', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to get profile completion status',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get profile completion status for a specific user (admin only)
     *
     * @param Request $request
     * @param int $userId
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $userId)
    {
        try {
            $currentUser = Auth::user();
            
            if (!$currentUser) {
                return response()->json(['error' => 'Authentication required'], 401);
            }

            // Check if current user has admin permissions
            if (!$currentUser->is_admin && !$currentUser->is_coordinator && !$currentUser->is_placement_coordinator) {
                return response()->json(['error' => 'Unauthorized access'], 403);
            }

            // Find the target user
            $user = \App\Models\User::find($userId);
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            // Check if target user is a student
            if (!$user->is_student && !$user->is_placement_student) {
                return response()->json(['error' => 'Profile completion is only available for students'], 403);
            }

            $completion = $this->profileCompletionService->calculateProfileCompletion($user);
            
            return response()->json([
                'success' => true,
                'data' => $completion
            ]);

        } catch (\Exception $e) {
            \Log::error('Error getting profile completion for user:', [
                'admin_user_id' => Auth::id(),
                'target_user_id' => $userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to get profile completion status',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if user can apply for placements
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function canApply(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Authentication required'], 401);
            }

            // Check if user is a student
            if (!$user->is_student && !$user->is_placement_student) {
                return response()->json(['error' => 'Only students can check placement eligibility'], 403);
            }

            $eligibility = $this->profileCompletionService->canApplyForPlacements($user);
            
            return response()->json([
                'success' => true,
                'data' => $eligibility
            ]);

        } catch (\Exception $e) {
            \Log::error('Error checking placement eligibility:', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to check placement eligibility',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
