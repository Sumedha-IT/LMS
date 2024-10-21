<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class TestingController extends Controller
{
    public function show($id){
        // dd(Hash::make('test'));
        $token = User::find(7)->createToken('appToken');
        dd($token->plainTextToken);
    }


    public function getAllCourses(Request $req)
    {
       
    }


    public function showUserInfo()
    {
        // Mock data for demonstration. Replace this with actual dynamic data from your database.
        $user = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '123-456-7890',
            'address' => '123 Main Street, City, Country',
            'education' => 'Bachelor of Computer Science',
            'employment' => 'Software Engineer at XYZ Corp',
            'meta' => [
                'he'=>"llo"
            ]
        ];

        return view('userInfo', compact('user'));
    }

    public function getUserInfoJson()
    {
        // Same mock data for demonstration
        $user = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '123-456-7890',
            'address' => '123 Main Street, City, Country',
            'education' => 'Bachelor of Computer Science',
            'employment' => 'Software Engineer at XYZ Corp',
        ];

        return response()->json($user);
    }

}
