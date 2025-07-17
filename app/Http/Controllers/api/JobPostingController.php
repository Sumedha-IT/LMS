<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use Illuminate\Http\Request;

class JobPostingController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        return JobPosting::with('company', 'postedBy')->get();
    }

    public function show($id)
    {
        return JobPosting::with('company', 'postedBy')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $jobPosting = JobPosting::create($request->all());
        return response()->json($jobPosting, 201);
    }

    public function update(Request $request, $id)
    {
        $jobPosting = JobPosting::findOrFail($id);
        $jobPosting->update($request->all());
        return response()->json($jobPosting);
    }

    public function destroy($id)
    {
        $jobPosting = JobPosting::findOrFail($id);
        $jobPosting->delete();
        return response()->json(null, 204);
    }
} 