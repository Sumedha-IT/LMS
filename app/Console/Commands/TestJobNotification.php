<?php

namespace App\Console\Commands;

use App\Models\JobPosting;
use App\Services\JobNotificationService;
use Illuminate\Console\Command;

class TestJobNotification extends Command
{
    protected $signature = 'test:job-notification {job_id}';
    protected $description = 'Test job notification system for a specific job';

    public function handle()
    {
        $jobId = $this->argument('job_id');
        
        $this->info("🧪 Starting job notification test for Job ID: {$jobId}");
        $this->info("📋 Check Laravel logs for detailed information");
        
        $jobPosting = JobPosting::with(['company', 'course'])->find($jobId);
        
        if (!$jobPosting) {
            $this->error("❌ Job posting with ID {$jobId} not found!");
            return 1;
        }
        
        $this->info("📝 Job Details:");
        $this->info("   Title: {$jobPosting->title}");
        $this->info("   Company: " . ($jobPosting->company->name ?? 'N/A'));
        $this->info("   Course ID: " . ($jobPosting->course_id ?? 'N/A'));
        $this->info("   Eligible Courses: " . json_encode($jobPosting->eligible_courses));
        $this->info("   Status: {$jobPosting->status}");
        
        $jobNotificationService = new JobNotificationService();
        
        $this->info("\n🚀 Testing job creation notification...");
        $jobNotificationService->sendJobCreatedNotification($jobPosting);
        $this->info("✅ Job creation notification test completed!");
        
        $this->info("\n🔄 Testing job status change notification...");
        $jobNotificationService->sendJobStatusChangedNotification($jobPosting, 'draft', 'open');
        $this->info("✅ Job status change notification test completed!");
        
        $this->info("\n📊 Test Summary:");
        $this->info("   - Check Laravel logs for detailed notification results");
        $this->info("   - Look for emoji-prefixed log entries (🚀, 📊, ✅, ❌, etc.)");
        $this->info("   - Check the notifications table in database for stored notifications");
        $this->info("   - Now targeting both students (role 6) and placement students (role 11)");
        
        return 0;
    }
}
