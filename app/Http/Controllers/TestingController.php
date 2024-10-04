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

}
