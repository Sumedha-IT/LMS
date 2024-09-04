<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\TeachingMaterial;
use App\Models\BatchTeachingMaterial;
use App\Models\BatchUser;
use App\Models\TeachingMaterialStatus;
use App\Models\User;
use Carbon\Carbon;
use App\Services\FirebaseService;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class SendAssignmentReminders extends Command
{
    protected $signature = 'assignments:send-reminders';
    protected $description = 'Send reminders for upcoming assignment due dates';

    protected $firebaseService;

    public function __construct(FirebaseService $firebaseService)
    {
        parent::__construct();
        $this->firebaseService = $firebaseService;
    }

    public function handle()
    {
        Log::info('Starting to send reminders.');
        $this->sendReminders(7, 'week');
        $this->sendReminders(1, 'day');
        Log::info('Finished sending reminders.');
    }

    private function sendReminders($daysBeforeDue, $reminderType)
    {
        $dueDate = Carbon::now()->addDays($daysBeforeDue)->toDateString();
        Log::info("Fetching assignments due on {$dueDate}.");

        $assignments = TeachingMaterial::where('doc_type', 2)
            ->whereDate('start_submission', $dueDate)
            ->get();

        foreach ($assignments as $assignment) {
            $this->processAssignment($assignment, $reminderType);
        }

        $this->info("Sent {$reminderType} reminders for assignments due in {$daysBeforeDue} days.");
    }

    private function processAssignment($assignment, $reminderType)
    {
        $batchTeachingMaterials = BatchTeachingMaterial::where('teaching_material_id', $assignment->id)->get();

        foreach ($batchTeachingMaterials as $batchTeachingMaterial) {
            $students = BatchUser::where('batch_id', $batchTeachingMaterial->batch_id)->get();

            foreach ($students as $student) {
                $this->processStudent($student, $assignment, $batchTeachingMaterial, $reminderType);
            }
        }
    }

    private function processStudent($student, $assignment, $batchTeachingMaterial, $reminderType)
    {
        $hasSubmitted = TeachingMaterialStatus::where('teaching_material_id', $assignment->id)
            ->where('user_id', $student->user_id)
            ->where('batch_id', $batchTeachingMaterial->batch_id)
            ->exists();

        if (!$hasSubmitted) {
            $user = User::find($student->user_id);
            $this->sendPushNotification($user, $assignment, $reminderType);
        }
    }

    private function sendPushNotification($user, $assignment, $reminderType)
    {
        // if (!$user->fcm_token) {
        //     Log::warning("User {$user->id} does not have an FCM token.");
        //     return;
        // }

        // $title = "Assignment Due Reminder - {$reminderType} notice";
        // $body = "Your assignment '{$assignment->name}' is due in one {$reminderType}. Due date: {$assignment->start_submission}";

        // Log::info("Attempting to send notification to user {$user->id} for assignment {$assignment->id}.");

        // Send Filament notification to database
        Notification::make()
            ->title("Assignment Due Reminder - {$reminderType} notice")
            ->body("Your assignment '{$assignment->name}' is due in one {$reminderType}. Due date: {$assignment->start_submission}")
            ->danger()
            ->sendToDatabase($user);

        // Send FCM notification
        // $success = $this->firebaseService->sendNotification($user->fcm_token, $title, $body);

        // if ($success) {
        //     Log::info("Notification sent successfully to user {$user->id}.");
        // } else {
        //     Log::error("Failed to send notification to user {$user->id}.");
        // }
    }
}