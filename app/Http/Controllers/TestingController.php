<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
class TestingController extends Controller
{

    
    public function testMail(){
        try{
                // Use a plain string instead of an array
            
            $user['to'] = 'kanha.tomar@hiteshi.com';
            $body = 'Let’s go to lunch bhook lg rhi hai';
            Mail::raw($body, function($message) use($user) {
                $message->to($user['to']);
                $message->subject("Lunch Invitation");
            });
                
            return "Mail Sent Successfully!";
        }catch(\Exception $e){
            dd($e->getMessage());
        }
    }

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
