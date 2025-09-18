<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Database\QueryException;
use PDOException;
use Throwable;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $e)
    {
        // Handle database lock timeout errors
        if ($e instanceof PDOException || $e instanceof QueryException) {
            if (str_contains($e->getMessage(), 'Lock wait timeout exceeded')) {
                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'Database is temporarily busy. Please try again in a moment.',
                        'success' => false,
                        'status' => 503
                    ], 503);
                }
                
                return response()->view('errors.503', [], 503);
            }
        }

        return parent::render($request, $e);
    }
}
