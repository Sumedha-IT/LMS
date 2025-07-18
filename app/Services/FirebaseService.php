<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;
use Illuminate\Support\Facades\Log;

class FirebaseService
{
    protected $messaging;

    public function __construct()
    {
        try {
            // Correctly fetch the path using base_path()
            $serviceAccountPath = base_path(config('services.firebase.credentials'));

            // Log to verify correct path is used
            Log::info('Initializing Firebase with: ' . $serviceAccountPath);

            // Load Firebase with service account
            $firebase = (new Factory)->withServiceAccount($serviceAccountPath);
            $this->messaging = $firebase->createMessaging();
        } catch (\Exception $e) {
            Log::error('❌ Failed to initialize Firebase: ' . $e->getMessage());
            $this->messaging = null;
        }
    }

    public function sendNotification($fcm_token, $title, $body)
    {
        if (!$this->messaging) {
            Log::error('❌ Firebase Messaging not initialized.');
            return false;
        }

        try {
            $notification = Notification::create($title, $body);
            $message = CloudMessage::withTarget('token', $fcm_token)
                ->withNotification($notification);

            $response = $this->messaging->send($message);
            Log::info('✅ Notification sent successfully', ['response' => $response]);
            return true;
        } catch (\Exception $e) {
            Log::error('❌ Failed to send notification: ' . $e->getMessage());
            return false;
        }
    }
}
