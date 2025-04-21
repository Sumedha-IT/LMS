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


Route::get('/administrator/{adminId}/examinations/user/{userId}/exam/{examId}/result}', function ($userId, $examId) {
    return view('examResult');  // This should point to the Blade file that loads the React component.
})->name('user.exam.examResult');

Route::get('/user', function () {
    return redirect('/administrator');
});

// MyCourses React UI routes
Route::middleware(['auth'])->group(function () {
    // React UI route
    Route::get('/my-courses', function () {
        return view('my-courses');
    })->name('my-courses');
});

// Fallback route for React router
Route::get('/administrator/{path}', function () {
    return view('my-courses');
})->where('path', '.*');
