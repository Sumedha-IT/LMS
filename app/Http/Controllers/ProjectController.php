<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Auth::user()->projects()->orderBy('start_date', 'desc')->get();
        return response()->json(['success' => true, 'projects' => $projects]);
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'technologies' => 'required|string',
                'project_type' => 'required|string',
                'project_url' => 'nullable|url',
                'key_achievements' => 'required|string',
                'organization' => 'required|string'
            ]);

            // Ensure user_id is set
            $validatedData['user_id'] = auth()->id();
            
            // Create project
            $project = Project::create($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Project created successfully',
                'project' => $project
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Project creation failed: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Failed to create project: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Project $project)
    {
        try {
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'technologies' => 'required|string',
                'project_type' => 'required|string',
                'project_url' => 'nullable|url',
                'key_achievements' => 'required|string',
                'organization' => 'required|string'
            ]);

            // Update project
            $project->update($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Project updated successfully',
                'project' => $project
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Project update failed: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Failed to update project: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Project $project)
    {
        try {
            // Delete associated files
            $projectFiles = json_decode($project->project_files ?? '[]', true);
            foreach ($projectFiles as $file) {
                Storage::disk('public')->delete($file['path']);
            }

            $project->delete();

            return response()->json([
                'success' => true,
                'message' => 'Project deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete project: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(Project $project)
    {
        if ($project->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'project' => $project
        ]);
    }
} 