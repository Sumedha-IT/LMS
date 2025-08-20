<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class AuthController extends Controller
{
//    use SendsPasswordResetEmails, ResetsPasswords;
    /**
     * Handle the login request.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            
        ]);
// 'fcm_token' => 'nullable|string'
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('appToken')->plainTextToken;
            $user->update(['fcm_token' => $request->input('fcm_token')]);
            
            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'fcm_token' => $user->fcm_token,
                'data' => [
                    'user' => new UserResource($user),
                ],
            ]);
        }
        return response()->json(['message' => 'The provided credentials do not match our records.'], 401);
    }


    /**
     * Handle the logout request.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logout successful']);
    }

    public function showResetForm(Request $request, $token = null)
    {
        return view('auth.passwords.reset')->with(
            ['token' => $token, 'email' => $request->email]
        );
    }
}