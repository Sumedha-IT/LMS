<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TemplateController extends Controller
{
    /**
     * Download user import template
     */
    public function downloadUserImportTemplate(Request $request)
    {
        try {
            $file = public_path('templates/user_import_template.csv');
            
            if (!file_exists($file)) {
                Log::error('User import template file not found', [
                    'file_path' => $file,
                    'user_id' => auth()->id() ?? 'guest'
                ]);
                
                return response()->json([
                    'error' => 'Template file not found',
                    'message' => 'The user import template file is not available. Please contact the administrator.'
                ], 404);
            }

            $headers = [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="user_import_template.csv"',
                'Cache-Control' => 'no-cache, must-revalidate',
                'Pragma' => 'no-cache'
            ];

            Log::info('User import template downloaded', [
                'user_id' => auth()->id() ?? 'guest',
                'ip_address' => $request->ip()
            ]);

            return response()->download($file, 'user_import_template.csv', $headers);

        } catch (\Exception $e) {
            Log::error('Error downloading user import template', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id() ?? 'guest',
                'ip_address' => $request->ip()
            ]);

            return response()->json([
                'error' => 'Download failed',
                'message' => 'An error occurred while downloading the template. Please try again.'
            ], 500);
        }
    }

    /**
     * Get template information
     */
    public function getTemplateInfo(Request $request)
    {
        $file = public_path('templates/user_import_template.csv');
        
        return response()->json([
            'template_available' => file_exists($file),
            'download_url' => route('user.import.template'),
            'instructions' => 'Download the template file, fill in the user data, and upload the CSV file. Required fields: role, name, email, password. Optional fields: contact_number, gender, batch_name. If batch_name is provided, users will be automatically assigned to the specified batch.',
            'documentation_url' => '/docs/user-import-template-guide.md'
        ]);
    }
}
