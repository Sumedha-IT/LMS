<?php

namespace App\Http\Controllers;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Services\FirebaseService;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\NotificationResource;

class NotificationController extends Controller
{
    protected $firebaseService;

    public function __construct(FirebaseService $firebaseService)
    {
        $this->firebaseService = $firebaseService;
    }

    public function sendNotification(Request $request)
    {
        $request->validate([
            'device_token' => 'required|string',
            'title' => 'required|string',
            'body' => 'required|string',
        ]);

        $deviceToken = $request->input('device_token');
        $title = $request->input('title');
        $body = $request->input('body');

        $this->firebaseService->sendNotification($deviceToken, $title, $body);

        return response()->json(['message' => 'Notification sent successfully']);
    }
    
    public function index(Request $request)
    {
        $user= request()->user();
        $notifications=$user->notifications;
        $perPage = $request->input('per_page', 15);
        $notifications = $user->notifications()->paginate($perPage);
        return NotificationResource::collection($notifications);
    }

    public function markAsRead($id)
    {
        $user = request()->user();
        $notification = $user->notifications->find($id);

        if ($notification) {
            $notification->markAsRead();
            return response()->json(['message' => 'Notification marked as read.'], 200);
        }

        return response()->json(['message' => 'Notification not found.'], 404);
    }

    public function delete($id)
    {
        $user = request()->user();
        $notification = $user->notifications->find($id);

        if ($notification) {
            $notification->delete();
            return response()->json(['message' => 'Notification deleted.'], 200);
        }

        return response()->json(['message' => 'Notification not found.'], 404);
    }

     // Mark all notifications as read
     public function markAllAsRead()
     {
         $user = request()->user();
         $user->unreadNotifications->markAsRead();
         return response()->json(['message' => 'All notifications marked as read.'], 200);
     }

     public function count()
     {
         $user = request()->user();
         $unreadCount = $user->unreadNotifications->count();
         $totalCount = $user->notifications->count();
 
         return response()->json([
             'unread_count' => $unreadCount,
             'total' => $totalCount,
         ], 200);
        }
}
