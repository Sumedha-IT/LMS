<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CompanyController extends Controller
{
    public function __construct()
    {
        // Require authentication for all methods
        $this->middleware('auth:sanctum');
    }

    public function test()
    {
        try {
            // Test database connection
            \DB::connection()->getPdo();
            \Log::info('Database connection successful');
            
            // Test if companies table exists
            $tableExists = \Schema::hasTable('companies');
            \Log::info('Companies table exists: ' . ($tableExists ? 'Yes' : 'No'));
            
            // Get table structure
            if ($tableExists) {
                $columns = \Schema::getColumnListing('companies');
                \Log::info('Companies table columns:', $columns);
            }
            
            return response()->json([
                'database_connected' => true,
                'table_exists' => $tableExists,
                'columns' => $tableExists ? $columns : []
            ]);
        } catch (\Exception $e) {
            \Log::error('Database test failed:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // GET /api/companies
    public function index()
    {
        $user = \Auth::user();
        
        // Check if user has admin/coordinator/placement coordinator permissions
        if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        return response()->json(Company::all());
    }

    // GET /api/companies/{id}
    public function show($id)
    {
        $user = \Auth::user();
        
        // Check if user has admin/coordinator/placement coordinator permissions
        if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $company = Company::find($id);

        if (!$company) {
            return response()->json(['error' => 'Company not found'], 404);
        }

        return response()->json($company);
    }

    // POST /api/companies
    public function store(Request $request)
    {
        $user = \Auth::user();
        
        // Check if user has admin/coordinator/placement coordinator permissions
        if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        \Log::info('Company store request received:', $request->all());
        
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'website' => 'nullable|url',
                'logo_path' => 'nullable|string',
                'industry' => 'nullable|string',
                'company_size' => 'nullable|string',
                'contact_person' => 'nullable|string',
                'designation' => 'nullable|string',
                'contact_email' => 'nullable|email',
                'contact_phone' => 'nullable|string',
                'address' => 'nullable|string',
                // New fields validation
                'company_address' => 'required|string',
                'city' => 'required|string|max:255',
                'state' => 'required|string|max:255',
                'country' => 'required|string|max:255',
                'contact_person_name' => 'required|string|max:255|regex:/^[A-Za-z\s]+$/',
                'contact_email_new' => 'required|email',
                'contact_number' => 'required|string|max:50',
                'alternate_contact_number' => 'nullable|string|max:50',
                'about_company' => 'required|string',
                'linkedin_url' => 'nullable|url|max:500',
                'social_media_links' => 'nullable|string',
                'is_active' => 'boolean',
            ]);
            
            $company = Company::create($validated);
            \Log::info('Company created successfully:', $company->toArray());
            return response()->json($company, 201);
        } catch (\Exception $e) {
            \Log::error('Error creating company:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // PUT /api/companies/{id}
    public function update(Request $request, $id)
    {
        $company = Company::find($id);

        if (!$company) {
            return response()->json(['error' => 'Company not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'website' => 'nullable|url',
            'logo_path' => 'nullable|string',
            'industry' => 'nullable|string',
            'company_size' => 'nullable|string',
            'contact_person' => 'nullable|string',
            'designation' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string',
            'address' => 'nullable|string',
            // New fields validation
            'company_address' => 'required|string',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'contact_person_name' => 'required|string|max:255|regex:/^[A-Za-z\s]+$/',
            'contact_email_new' => 'required|email',
            'contact_number' => 'required|string|max:50',
            'alternate_contact_number' => 'nullable|string|max:50',
            'about_company' => 'required|string',
            'linkedin_url' => 'nullable|url|max:500',
            'social_media_links' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $company->update($validated);

        return response()->json([
            'message' => 'Company updated successfully',
            'data' => $company
        ]);
    }

    // DELETE /api/companies/{id}
    public function destroy($id)
    {
        $company = Company::find($id);

        if (!$company) {
            return response()->json(['error' => 'Company not found'], 404);
        }

        $company->delete();

        return response()->json([
            'message' => 'Company deleted successfully'
        ], 204);
    }
}
