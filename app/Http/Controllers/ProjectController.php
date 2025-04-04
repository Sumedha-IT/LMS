<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Auth::user()->projects()->orderBy('start_date', 'desc')->get();
        return response()->json(['success' => true, 'projects' => $projects]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'role' => 'required|string|max:255',
            'technologies' => 'required|string',
            'project_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_ongoing' => 'boolean',
            'team_size' => 'nullable|string|max:50',
            'key_achievements' => 'nullable|string',
            'project_type' => 'required|string|in:Academic,Personal,Professional',
            'client_name' => 'nullable|string|max:255',
            'organization' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $project = Auth::user()->projects()->create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully',
            'project' => $project
        ]);
    }

    public function update(Request $request, Project $project)
    {
        // Check if the project belongs to the authenticated user
        if ($project->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'role' => 'required|string|max:255',
            'technologies' => 'required|string',
            'project_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_ongoing' => 'boolean',
            'team_size' => 'nullable|string|max:50',
            'key_achievements' => 'nullable|string',
            'project_type' => 'required|string|in:Academic,Personal,Professional',
            'client_name' => 'nullable|string|max:255',
            'organization' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $project->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully',
            'project' => $project
        ]);
    }

    public function destroy(Project $project)
    {
        // Check if the project belongs to the authenticated user
        if ($project->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully'
        ]);
    }
} 