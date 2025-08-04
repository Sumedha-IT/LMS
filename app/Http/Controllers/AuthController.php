<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            \Log::info('Login attempt received', ['email' => $request->email]);
            
            $credentials = $request->only('email', 'password');

            if (!Auth::attempt($credentials)) {
                \Log::info('Login failed - invalid credentials', ['email' => $request->email]);
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            $user = Auth::user();
            \Log::info('User authenticated successfully', ['user_id' => $user->id, 'email' => $user->email]);
            
            $token = $user->createToken('api-token')->plainTextToken;
            \Log::info('Token created successfully', ['user_id' => $user->id]);

            return response()->json(['token' => $token], 200);
        } catch (\Exception $e) {
            \Log::error('Login error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Internal server error', 'error' => $e->getMessage()], 500);
        }
    }
}
