<?php

namespace App\Http\Controllers\api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserProfileResource;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UserProfileController extends Controller
{
    public function Index(Request $request)
    {
        $user = $request->user();
        // Add more detailed user information
        $user->load(['state', 'batches']); // Load state and batches relationships

        // Get the first batch for the user
        $batch = $user->batches->first();

        // Format the avatar URL properly
        $userData = $user->toArray();
        if ($user->avatar_url) {
            $userData['avatar_url'] = Storage::disk('public')->url($user->avatar_url);
        }

        // Return a more detailed response
        return response()->json([
            'success' => true,
            'user' => array_merge($userData, [
                'batch' => $batch ? [
                    'id' => $batch->id,
                    'name' => $batch->name
                ] : null
            ]),
            'message' => 'User profile retrieved successfully'
        ]);
    }

    public function Update(Request $request)
    {
        try {
            $user = $request->user();
            $data = json_decode($request->data, true);

            // Check if this is a resume update request
            $isResumeUpdate = isset($data['resume_update']) && $data['resume_update'] === true;

            // Define validation rules based on the request type
            $validationRules = [
                'data' => 'required|json',
                'avatar_url' => 'nullable|file|mimes:jpeg,jpg,png',
                'upload_aadhar' => 'nullable|file|mimes:pdf,jpg,jpeg,png',
                'passport_photo' => 'nullable|file|mimes:jpeg,jpg,png|max:20480' // 20MB max
            ];

            // Only validate upload_resume if it's being uploaded
            if ($request->hasFile('upload_resume')) {
                $validationRules['upload_resume'] = 'nullable|file|mimes:pdf,doc,docx';
            }

            $request->validate($validationRules);

            // Handle file uploads
            if ($request->hasFile('avatar_url')) {
                if ($user->avatar_url) {
                    Storage::disk('public')->delete($user->avatar_url);
                }
                $path = $request->file('avatar_url')->store('avatars', 'public');
                $user->avatar_url = $path;
            }

            if ($request->hasFile('upload_resume')) {
                if ($user->upload_resume) {
                    Storage::disk('public')->delete($user->upload_resume);
                }
                $path = $request->file('upload_resume')->store('resumes', 'public');
                $user->upload_resume = $path;
            }

            if ($request->hasFile('upload_aadhar')) {
                if ($user->upload_aadhar) {
                    Storage::disk('public')->delete($user->upload_aadhar);
                }
                $path = $request->file('upload_aadhar')->store('documents', 'public');
                $user->upload_aadhar = $path;
            }

            // Handle passport photo upload
            if ($request->hasFile('passport_photo')) {
                if ($user->passport_photo_path) {
                    Storage::disk('public')->delete($user->passport_photo_path);
                }
                $path = $request->file('passport_photo')->store('passport_photos', 'public');
                $user->passport_photo_path = $path;
            }

            // Update user data
            $user->fill($data);
            $user->save();

            // Format the avatar URL in the response
            $userData = $user->toArray();
            if ($user->avatar_url) {
                $userData['avatar_url'] = Storage::disk('public')->url($user->avatar_url);
            }

            return response()->json([
                'success' => true,
                'message' => 'Profile Updated Successfully',
                'user' => $userData
            ]);

        } catch (\Exception $e) {
            Log::error('Profile update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteResume(Request $request)
    {
        try {
            $user = $request->user();
            
            // Check if user has a resume to delete
            if (!$user->upload_resume) {
                return response()->json([
                    'success' => false,
                    'message' => 'No resume found to delete'
                ], 404);
            }

            // Delete the file from storage
            Storage::disk('public')->delete($user->upload_resume);
            
            // Clear the resume path from user record
            $user->upload_resume = null;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Resume deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Resume deletion error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete resume: ' . $e->getMessage()
            ], 500);
        }
    }
}
