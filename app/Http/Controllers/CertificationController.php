<?php

namespace App\Http\Controllers;

use App\Models\Certification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CertificationController extends Controller
{
    public function index()
    {
        $certifications = auth()->user()->certifications;
        return response()->json(['data' => $certifications]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'certification_name' => 'required|string',
            'authority' => 'required|string',
            'certification_date' => 'required|date',
            'score' => 'nullable|numeric|min:0|max:100',
            'certificate_number' => 'required|string',
            'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except('certificate_file');
        
        if ($request->hasFile('certificate_file')) {
            $file = $request->file('certificate_file');
            $path = $file->store('certificates', 'public');
            $data['path'] = $path; // Store only the path, not the full URL
        }

        // Add user_id to the data array
        $data['user_id'] = auth()->id();

        $certification = Certification::create($data);

        return response()->json([
            'message' => 'Certification added successfully',
            'data' => $certification
        ], 201);
    }

    public function update(Request $request, Certification $certification)
    {
        // Check if the certification belongs to the authenticated user
        if ($certification->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'certification_name' => 'required|string',
            'authority' => 'required|string',
            'certification_date' => 'required|date',
            'score' => 'nullable|numeric|min:0|max:100',
            'certificate_number' => 'required|string',
            'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except('certificate_file');

        if ($request->hasFile('certificate_file')) {
            // Delete old file if exists
            if ($certification->path) {
                Storage::disk('public')->delete($certification->path);
            }

            $file = $request->file('certificate_file');
            $path = $file->store('certificates', 'public');
            $data['path'] = $path; // Store only the path, not the full URL
        }

        $certification->update($data);

        return response()->json([
            'message' => 'Certification updated successfully',
            'data' => $certification
        ]);
    }

    public function destroy(Certification $certification)
    {
        if ($certification->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete file if exists
        if ($certification->path) {
            Storage::disk('public')->delete($certification->path);
        }

        $certification->delete();

        return response()->json([
            'message' => 'Certification deleted successfully'
        ]);
    }
} 