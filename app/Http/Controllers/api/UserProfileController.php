<?php

namespace App\Http\Controllers\api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserProfileResource;

class UserProfileController extends Controller
{
    public function Update(Request $request)
{
    // Validation rules
    $request->validate([
        'name' => 'nullable|string',
        'avatar_url' => 'nullable|file|mimes:jpeg,jpg,png',
        'email' => 'nullable|email',
        'gender' => 'nullable|in:Male,Female,Other',
        'birthday' => 'nullable|date',
        'address' => 'nullable|string',
        'city' => 'nullable|string',
        'state_id' => 'nullable|integer',
        'pincode' => 'nullable|string',
        'aadhaar_number' => 'nullable|integer|digits:12',
        'linkedin_profile' => 'nullable|url',
        'parent_name' => 'nullable|string|max:191',
        'parent_email' => 'nullable|email|max:191',
        'parent_aadhar' => 'nullable|integer|digits:12',
        'parent_occupation' => 'nullable|string|max:191',
        'residential_address' => 'nullable|string|max:191',
    ]);

    $user = $request->user();

    // Fields to update (excluding avatar_url since it’s a file)
    $fields = [
        'name', 'email', 'gender', 'birthday', 'address', 'city',
        'state_id', 'pincode', 'aadhaar_number', 'linkedin_profile',
        'parent_name', 'parent_email', 'parent_aadhar',
        'parent_occupation', 'residential_address'
    ];

    // Update text-based fields
    foreach ($fields as $field) {
        if ($request->filled($field)) {
            $user->$field = $request->$field;
        }
    }

    // Handle avatar_url file upload
    if ($request->hasFile('avatar_url') && $request->file('avatar_url')->isValid()) {
        // Store the file in the 'public/avatars' directory
        $path = $request->file('avatar_url')->store('avatars', 'public');
        
        // Update the avatar_url field with the file path
        $user->avatar_url = $path;

        // Debugging: Log the stored path
        \Log::info('Avatar uploaded successfully', ['path' => $path]);
    } else {
        // Debugging: Log if the file isn't being detected
        \Log::info('Avatar file not detected or invalid', [
            'hasFile' => $request->hasFile('avatar_url'),
            'file' => $request->file('avatar_url')
        ]);
    }

    // Save the user
    $user->save();

    return response()->json([
        'message' => 'Profile Updated Successfully',
        'user' => new UserProfileResource($user)
    ], 200);
}
    public function Index(Request $request){
        $user=$request->user();
        return response()->json(['user'=>new UserProfileResource($user)],200);
    }
}
