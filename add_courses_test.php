<?php

require_once 'vendor/autoload.php';

use App\Models\Course;
use App\Models\User;
use App\Models\JobPosting;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🚀 Starting Course Assignment Script\n\n";

try {
    // 1. Create sample courses
    echo "📚 Creating sample courses...\n";
    
    $courses = [
        ['name' => 'Digital Verification', 'copy_from_existing_course' => '', 'course_type' => '1', 'allow_couse_complete' => '1'],
        ['name' => 'Web Development', 'copy_from_existing_course' => '', 'course_type' => '1', 'allow_couse_complete' => '1'],
        ['name' => 'Mobile Development', 'copy_from_existing_course' => '', 'course_type' => '1', 'allow_couse_complete' => '1'],
        ['name' => 'Data Science', 'copy_from_existing_course' => '', 'course_type' => '1', 'allow_couse_complete' => '1'],
        ['name' => 'DevOps', 'copy_from_existing_course' => '', 'course_type' => '1', 'allow_couse_complete' => '1'],
    ];

    $createdCourses = [];
    foreach ($courses as $courseData) {
        $course = Course::firstOrCreate(
            ['name' => $courseData['name']],
            $courseData
        );
        $createdCourses[$courseData['name']] = $course->id;
        echo "✅ Created course: {$courseData['name']} (ID: {$course->id})\n";
    }

    echo "\n";

    // 2. Assign courses to students
    echo "👥 Assigning courses to students...\n";
    
    // Get active students
    $students = User::where('role_id', 6)
                   ->where('is_active', 1)
                   ->get();

    echo "Found {$students->count()} active students\n";

    // Assign courses to students (round-robin)
    $courseIds = array_values($createdCourses);
    $courseIndex = 0;

    foreach ($students as $student) {
        $courseId = $courseIds[$courseIndex % count($courseIds)];
        $student->update(['course_id' => $courseId]);
        
        $courseName = array_search($courseId, $createdCourses);
        echo "✅ Assigned course '{$courseName}' to student {$student->name} (ID: {$student->id})\n";
        
        $courseIndex++;
    }

    echo "\n";

    // 3. Assign courses to job postings
    echo "💼 Assigning courses to job postings...\n";
    
    $jobPostings = JobPosting::all();
    echo "Found {$jobPostings->count()} job postings\n";

    // Assign courses to job postings (round-robin)
    $courseIndex = 0;

    foreach ($jobPostings as $jobPosting) {
        $courseId = $courseIds[$courseIndex % count($courseIds)];
        $jobPosting->update(['course_id' => $courseId]);
        
        $courseName = array_search($courseId, $createdCourses);
        echo "✅ Assigned course '{$courseName}' to job posting '{$jobPosting->title}' (ID: {$jobPosting->id})\n";
        
        $courseIndex++;
    }

    echo "\n";

    // 4. Display summary
    echo "📊 Summary:\n";
    echo "Courses created: " . count($createdCourses) . "\n";
    echo "Students updated: " . $students->count() . "\n";
    echo "Job postings updated: " . $jobPostings->count() . "\n\n";

    // 5. Show course distribution
    echo "📈 Course Distribution:\n";
    
    // Students by course
    echo "Students by course:\n";
    foreach ($createdCourses as $courseName => $courseId) {
        $studentCount = User::where('role_id', 6)
                           ->where('is_active', 1)
                           ->where('course_id', $courseId)
                           ->count();
        echo "  {$courseName}: {$studentCount} students\n";
    }

    echo "\nJob postings by course:\n";
    foreach ($createdCourses as $courseName => $courseId) {
        $jobCount = JobPosting::where('course_id', $courseId)->count();
        echo "  {$courseName}: {$jobCount} job postings\n";
    }

    echo "\n🎉 Course assignment completed successfully!\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
} 