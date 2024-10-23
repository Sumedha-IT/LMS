<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

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
        if($event->user){
            $event->user->tokens()->delete();
        }
        setcookie('x_path_id', "", time() - (24 * 60), "/"); 
        setcookie('user_info', "", time() - (24 * 60), "/"); 

    }
}
