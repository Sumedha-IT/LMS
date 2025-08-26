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

    public function getUserProjects(Request $request, $userId)
    {
        // Check if the current user is an admin or has permission to view other users' data
        $user = $request->user();
        
        // Debug logging
        \Log::info('getUserProjects - User ID: ' . $user->id . ', Role ID: ' . ($user->role ? $user->role->id : 'null') . ', Is Admin: ' . ($user->is_admin ? 'true' : 'false'));
        
        // Allow admin, coordinator, and placement coordinator users to view any user's projects
        // You can add more specific permission checks here
        if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator && $user->id != $userId) {
            \Log::warning('getUserProjects - Unauthorized access attempt. User ID: ' . $user->id . ', Target User ID: ' . $userId);
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $projects = Project::where('user_id', $userId)
            ->orderBy('start_date', 'desc')
            ->get();
            
        return response()->json(['success' => true, 'projects' => $projects]);
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'technologies' => 'nullable|string',
                'project_type' => 'nullable|string',
                'project_url' => 'nullable|url',
                'key_achievements' => 'nullable|string',
                'organization' => 'nullable|string',
                'project_files' => 'nullable|array',
                'project_files.*' => 'nullable|file|max:10240' // 10MB max per file
            ]);

            // Ensure user_id is set
            $validatedData['user_id'] = auth()->id();
            
            // Handle file uploads
            $uploadedFiles = [];
            if ($request->hasFile('project_files')) {
                foreach ($request->file('project_files') as $file) {
                    $path = $file->store('project-files/' . auth()->id(), 'public');
                    $uploadedFiles[] = [
                        'name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'mime_type' => $file->getMimeType(),
                        'size' => $file->getSize()
                    ];
                }
            }
            $validatedData['project_files'] = json_encode($uploadedFiles);
            
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
                'description' => 'nullable|string',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'technologies' => 'nullable|string',
                'project_type' => 'nullable|string',
                'project_url' => 'nullable|url',
                'key_achievements' => 'nullable|string',
                'organization' => 'nullable|string',
                'project_files' => 'nullable|array',
                'project_files.*' => 'nullable|file|max:10240' // 10MB max per file
            ]);

            // Handle file uploads
            $existingFiles = json_decode($project->project_files ?? '[]', true);
            $uploadedFiles = $existingFiles;

            if ($request->hasFile('project_files')) {
                foreach ($request->file('project_files') as $file) {
                    $path = $file->store('project-files/' . auth()->id(), 'public');
                    $uploadedFiles[] = [
                        'name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'mime_type' => $file->getMimeType(),
                        'size' => $file->getSize()
                    ];
                }
            }
            $validatedData['project_files'] = json_encode($uploadedFiles);

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