<?php

namespace App\Http\Controllers\api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserProfileResource;
use Illuminate\Support\Facades\Log;

class UserProfileController extends Controller
{
    public function Update(Request $request){
        $request->validate([
            'name'=>'nullable|string',
            'avatar_url' => 'nullable|file|mimes:jpeg,jpg,png',
            'email'=>'nullable|email',
            'gender'=>'nullable|in:Male,Female,Other',
            'birthday'=>'nullable|date',
            'address'=>'nullable|string',
            'city'=>'nullable|string',
            'state_id'=>'nullable|integer',
            'pincode'=>'nullable|string',
            'aadhaar_number' => 'nullable|integer|digits:12',
            'linkedin_profile' => 'nullable|url',
            'parent_name' => 'nullable|string|max:191',
            'parent_email' => 'nullable|email|max:191',
            'parent_aadhar' => 'nullable|integer|digits:12',
            'parent_occupation' => 'nullable|string|max:191',
            'residential_address' => 'nullable|string|max:191',
            

            
        ]);
        $user=$request->user();
        $fields = [
            'name', 'email', 'gender', 'birthday', 'address', 'city',
            'state_id', 'pincode', 'aadhaar_number', 'linkedin_profile',
            'parent_name', 'parent_email', 'parent_aadhar',
            'parent_occupation', 'residential_address'
        ];
    
        foreach ($fields as $field) {
            if ($request->filled($field)) {
                $user->$field = $request->$field;
            }
        }
        $user->save();
        return response()->json(['message'=>'Profile Updated SuccessFully','user'=>new UserProfileResource($user)],200);

        
    }
    public function Index(Request $request){
        $user = $request->user();
        return response()->json(['user' => new UserProfileResource($user)], 200);
    }
}
