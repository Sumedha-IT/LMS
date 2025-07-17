<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Laravel\Sanctum\PersonalAccessToken;

class OnLogoutEventListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(object $event): void
    {
        $tokenId = session()->pull('id');

        $token = PersonalAccessToken::where('id', $tokenId)->first();
        if(!empty($token)){
            $token->delete();
        }

        // if ($event->user) {
        //     $event->user->tokens()->delete();
        // }
        setcookie('x_path_id', "", time() - (24 * 60 * 60 * 60), "/");
        setcookie('user_info', "", time() - (24 * 60 * 60 * 60), "/");
    }
}
