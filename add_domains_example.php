<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Domain;

echo "=== Adding Example Domains ===\n\n";

// Example domains to add
$exampleDomains = [
    ['name' => 'Web Development', 'description' => 'Full-stack web development including frontend and backend technologies'],
    ['name' => 'Mobile Development', 'description' => 'iOS and Android app development'],
    ['name' => 'Data Science', 'description' => 'Data analysis, machine learning, and statistical modeling'],
    ['name' => 'Digital Marketing', 'description' => 'SEO, SEM, social media marketing, and content marketing'],
    ['name' => 'UI/UX Design', 'description' => 'User interface and user experience design'],
    ['name' => 'DevOps', 'description' => 'Development operations, CI/CD, and infrastructure management'],
    ['name' => 'Cybersecurity', 'description' => 'Information security, ethical hacking, and network security'],
    ['name' => 'Business Analytics', 'description' => 'Business intelligence, data analysis, and reporting'],
];

// Check existing domains
$existingDomains = Domain::pluck('name')->toArray();
echo "Existing domains: " . implode(', ', $existingDomains) . "\n\n";

// Add new domains
foreach ($exampleDomains as $domain) {
    if (!in_array($domain['name'], $existingDomains)) {
        Domain::create($domain);
        echo "✅ Added domain: {$domain['name']}\n";
    } else {
        echo "⏭️  Domain already exists: {$domain['name']}\n";
    }
}

echo "\n=== All Domains in System ===\n";
$allDomains = Domain::all();
foreach ($allDomains as $domain) {
    echo "ID: {$domain->id}, Name: {$domain->name}\n";
}

echo "\n=== Domain Matching Examples ===\n";
echo "1. Student (Web Development) + Job (Web Development) = ✅ Match\n";
echo "2. Student (Data Science) + Job (None) = ✅ Match (No requirement)\n";
echo "3. Student (Digital Marketing) + Job (Web Development) = ❌ No Match\n";
echo "4. Student (None) + Job (Data Science) = ❌ No Match (No domain)\n";

echo "\n=== How to Use in Postman ===\n";
echo "1. Create job posting with domain_id\n";
echo "2. Assign students to domains\n";
echo "3. Test eligibility API - it will check domain matching\n";
echo "4. Only students with matching domains will be eligible\n"; 