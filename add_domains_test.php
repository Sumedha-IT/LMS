<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Domain;

echo "=== Adding Test Domains for Job Eligibility Testing ===\n\n";

// Test domains to add
$testDomains = [
    ['name' => 'DV', 'description' => 'Digital Verification'],
    ['name' => 'Web Development', 'description' => 'Full-stack web development'],
    ['name' => 'Mobile Development', 'description' => 'iOS and Android development'],
    ['name' => 'Data Science', 'description' => 'Data analysis and machine learning'],
    ['name' => 'DevOps', 'description' => 'Development operations and infrastructure'],
    ['name' => 'UI/UX Design', 'description' => 'User interface and experience design'],
    ['name' => 'Cybersecurity', 'description' => 'Information security and ethical hacking'],
    ['name' => 'Cloud Computing', 'description' => 'AWS, Azure, Google Cloud'],
    ['name' => 'AI/ML', 'description' => 'Artificial Intelligence and Machine Learning'],
    ['name' => 'Blockchain', 'description' => 'Blockchain and cryptocurrency development'],
];

// Check existing domains
$existingDomains = Domain::pluck('name')->toArray();
echo "Existing domains: " . implode(', ', $existingDomains) . "\n\n";

// Add new domains
$addedCount = 0;
foreach ($testDomains as $domain) {
    if (!in_array($domain['name'], $existingDomains)) {
        Domain::create([
            'name' => $domain['name']
        ]);
        echo "✅ Added domain: {$domain['name']} - {$domain['description']}\n";
        $addedCount++;
    } else {
        echo "⏭️  Domain already exists: {$domain['name']}\n";
    }
}

echo "\n=== All Domains in System ===\n";
$allDomains = Domain::all();
foreach ($allDomains as $domain) {
    echo "ID: {$domain->id}, Name: {$domain->name}\n";
}

echo "\n=== Domain Testing Scenarios ===\n";
echo "1. Job Posting (DV) + Student (DV) = ✅ Match\n";
echo "2. Job Posting (Web Development) + Student (Web Development) = ✅ Match\n";
echo "3. Job Posting (DV) + Student (Web Development) = ❌ No Match\n";
echo "4. Job Posting (No Domain) + Student (Any Domain) = ✅ Match\n";
echo "5. Job Posting (DV) + Student (No Domain) = ❌ No Match\n";

echo "\n=== Sample SQL Commands for Testing ===\n";
echo "-- Assign domain to students:\n";
echo "UPDATE users SET domain_id = 1 WHERE id IN (11, 12, 13); -- Assign DV domain\n";
echo "UPDATE users SET domain_id = 2 WHERE id IN (14, 15, 16); -- Assign Web Development domain\n";
echo "UPDATE users SET domain_id = 3 WHERE id IN (17, 18, 19); -- Assign Mobile Development domain\n\n";

echo "-- Assign domain to job postings:\n";
echo "UPDATE job_postings SET domain_id = 1 WHERE id = 6; -- Job posting 6 requires DV domain\n";
echo "UPDATE job_postings SET domain_id = 2 WHERE id = 7; -- Job posting 7 requires Web Development domain\n";
echo "UPDATE job_postings SET domain_id = NULL WHERE id = 8; -- Job posting 8 has no domain requirement\n\n";

echo "=== API Testing Endpoints ===\n";
echo "GET /api/job-postings/6/eligible-student  -- Get students eligible for job posting 6 (DV domain)\n";
echo "GET /api/job-postings/7/eligible-student  -- Get students eligible for job posting 7 (Web Development domain)\n";
echo "GET /api/job-postings/8/eligible-student  -- Get students eligible for job posting 8 (No domain requirement)\n";

echo "\n=== Summary ===\n";
echo "Total domains in system: " . $allDomains->count() . "\n";
echo "New domains added: {$addedCount}\n";
echo "Ready for domain matching testing!\n"; 