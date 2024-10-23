<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OnLoginEventListener
{
    /**
     * Create the event listener.
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Handle the event.
     */
    public function handle(object $event): void
    {
        $user = $event->user;
        
        if($user->tokens()->count() > 0){
            $user->tokens()->delete();
        }

        // Create a new token for the user
        $token = $user->createToken('app_token');
        // Retrieve user's IP address
        $ipAddress = $this->request->ip();

        // Retrieve user's browser and platform information
        $userAgent = $this->request->header('User-Agent');

        // Create a cookie value combining IP and User-Agent information
        $cookieValue = ([
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'token' =>  'Bearer '.$token->plainTextToken
        ]);

        // Create a cookie with the combined IP and User-Agent data
        setcookie('user_info', encrypt_data(json_encode($cookieValue),config('services.app.secret')), time() +24*60,"/"); // Cookie set for 60 minutes
        setcookie('x_path_id', $user->id, time() + (24*60), "/");

    }   
}
