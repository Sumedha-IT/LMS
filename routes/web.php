<?php

use Illuminate\Support\Facades\Route;

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
