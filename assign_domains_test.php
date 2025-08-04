<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Models\JobPosting;
use App\Models\Domain;

echo "=== Assigning Domains for Testing ===\n\n";

// Get all domains
$domains = Domain::all();
echo "Available domains:\n";
foreach ($domains as $domain) {
    echo "ID: {$domain->id}, Name: {$domain->name}\n";
}
echo "\n";

// Get students (users with role_id = 6)
$students = User::where('role_id', 6)->where('is_active', 1)->get();
echo "Found {$students->count()} active students\n\n";

// Get job postings
$jobPostings = JobPosting::all();
echo "Found {$jobPostings->count()} job postings\n\n";

// Assign domains to students (if they don't have domains)
$studentDomainAssignments = [
    1 => [11, 12, 13, 14, 15], // DV domain
    2 => [16, 17, 18, 19, 20], // Web Development domain
    3 => [21, 22, 23, 24, 25], // Mobile Development domain
    4 => [26, 27, 28, 29, 30], // Data Science domain
    5 => [31, 32, 33, 34, 35], // DevOps domain
];

echo "=== Assigning Domains to Students ===\n";
$assignedStudents = 0;
foreach ($studentDomainAssignments as $domainId => $studentIds) {
    if ($domains->where('id', $domainId)->first()) {
        $domainName = $domains->where('id', $domainId)->first()->name;
        foreach ($studentIds as $studentId) {
            $student = User::find($studentId);
            if ($student && $student->role_id == 6) {
                if (!$student->domain_id) {
                    $student->update(['domain_id' => $domainId]);
                    echo "✅ Assigned {$domainName} domain to student {$student->name} (ID: {$student->id})\n";
                    $assignedStudents++;
                } else {
                    echo "⏭️  Student {$student->name} (ID: {$student->id}) already has domain_id: {$student->domain_id}\n";
                }
            }
        }
    }
}

// Assign domains to job postings
echo "\n=== Assigning Domains to Job Postings ===\n";
$jobDomainAssignments = [
    6 => 1,  // Job posting 6 -> DV domain
    7 => 2,  // Job posting 7 -> Web Development domain
    8 => 3,  // Job posting 8 -> Mobile Development domain
    9 => 4,  // Job posting 9 -> Data Science domain
    10 => 5, // Job posting 10 -> DevOps domain
    // Job posting 11 will have no domain (NULL) for testing
];

$assignedJobs = 0;
foreach ($jobDomainAssignments as $jobId => $domainId) {
    $jobPosting = JobPosting::find($jobId);
    if ($jobPosting) {
        if ($domains->where('id', $domainId)->first()) {
            $domainName = $domains->where('id', $domainId)->first()->name;
            $jobPosting->update(['domain_id' => $domainId]);
            echo "✅ Assigned {$domainName} domain to job posting '{$jobPosting->title}' (ID: {$jobPosting->id})\n";
            $assignedJobs++;
        }
    } else {
        echo "⚠️  Job posting with ID {$jobId} not found\n";
    }
}

// Create a job posting with no domain requirement for testing
$noDomainJob = JobPosting::whereNull('domain_id')->first();
if ($noDomainJob) {
    echo "✅ Found job posting '{$noDomainJob->title}' (ID: {$noDomainJob->id}) with no domain requirement\n";
} else {
    echo "ℹ️  No job posting found without domain requirement\n";
}

echo "\n=== Testing Summary ===\n";
echo "Students assigned domains: {$assignedStudents}\n";
echo "Job postings assigned domains: {$assignedJobs}\n";

echo "\n=== Test Scenarios Ready ===\n";
echo "1. Test DV domain matching:\n";
echo "   GET /api/job-postings/6/eligible-student\n";
echo "   Expected: Only students with DV domain (students 11-15)\n\n";

echo "2. Test Web Development domain matching:\n";
echo "   GET /api/job-postings/7/eligible-student\n";
echo "   Expected: Only students with Web Development domain (students 16-20)\n\n";

echo "3. Test no domain requirement:\n";
echo "   GET /api/job-postings/{no_domain_job_id}/eligible-student\n";
echo "   Expected: All students regardless of domain (if they meet attendance/exam criteria)\n\n";

echo "4. Test domain mismatch:\n";
echo "   Students with DV domain applying to Web Development job = ❌ No match\n";
echo "   Students with no domain applying to any domain job = ❌ No match\n";

echo "\n=== Current Domain Distribution ===\n";
$domainStats = User::where('role_id', 6)
    ->where('is_active', 1)
    ->selectRaw('domain_id, COUNT(*) as count')
    ->groupBy('domain_id')
    ->get();

foreach ($domainStats as $stat) {
    $domainName = $stat->domain_id ? $domains->where('id', $stat->domain_id)->first()->name : 'No Domain';
    echo "{$domainName}: {$stat->count} students\n";
}

echo "\nReady for domain matching testing! 🚀\n"; 