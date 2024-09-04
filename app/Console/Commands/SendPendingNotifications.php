<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Support\Facades\Log;

// use Illuminate\Notifications\Notification;
use Illuminate\Console\Command;
use App\Services\FirebaseService;

class SendPendingNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:send-pending';
    protected $description = 'Send pending notifications via Firebase';
    protected $firebaseService;
    public function __construct(FirebaseService $firebaseService)
    {
        parent::__construct();
        $this->firebaseService=$firebaseService;
    }
    public function handle()
    {
        $limit = 10; // Limit to 40 notifications per minute
        $pendingNotifications = Notification::whereNull('sended_at')
            ->whereHas('notifiable', function ($query) {
                $query->where('role_id', 6)->whereNotNull('fcm_token');
            })
            ->with('notifiable')
            ->take($limit)
            ->get();
    
        $count = 0;
        foreach ($pendingNotifications as $notification) {
            $user = $notification->notifiable;
    
            if ($user && $user->fcm_token) {
                Log::info('start', ['date' => date('h:i:s')]);
    
            $notificationData = json_decode($notification->data, true);
            $title = $notificationData['title'] ?? 'New Notification';
            $body = $notificationData['body'] ?? 'You have a new notification';

            $success = $this->firebaseService->sendNotification(
                $user->fcm_token,
                $title,
                $body
            );
    
                if ($success) {
                    $notification->sended_at = now();
                    $notification->save();
                    Log::info("Notification sent to user {$user->name}");
                } else {
                    Log::error("Failed to send notification to user {$user->id}");
                }
    
                Log::info('end', ['date' => date('h:i:s')]);
    
                $count++;
                if ($count >= $limit) {
                    break;
                }
            } else {
                Log::info("User {$notification->notifiable_id} not found or has no FCM token");
            }
        }
    
        Log::info("Processed {$count} notifications");
    }
}
