<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Curriculum;
use App\Models\Section;
use App\Models\Topic;
use App\Models\Batch;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CurriculumManagementController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            
            // Check if user has admin/coordinator permissions
            if (!$user->is_admin && !$user->is_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $curriculums = Curriculum::with(['courses', 'sections', 'topics'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($curriculum) {
                    return [
                        'id' => $curriculum->id,
                        'name' => $curriculum->name,
                        'short_description' => $curriculum->short_description,
                        'image' => $curriculum->image ? asset('storage/' . $curriculum->image) : null,
                        'courses' => $curriculum->courses->map(function ($course) {
                            return [
                                'id' => $course->id,
                                'name' => $course->name
                            ];
                        }),
                        'sections_count' => $curriculum->sections->count(),
                        'topics_count' => $curriculum->topics->count(),
                        'created_at' => $curriculum->created_at,
                        'updated_at' => $curriculum->updated_at
                    ];
                });

            return response()->json([
                'curriculums' => $curriculums,
                'total' => $curriculums->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching curriculums: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch curriculums'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user->is_admin && !$user->is_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'short_description' => 'nullable|string',
                'courses' => 'required|array',
                'courses.*' => 'exists:courses,id',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $curriculum = new Curriculum();
            $curriculum->name = $request->name;
            $curriculum->short_description = $request->short_description;

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('curriculum-images', 'public');
                $curriculum->image = $imagePath;
            }

            $curriculum->save();

            // Attach courses
            $curriculum->courses()->attach($request->courses);

            return response()->json([
                'success' => true,
                'message' => 'Curriculum created successfully',
                'curriculum' => $curriculum
            ]);
        } catch (\Exception $e) {
            Log::error('Error creating curriculum: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create curriculum'], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = Auth::user();
            
            if (!$user->is_admin && !$user->is_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $curriculum = Curriculum::with(['courses', 'sections', 'topics'])
                ->findOrFail($id);

            return response()->json([
                'curriculum' => [
                    'id' => $curriculum->id,
                    'name' => $curriculum->name,
                    'short_description' => $curriculum->short_description,
                    'image' => $curriculum->image ? asset('storage/' . $curriculum->image) : null,
                    'courses' => $curriculum->courses->map(function ($course) {
                        return [
                            'id' => $course->id,
                            'name' => $course->name
                        ];
                    }),
                    'sections' => $curriculum->sections->map(function ($section) {
                        return [
                            'id' => $section->id,
                            'name' => $section->name,
                            'short_description' => $section->short_description,
                            'move_next' => $section->move_next,
                            'published' => $section->published,
                            'sort' => $section->sort
                        ];
                    }),
                    'topics' => $curriculum->topics->map(function ($topic) {
                        return [
                            'id' => $topic->id,
                            'name' => $topic->name
                        ];
                    })
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching curriculum: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch curriculum'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();
            
            if (!$user->is_admin && !$user->is_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Log the request data for debugging
            Log::info('Curriculum update request', [
                'id' => $id,
                'request_data' => $request->all(),
                'files' => $request->hasFile('image') ? 'Has image file' : 'No image file',
                'user_id' => $user->id
            ]);

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'short_description' => 'nullable|string',
                'courses' => 'required|array',
                'courses.*' => 'exists:courses,id',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed for curriculum update', [
                    'errors' => $validator->errors(),
                    'request_data' => $request->all()
                ]);
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $curriculum = Curriculum::findOrFail($id);
            $curriculum->name = $request->name;
            $curriculum->short_description = $request->short_description;

            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($curriculum->image) {
                    Storage::disk('public')->delete($curriculum->image);
                }
                
                $imagePath = $request->file('image')->store('curriculum-images', 'public');
                $curriculum->image = $imagePath;
            }

            $curriculum->save();

            // Sync courses
            $curriculum->courses()->sync($request->courses);

            Log::info('Curriculum updated successfully', [
                'curriculum_id' => $curriculum->id,
                'name' => $curriculum->name,
                'courses_count' => count($request->courses)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Curriculum updated successfully',
                'curriculum' => $curriculum
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating curriculum: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update curriculum'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = Auth::user();
            
            if (!$user->is_admin && !$user->is_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $curriculum = Curriculum::findOrFail($id);

            // Delete image if exists
            if ($curriculum->image) {
                Storage::disk('public')->delete($curriculum->image);
            }

            // Delete related sections and topics
            $curriculum->sections()->delete();
            $curriculum->topics()->delete();

            // Detach courses
            $curriculum->courses()->detach();

            $curriculum->delete();

            return response()->json([
                'success' => true,
                'message' => 'Curriculum deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting curriculum: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete curriculum'], 500);
        }
    }

    public function getSections($curriculumId)
    {
        try {
            $user = Auth::user();
            
            if (!$user->is_admin && !$user->is_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $sections = Section::where('curriculum_id', $curriculumId)
                ->orderBy('sort')
                ->get()
                ->map(function ($section) {
                    return [
                        'id' => $section->id,
                        'name' => $section->name,
                        'short_description' => $section->short_description,
                        'move_next' => $section->move_next,
                        'published' => $section->published,
                        'sort' => $section->sort,
                        'created_at' => $section->created_at,
                        'updated_at' => $section->updated_at
                    ];
                });

            return response()->json([
                'sections' => $sections,
                'total' => $sections->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching sections: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch sections'], 500);
        }
    }

    public function storeSection(Request $request, $curriculumId)
    {
        try {
            $user = Auth::user();
            
            if (!$user->is_admin && !$user->is_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'short_description' => 'nullable|string',
                'move_next' => 'boolean',
                'published' => 'boolean',
                'sort' => 'required|integer|min:1'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $section = new Section();
            $section->curriculum_id = $curriculumId;
            $section->name = $request->name;
            $section->short_description = $request->short_description;
            $section->move_next = $request->move_next ?? false;
            $section->published = $request->published ?? true;
            $section->sort = $request->sort;
            $section->save();

            // Attach to all batches in the current tenant
            $tenant = \Filament\Facades\Filament::getTenant();
            
            // If no tenant from Filament, try to get from user's teams
            if (!$tenant || !$tenant->id) {
                $userTeams = $user->teams;
                if ($userTeams->isNotEmpty()) {
                    // Use the first team as tenant
                    $tenant = $userTeams->first();
                    Log::info('Using user team as tenant for section creation. User ID: ' . $user->id . ', Team ID: ' . $tenant->id);
                }
            }
            
            if ($tenant && $tenant->id) {
                $batches = Batch::where('branch_id', $tenant->id)->pluck('id')->all();
                $section->batches()->attach($batches);
            }

            return response()->json([
                'success' => true,
                'message' => 'Section created successfully',
                'section' => $section
            ]);
        } catch (\Exception $e) {
            Log::error('Error creating section: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create section'], 500);
        }
    }

    public function updateSection(Request $request, $curriculumId, $sectionId)
    {
        try {
            $user = Auth::user();
            
            if (!$user->is_admin && !$user->is_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'short_description' => 'nullable|string',
                'move_next' => 'boolean',
                'published' => 'boolean',
                'sort' => 'required|integer|min:1'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $section = Section::where('curriculum_id', $curriculumId)
                ->where('id', $sectionId)
                ->firstOrFail();

            $section->name = $request->name;
            $section->short_description = $request->short_description;
            $section->move_next = $request->move_next ?? false;
            $section->published = $request->published ?? true;
            $section->sort = $request->sort;
            $section->save();

            return response()->json([
                'success' => true,
                'message' => 'Section updated successfully',
                'section' => $section
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating section: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update section'], 500);
        }
    }

    public function destroySection($curriculumId, $sectionId)
    {
        try {
            $user = Auth::user();
            
            if (!$user->is_admin && !$user->is_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $section = Section::where('curriculum_id', $curriculumId)
                ->where('id', $sectionId)
                ->firstOrFail();

            $section->delete();

            return response()->json([
                'success' => true,
                'message' => 'Section deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting section: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete section'], 500);
        }
    }

    public function getTopics($curriculumId)
    {
        try {
            $user = Auth::user();
            
            if (!$user->is_admin && !$user->is_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Get topics without batch-specific status to avoid duplication
            $topics = \App\Models\Topic::where('curriculum_id', $curriculumId)
                ->select('id', 'name', 'curriculum_id', 'created_at', 'updated_at')
                ->orderBy('created_at', 'asc')
                ->get()
                ->map(function ($topic) {
                    return [
                        'id' => $topic->id,
                        'name' => $topic->name,
                        'curriculum_id' => $topic->curriculum_id,
                        'created_at' => $topic->created_at,
                        'updated_at' => $topic->updated_at,
                        'is_started' => false, // Default values for curriculum management
                        'is_completed' => false, // Default values for curriculum management
                    ];
                });

            return response()->json([
                'topics' => $topics,
                'total' => $topics->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching topics: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch topics'], 500);
        }
    }

    public function storeTopic(Request $request, $curriculumId)
    {
        try {
            $user = Auth::user();
            
            if (!$user->is_admin && !$user->is_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $topic = new Topic();
            $topic->curriculum_id = $curriculumId;
            $topic->name = $request->name;
            $topic->save();

            return response()->json([
                'success' => true,
                'message' => 'Topic created successfully',
                'topic' => $topic
            ]);
        } catch (\Exception $e) {
            Log::error('Error creating topic: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create topic'], 500);
        }
    }

    public function updateTopic(Request $request, $curriculumId, $topicId)
    {
        try {
            $user = Auth::user();
            
            if (!$user->is_admin && !$user->is_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $topic = Topic::where('curriculum_id', $curriculumId)
                ->where('id', $topicId)
                ->firstOrFail();

            $topic->name = $request->name;
            $topic->save();

            return response()->json([
                'success' => true,
                'message' => 'Topic updated successfully',
                'topic' => $topic
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating topic: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update topic'], 500);
        }
    }

    public function destroyTopic($curriculumId, $topicId)
    {
        try {
            $user = Auth::user();
            
            if (!$user->is_admin && !$user->is_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $topic = Topic::where('curriculum_id', $curriculumId)
                ->where('id', $topicId)
                ->firstOrFail();

            $topic->delete();

            return response()->json([
                'success' => true,
                'message' => 'Topic deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting topic: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete topic'], 500);
        }
    }

    public function getCourses()
    {
        try {
            $user = Auth::user();
            
            if (!$user->is_admin && !$user->is_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $courses = Course::select('id', 'name')
                ->orderBy('name')
                ->get();

            return response()->json([
                'courses' => $courses
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching courses: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch courses'], 500);
        }
    }

    public function getBatches()
    {
        try {
            $user = Auth::user();
            
            if (!$user->is_admin && !$user->is_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Try to get tenant from Filament first
            $tenant = \Filament\Facades\Filament::getTenant();
            
            // If no tenant from Filament, try to get from user's teams
            if (!$tenant || !$tenant->id) {
                $userTeams = $user->teams;
                if ($userTeams->isNotEmpty()) {
                    // Use the first team as tenant
                    $tenant = $userTeams->first();
                    Log::info('Using user team as tenant. User ID: ' . $user->id . ', Team ID: ' . $tenant->id);
                } else {
                    // If no teams, return empty collection
                    $batches = collect();
                    Log::warning('No tenant or teams found for batches request. User ID: ' . $user->id);
                    
                    return response()->json([
                        'batches' => $batches
                    ]);
                }
            }

            // Now we have a tenant, fetch batches
            $batches = Batch::where('branch_id', $tenant->id)
                ->select('id', 'name')
                ->orderBy('name')
                ->get();

            return response()->json([
                'batches' => $batches
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching batches: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch batches'], 500);
        }
    }
} 