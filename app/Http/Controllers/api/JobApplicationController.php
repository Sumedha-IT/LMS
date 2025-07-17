<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;

class JobApplicationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        return JobApplication::with('jobPosting', 'user')->get();
    }

    public function show($id)
    {
        return JobApplication::with('jobPosting', 'user')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $jobApplication = JobApplication::create($request->all());
        return response()->json($jobApplication, 201);
    }

    public function update(Request $request, $id)
    {
        $jobApplication = JobApplication::findOrFail($id);
        $jobApplication->update($request->all());
        return response()->json($jobApplication);
    }

    public function destroy($id)
    {
        $jobApplication = JobApplication::findOrFail($id);
        $jobApplication->delete();
        return response()->json(null, 204);
    }
} 