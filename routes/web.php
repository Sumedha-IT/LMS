<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MyCourseController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return redirect('/administrator');
    //return view('welcome');
});

// Route::get('/api/events/meetings', 'EventController@getMeetings');
// Route::get('/api/events/deadlines', 'EventController@getDeadlines');

Route::get('clear-cache', function () {
    //Artisan::call('storage:link');
    Artisan::call('optimize');
	Artisan::call('cache:clear');
    Artisan::call('config:cache');
    Artisan::call('route:clear');

    return "Cache cleared successfully";
});
Route::get('/linkstorage', function () {
    Artisan::call('storage:link');
});

Route::get('user/{userId}/exam/{examId}', function ($userId, $examId) {
    return view('exam');  // This should point to the Blade file that loads the React component.
})->name('user.exam');

Route::get('user/{userId}/exam/{examId}/assessment/{attemptId}', function ($userId, $examId) {
    return view('questionPanel');  // This should point to the Blade file that loads the React component.
})->name('user.exam.questionPanel');

Route::get('user/{userId}/exam/{examId}/review/{attemptId}', function ($userId, $examId, $attemptId) {
    return view('examReview');  // This should point to the Blade file that loads the React component.
})->name('user.exam.review');

Route::get('/administrator/{adminId}/examinations/user/{userId}/exam/{examId}/result}', function ($userId, $examId) {
    return view('examResult');  // This should point to the Blade file that loads the React component.
})->name('user.exam.examResult');

Route::get('/user', function () {
    return redirect('/administrator');
});

// Test route for assignment submission
Route::get('/test-assignment-submission/{assignmentId}', [App\Http\Controllers\TeachingMaterialController::class, 'getAssignmentSubmission']);

// MyCourses and Announcements React UI routes
Route::middleware(['auth', 'checkStudentAttendance'])->group(function () {
    // React UI routes
    Route::get('/my-courses', function () {
        return view('my-courses');
    })->name('my-courses');

    // Student announcements page route
    Route::get('/administrator/{id}/student-announcements', function ($id) {
        // Only allow students to access this page
        if (auth()->user() && !auth()->user()->is_admin) {
            return view('announcements');
        }

        // Redirect admins to the Filament admin panel
        return redirect('/administrator/' . $id);
    })->name('student.announcements');

    // Student Attendance Pages - support both URL patterns
    Route::get('/student-attendance', function () {
        return view('student-attendance');
    })->name('student.attendance');

    // Support the administrator URL pattern for student attendance
    Route::get('/administrator/{id}/student-attendance', function ($id) {
        // Only allow students to access this page
        if (auth()->user() && auth()->user()->is_student) {
            return view('student-attendance');
        }

        // Redirect admins to the Filament admin panel
        return redirect('/administrator/' . $id);
    });

    // Admin Attendance Page
    Route::get('/admin-attendance', function () {
        if (!auth()->user()->is_admin) {
            return redirect('/');
        }
        return view('admin-attendance');
    })->name('admin.attendance');

    // Tutor Attendance Page
    Route::get('/tutor-attendance', function () {
        if (!auth()->user()->is_tutor) {
            return redirect('/');
        }
        return view('tutor-attendance');
    })->name('tutor.attendance');

    // Support the administrator URL pattern for tutor attendance
    Route::get('/administrator/{id}/tutor-attendance', function ($id) {
        // Only allow tutors to access this page
        if (auth()->user() && auth()->user()->is_tutor) {
            return view('tutor-attendance');
        }

        // Redirect non-tutors to the Filament admin panel
        return redirect('/administrator/' . $id);
    });
});

// Fallback route for React router
Route::get('/administrator/{path}', function () {
    return view('my-courses');
})->where('path', '.*');
