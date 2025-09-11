<?php

namespace App\Services;

use App\Models\JobPosting;
use App\Models\User;
use App\Models\Course;
use App\Notifications\JobNotification;
use App\Notifications\JobEmailNotification;
use Filament\Notifications\Notification;
use Filament\Notifications\Events\DatabaseNotificationsSent;
use Illuminate\Support\Facades\Log;

class JobNotificationService
{
    /**
     * Send notifications for job creation
     */
    public function sendJobCreatedNotification(JobPosting $jobPosting)
    {
        try {
            Log::info("🚀 Starting job creation notification process", [
                'job_id' => $jobPosting->id,
                'job_title' => $jobPosting->title,
                'company' => $jobPosting->company->name ?? 'Unknown',
                'course_id' => $jobPosting->course_id,
                'eligible_courses' => $jobPosting->eligible_courses
            ]);

            $users = $this->getEligibleUsers($jobPosting);
            
            Log::info("📊 Eligible users found", [
                'job_id' => $jobPosting->id,
                'total_eligible_users' => $users->count(),
                'user_ids' => $users->pluck('id')->toArray(),
                'user_names' => $users->pluck('name')->toArray()
            ]);
            
            if ($users->isEmpty()) {
                Log::warning("⚠️ No eligible users found for job posting", [
                    'job_id' => $jobPosting->id,
                    'job_title' => $jobPosting->title,
                    'course_id' => $jobPosting->course_id,
                    'eligible_courses' => $jobPosting->eligible_courses
                ]);
                return;
            }

            $successCount = 0;
            $errorCount = 0;
            
            foreach ($users as $user) {
                try {
                    // Send Filament database notification
                    $companyName = is_object($jobPosting->company) ? $jobPosting->company->name : $jobPosting->company;
                    Notification::make()
                        ->title('New Job Opportunity!')
                        ->body("A new job '{$jobPosting->title}' has been posted by {$companyName}")
                        ->success()
                        ->sendToDatabase($user);
                    
                    // Trigger the event to update the UI
                    event(new DatabaseNotificationsSent($user));
                    
                    // Send email notification if user has email notifications enabled
                    Log::info("🔍 Checking email notification setting", [
                        'user_id' => $user->id,
                        'user_name' => $user->name,
                        'receive_email_notification' => $user->receive_email_notification,
                        'receive_email_notification_type' => gettype($user->receive_email_notification)
                    ]);
                    
                    if ($user->receive_email_notification) {
                        $emailNotification = new JobEmailNotification($jobPosting, 'created');
                        $user->notify($emailNotification);
                        
                        Log::info("✅ Email notification sent successfully", [
                            'user_id' => $user->id,
                            'user_name' => $user->name,
                            'user_email' => $user->email,
                            'job_id' => $jobPosting->id
                        ]);
                    } else {
                        Log::info("📧 Email notification skipped - user has email notifications disabled", [
                            'user_id' => $user->id,
                            'user_name' => $user->name,
                            'user_email' => $user->email,
                            'job_id' => $jobPosting->id
                        ]);
                    }
                    
                    $successCount++;
                    Log::info("✅ Filament notification sent successfully", [
                        'user_id' => $user->id,
                        'user_name' => $user->name,
                        'user_email' => $user->email,
                        'user_course_id' => $user->course_id,
                        'job_id' => $jobPosting->id
                    ]);
                } catch (\Exception $e) {
                    $errorCount++;
                    Log::error("❌ Failed to send notification to user", [
                        'user_id' => $user->id,
                        'user_name' => $user->name,
                        'user_email' => $user->email,
                        'job_id' => $jobPosting->id,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            Log::info("🎉 Job creation notification process completed", [
                'job_id' => $jobPosting->id,
                'job_title' => $jobPosting->title,
                'total_users' => $users->count(),
                'successful_notifications' => $successCount,
                'failed_notifications' => $errorCount,
                'success_rate' => $users->count() > 0 ? round(($successCount / $users->count()) * 100, 2) . '%' : '0%'
            ]);
            
        } catch (\Exception $e) {
            Log::error("💥 Critical error in job creation notification process", [
                'job_id' => $jobPosting->id,
                'job_title' => $jobPosting->title,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    /**
     * Send notifications for job status change
     */
    public function sendJobStatusChangedNotification(JobPosting $jobPosting, string $oldStatus, string $newStatus)
    {
        try {
            Log::info("🔄 Starting job status change notification process", [
                'job_id' => $jobPosting->id,
                'job_title' => $jobPosting->title,
                'company' => $jobPosting->company->name ?? 'Unknown',
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'course_id' => $jobPosting->course_id,
                'eligible_courses' => $jobPosting->eligible_courses
            ]);

            $users = $this->getEligibleUsers($jobPosting);
            
            Log::info("📊 Eligible users found for status change", [
                'job_id' => $jobPosting->id,
                'total_eligible_users' => $users->count(),
                'user_ids' => $users->pluck('id')->toArray(),
                'user_names' => $users->pluck('name')->toArray()
            ]);
            
            if ($users->isEmpty()) {
                Log::warning("⚠️ No eligible users found for job posting status change", [
                    'job_id' => $jobPosting->id,
                    'job_title' => $jobPosting->title,
                    'old_status' => $oldStatus,
                    'new_status' => $newStatus,
                    'course_id' => $jobPosting->course_id,
                    'eligible_courses' => $jobPosting->eligible_courses
                ]);
                return;
            }

            $successCount = 0;
            $errorCount = 0;
            
            foreach ($users as $user) {
                try {
                    // Send Filament database notification for status change
                    $companyName = is_object($jobPosting->company) ? $jobPosting->company->name : $jobPosting->company;
                    Notification::make()
                        ->title('Job Status Updated!')
                        ->body("Job '{$jobPosting->title}' at {$companyName} status changed from {$oldStatus} to {$newStatus}")
                        ->warning()
                        ->sendToDatabase($user);
                    
                    // Trigger the event to update the UI
                    event(new DatabaseNotificationsSent($user));
                    
                    // Send email notification if user has email notifications enabled
                    if ($user->receive_email_notification) {
                        $emailNotification = new JobEmailNotification($jobPosting, 'status_changed', $oldStatus, $newStatus);
                        $user->notify($emailNotification);
                        
                        Log::info("✅ Status change email notification sent successfully", [
                            'user_id' => $user->id,
                            'user_name' => $user->name,
                            'user_email' => $user->email,
                            'job_id' => $jobPosting->id,
                            'old_status' => $oldStatus,
                            'new_status' => $newStatus
                        ]);
                    } else {
                        Log::info("📧 Status change email notification skipped - user has email notifications disabled", [
                            'user_id' => $user->id,
                            'user_name' => $user->name,
                            'user_email' => $user->email,
                            'job_id' => $jobPosting->id
                        ]);
                    }
                    
                    $successCount++;
                    Log::info("✅ Filament status change notification sent successfully", [
                        'user_id' => $user->id,
                        'user_name' => $user->name,
                        'user_email' => $user->email,
                        'user_course_id' => $user->course_id,
                        'job_id' => $jobPosting->id,
                        'old_status' => $oldStatus,
                        'new_status' => $newStatus
                    ]);
                } catch (\Exception $e) {
                    $errorCount++;
                    Log::error("❌ Failed to send status change notification to user", [
                        'user_id' => $user->id,
                        'user_name' => $user->name,
                        'user_email' => $user->email,
                        'job_id' => $jobPosting->id,
                        'old_status' => $oldStatus,
                        'new_status' => $newStatus,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            Log::info("🎉 Job status change notification process completed", [
                'job_id' => $jobPosting->id,
                'job_title' => $jobPosting->title,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'total_users' => $users->count(),
                'successful_notifications' => $successCount,
                'failed_notifications' => $errorCount,
                'success_rate' => $users->count() > 0 ? round(($successCount / $users->count()) * 100, 2) . '%' : '0%'
            ]);
            
        } catch (\Exception $e) {
            Log::error("💥 Critical error in job status change notification process", [
                'job_id' => $jobPosting->id,
                'job_title' => $jobPosting->title,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    /**
     * Get users eligible for job notifications based on course
     */
    private function getEligibleUsers(JobPosting $jobPosting)
    {
        Log::info("🔍 Starting user eligibility check", [
            'job_id' => $jobPosting->id,
            'job_course_id' => $jobPosting->course_id,
            'job_eligible_courses' => $jobPosting->eligible_courses
        ]);

        $users = collect();
        $eligibilityReasons = [];

        // If job has a specific course_id, get users from that course through batches
        if ($jobPosting->course_id) {
            Log::info("📚 Checking users by direct course_id through batches", [
                'job_id' => $jobPosting->id,
                'course_id' => $jobPosting->course_id
            ]);

            $courseUsers = User::whereHas('batches', function($query) use ($jobPosting) {
                $query->where('course_id', $jobPosting->course_id)
                      ->orWhere('course_package_id', $jobPosting->course_id);
            })
            ->whereIn('role_id', [6, 11]) // 6 = student, 11 = placement student
            ->get();
            
            Log::info("👥 Found users by course_id through batches (students + placement students)", [
                'job_id' => $jobPosting->id,
                'course_id' => $jobPosting->course_id,
                'user_count' => $courseUsers->count(),
                'user_ids' => $courseUsers->pluck('id')->toArray(),
                'user_names' => $courseUsers->pluck('name')->toArray(),
                'targeted_roles' => [6, 11]
            ]);

            $users = $users->merge($courseUsers);
            $eligibilityReasons[] = "Direct course_id match through batches: {$jobPosting->course_id}";
        }

        // If job has eligible_courses array, get users from those courses
        if ($jobPosting->eligible_courses) {
            Log::info("📋 Checking users by eligible_courses", [
                'job_id' => $jobPosting->id,
                'eligible_courses' => $jobPosting->eligible_courses,
                'eligible_courses_type' => gettype($jobPosting->eligible_courses)
            ]);

            // Handle both JSON string and array formats
            $eligibleCourseNames = $jobPosting->eligible_courses;
            
            // If it's a JSON string, decode it
            if (is_string($eligibleCourseNames)) {
                $decoded = json_decode($eligibleCourseNames, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    $eligibleCourseNames = $decoded;
                    Log::info("🔄 Decoded JSON string to array", [
                        'job_id' => $jobPosting->id,
                        'original_string' => $jobPosting->eligible_courses,
                        'decoded_array' => $eligibleCourseNames
                    ]);
                } else {
                    Log::warning("⚠️ Failed to decode eligible_courses JSON string", [
                        'job_id' => $jobPosting->id,
                        'json_string' => $eligibleCourseNames,
                        'json_error' => json_last_error_msg()
                    ]);
                    $eligibleCourseNames = [];
                }
            }
            
            // If eligible_courses contains course names (not IDs), convert them to IDs
            if (is_array($eligibleCourseNames) && !empty($eligibleCourseNames)) {
                Log::info("🎯 Processing eligible_courses array (course names)", [
                    'job_id' => $jobPosting->id,
                    'eligible_course_names' => $eligibleCourseNames
                ]);

                // Convert course names to course IDs
                $courseIds = \App\Models\Course::whereIn('name', $eligibleCourseNames)
                    ->pluck('id')
                    ->toArray();
                
                Log::info("🔄 Converted course names to IDs", [
                    'job_id' => $jobPosting->id,
                    'course_names' => $eligibleCourseNames,
                    'course_ids' => $courseIds
                ]);

                if (!empty($courseIds)) {
                    $eligibleUsers = User::whereHas('batches', function($query) use ($courseIds) {
                        $query->whereIn('course_id', $courseIds)
                              ->orWhereIn('course_package_id', $courseIds);
                    })
                    ->whereIn('role_id', [6, 11]) // 6 = student, 11 = placement student
                    ->get();
                    
                    Log::info("👥 Found users by eligible_courses through batches (students + placement students)", [
                        'job_id' => $jobPosting->id,
                        'eligible_course_names' => $eligibleCourseNames,
                        'eligible_course_ids' => $courseIds,
                        'user_count' => $eligibleUsers->count(),
                        'user_ids' => $eligibleUsers->pluck('id')->toArray(),
                        'user_names' => $eligibleUsers->pluck('name')->toArray(),
                        'targeted_roles' => [6, 11]
                    ]);

                    $users = $users->merge($eligibleUsers);
                    $eligibilityReasons[] = "Eligible_courses match through batches: " . implode(', ', $eligibleCourseNames) . " (IDs: " . implode(', ', $courseIds) . ")";
                } else {
                    Log::warning("⚠️ No course IDs found for eligible course names", [
                        'job_id' => $jobPosting->id,
                        'eligible_course_names' => $eligibleCourseNames
                    ]);
                }
            } else {
                Log::warning("⚠️ eligible_courses array is empty or invalid", [
                    'job_id' => $jobPosting->id,
                    'eligible_courses' => $jobPosting->eligible_courses
                ]);
            }
        } else {
            Log::info("ℹ️ No eligible_courses found or empty", [
                'job_id' => $jobPosting->id,
                'eligible_courses' => $jobPosting->eligible_courses,
                'eligible_courses_type' => gettype($jobPosting->eligible_courses)
            ]);
        }

        // Remove duplicates and return unique users
        $uniqueUsers = $users->unique('id');
        
        Log::info("📊 Final eligibility summary", [
            'job_id' => $jobPosting->id,
            'total_users_found' => $users->count(),
            'unique_users_after_dedup' => $uniqueUsers->count(),
            'eligibility_reasons' => $eligibilityReasons,
            'final_user_ids' => $uniqueUsers->pluck('id')->toArray(),
            'final_user_names' => $uniqueUsers->pluck('name')->toArray(),
            'final_user_courses' => $uniqueUsers->pluck('course_id')->toArray()
        ]);

        return $uniqueUsers;
    }

    /**
     * Get users by course ID through batches
     */
    public function getUsersByCourseId($courseId)
    {
        return User::whereHas('batches', function($query) use ($courseId) {
            $query->where('course_id', $courseId)
                  ->orWhere('course_package_id', $courseId);
        })
        ->where('role_id', 6) // Assuming 6 is student role
        ->get();
    }

    /**
     * Get users by multiple course IDs through batches
     */
    public function getUsersByCourseIds(array $courseIds)
    {
        return User::whereHas('batches', function($query) use ($courseIds) {
            $query->whereIn('course_id', $courseIds)
                  ->orWhereIn('course_package_id', $courseIds);
        })
        ->where('role_id', 6) // Assuming 6 is student role
        ->get();
    }
}
