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
        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    public function Update(Request $request)
    {
        try {
            $request->validate([
                'data' => 'required|json',
                'avatar_url' => 'nullable|file|mimes:jpeg,jpg,png',
                'upload_resume' => 'nullable|file|mimes:pdf,doc,docx',
                'upload_aadhar' => 'nullable|file|mimes:pdf,jpg,jpeg,png',
                'passport_photo' => 'nullable|file|mimes:jpeg,jpg,png|max:20480' // 20MB max
            ]);

            $user = $request->user();
            $data = json_decode($request->data, true);

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

            return response()->json([
                'success' => true,
                'message' => 'Profile Updated Successfully',
                'user' => $user
            ]);

        } catch (\Exception $e) {
            Log::error('Profile update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile: ' . $e->getMessage()
            ], 500);
        }
    }
}
