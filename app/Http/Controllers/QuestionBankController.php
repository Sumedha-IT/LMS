<?php

namespace App\Http\Controllers;


use App\Http\Resources\QuestionBankResource;
use App\Models\QuestionBank;
use App\Models\QuestionBankDifficulty;
use App\Models\QuestionBankType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Filament\Imports\QuestionBankImporter;
use Filament\Actions\Imports\ImportColumn;
use Filament\Actions\Imports\Importer;

class QuestionBankController extends Controller
{

    public function show($id){
        $validator = Validator::make(['id' => $id], [
            'id' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Question Bank Id must be Integer', 'hasError'=>true], 400);
        }
        $questionBank = QuestionBank::find($id);

        if (empty($questionBank)) {
            return response()->json(['message' => 'Question bank not found', 'hasError'=>false], 404);
        }            
        return new QuestionBankResource($questionBank);
    }

    public function index(Request $req)
    {
        $size = $req->get('size') == 0 ? 25 : $req->get('size');
        $pageNo = $req->get('page', 1);
        $offset = ($pageNo - 1) * $size;

        $totalRecords = QuestionBank::count();

        // Fetch the records for the current page with relationships
        $questionBanks = QuestionBank::with(['curriculum', 'question_bank_difficulty', 'question_bank_type'])
            ->withCount('questions')
            ->offset($offset)
            ->limit($size);

        $data = [
            "data" => ($questionBanks->count() == 0) ? [] : QuestionBankResource::collection($questionBanks->get()),
            "totalRecords" => $totalRecords,
            "totalPages" => ceil($totalRecords / $size)
        ];
        return response()->json($data, 200);
    }

    public function create(Request $req)
    {
        $data = $req->data;
        $data = $this->validateQuestionBank($data);
        if (!empty($data['message'])) {
            return response()->json($data, 400);
        }
        
        QuestionBank::create($data);
        return response()->json(['message' => "Question Bank Created","hasError"=>false], 200);
    }

    public function update($id, Request $req)
    {
        $questionBank = QuestionBank::find($id);
        if (empty($questionBank)) {
            return response()->json(['message' => 'Question bank not found', 'hasError'=>true], 404);
        }

        $data = $req->data;
        $data = $this->validateQuestionBank($data);
        if (!empty($data['message'])) {
            return response()->json($data, 400);
        }

        $questionBank->update($data);
        return response()->json(['message' => "Question Bank Updated","hasError"=>false], 200);
    }

    public function validateQuestionBank($data)
    {
        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
            'question_bank_subject_id' => 'required|integer|exists:curriculums,id',
            'question_bank_chapter' => 'required|string|max:255',
            'question_bank_difficulty_id' => 'required|integer|exists:question_bank_difficulties,id',
            'question_bank_type_id' => 'required|integer|exists:question_bank_types,id',
            'description' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400, 'hasError' => true];
        }

        return $data;
    }

    public function delete($id){
        $questionBank = QuestionBank::find($id);
        if ($questionBank) {
            $questionBank->delete();
            return response()->json(['message' => 'Question bank deleted successfully',"hasError"=>false], 200);
        }
        return response()->json(['message' => 'Question bank not found',"hasError"=>false], 404);
    }

    public function updateQuestion(Request $request, $id)
    {
        try {
            // Handle FormData parsing for PUT requests
            $data = $request->all();
            if (empty($data) && $request->header('Content-Type') && strpos($request->header('Content-Type'), 'multipart/form-data') !== false) {
                // Try different methods to get FormData
                $data = [];
                
                // Method 1: Try request->input()
                $allInputs = $request->input();
                if (!empty($allInputs)) {
                    $data = $allInputs;
                }
                
                // Method 2: Try request->post()
                if (empty($data)) {
                    $postData = $request->post();
                    if (!empty($postData)) {
                        $data = $postData;
                    }
                }
                
                // Method 3: Try $_POST directly (fallback)
                if (empty($data) && !empty($_POST)) {
                    $data = $_POST;
                }
                
                // Method 4: Try parsing raw content
                if (empty($data)) {
                    $rawData = $request->getContent();
                    if (!empty($rawData)) {
                        parse_str($rawData, $data);
                    }
                }
                
                // Handle options array from FormData
                $options = [];
                foreach ($data as $key => $value) {
                    if (preg_match('/^options\[(\d+)\]\[(\w+)\]$/', $key, $matches)) {
                        $index = $matches[1];
                        $field = $matches[2];
                        if (!isset($options[$index])) {
                            $options[$index] = [];
                        }
                        $options[$index][$field] = $value;
                    }
                }
                if (!empty($options)) {
                    $data['options'] = array_values($options);
                }
                
                \Log::info('FormData parsing result', [
                    'original_all' => $request->all(),
                    'parsed_data' => $data,
                    'all_inputs' => $request->input(),
                    'post_data' => $request->post(),
                    'global_post' => $_POST,
                    'raw_content_length' => strlen($request->getContent())
                ]);
            }

            \Log::info('QuestionBankController::updateQuestion called', [
                'question_id' => $id,
                'request_data' => $data,
                'request_input' => $request->input(),
                'request_post' => $request->post(),
                'files' => $request->hasFile('image') ? 'Image present' : 'No image',
                'method' => $request->method(),
                'url' => $request->url(),
                'headers' => $request->headers->all(),
                'content_type' => $request->header('Content-Type')
            ]);

            $question = \App\Models\Question::find($id);
            if (!$question) {
                return response()->json([
                    'success' => false,
                    'message' => 'Question not found'
                ], 404);
            }

            // Validate request
            $validator = Validator::make($data, [
                'question' => 'required|string',
                'question_type' => 'required|string',
                'marks' => 'required|numeric|min:0',
                'negative_marks' => 'nullable|numeric|min:0',
                'hint' => 'nullable|string',
                'explanation' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
                'options' => 'required|array|min:1',
                'options.*.option' => 'required|string',
                'options.*.is_correct' => 'required|in:0,1'
            ]);

            if ($validator->fails()) {
                \Log::error('Validation failed', [
                    'errors' => $validator->errors()->toArray(),
                    'data' => $data,
                    'request_all' => $request->all(),
                    'request_input' => $request->input(),
                    'request_post' => $request->post()
                ]);
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()->first()
                ], 400);
            }

            // Update question
            $question->question = $data['question'];
            $question->question_type = $data['question_type'];
            $question->marks = $data['marks'];
            $question->negative_marks = $data['negative_marks'];
            $question->hint = $data['hint'];
            $question->explanation = $data['explanation'];

            // Handle image upload
            if ($request->hasFile('image')) {
                try {
                    $image = $request->file('image');
                    $uploadPath = public_path('uploads/questions');
                    
                    // Create directory if it doesn't exist
                    if (!file_exists($uploadPath)) {
                        mkdir($uploadPath, 0755, true);
                    }
                    
                    $imageName = time() . '_' . $image->getClientOriginalName();
                    $image->move($uploadPath, $imageName);
                    $question->image = 'uploads/questions/' . $imageName;
                    
                    \Log::info('Image uploaded successfully', [
                        'original_name' => $image->getClientOriginalName(),
                        'saved_name' => $imageName,
                        'saved_path' => $question->image,
                        'file_exists' => file_exists($uploadPath . '/' . $imageName)
                    ]);
                } catch (\Exception $e) {
                    \Log::error('Error uploading image', [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to upload image: ' . $e->getMessage()
                    ], 500);
                }
            }

            $question->save();

            // Update options
            $options = $data['options'] ?? [];
            
            // Delete existing options that are not in the new list
            $existingOptionIds = collect($options)->pluck('id')->filter()->toArray();
            \App\Models\QuestionOption::where('question_id', $question->id)
                ->whereNotIn('id', $existingOptionIds)
                ->delete();

            // Update or create options
            foreach ($options as $optionData) {
                if (isset($optionData['id'])) {
                    // Update existing option
                    $option = \App\Models\QuestionOption::find($optionData['id']);
                    if ($option && $option->question_id == $question->id) {
                        $option->option = $optionData['option'];
                        $option->is_correct = (bool) $optionData['is_correct'];
                        $option->save();
                    }
                } else {
                    // Create new option
                    \App\Models\QuestionOption::create([
                        'question_id' => $question->id,
                        'option' => $optionData['option'],
                        'is_correct' => (bool) $optionData['is_correct']
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Question updated successfully',
                'question' => $question->load('questions_options')
            ]);

        } catch (\Exception $e) {
            \Log::error('Error updating question', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update question: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getQuestionBankTypes(){
        return response()->json(QuestionBankType::all(),200);
    }

    public function getQuestionBankDifficulties(){
        return response()->json(QuestionBankDifficulty::all());
    }

    public function import(Request $request)
    {
        try {
            \Log::info('Import request received', [
                'has_file' => $request->hasFile('file'),
                'file_name' => $request->file('file')?->getClientOriginalName(),
                'file_size' => $request->file('file')?->getSize(),
                'file_extension' => $request->file('file')?->getClientOriginalExtension(),
                'file_mime_type' => $request->file('file')?->getMimeType(),
            ]);

            $validator = Validator::make($request->all(), [
                'file' => 'required|file|mimes:csv,xlsx,xls,txt|max:10240',
            ]);

            if ($validator->fails()) {
                \Log::error('Import validation failed', $validator->errors()->toArray());
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()->first()
                ], 400);
            }

            $file = $request->file('file');
            $rows = $this->readExcelFile($file);

            \Log::info('File read successfully', [
                'total_rows' => count($rows),
                'first_row' => $rows[0] ?? 'No data',
                'file_extension' => $file->getClientOriginalExtension()
            ]);

            // Debug: Log the parsed data for troubleshooting
            if (count($rows) > 1) {
                \Log::info('Sample parsed data', [
                    'row_1' => $rows[1] ?? 'No row 1',
                    'row_2' => $rows[2] ?? 'No row 2',
                    'question_field_length' => isset($rows[2][7]) ? strlen($rows[2][7]) : 'No question field'
                ]);
            }

            if (empty($rows)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No data found in the uploaded file. Please ensure the file contains valid data and is in the correct format.'
                ], 400);
            }

            $successfulBanks = 0;
            $successfulQuestions = 0;
            $failedRows = 0;
            $errors = [];
            $currentBank = null;
            $header = $rows[0];
            $colMap = array_flip($header);

            for ($rowIndex = 1; $rowIndex < count($rows); $rowIndex++) {
                $row = $rows[$rowIndex];
                $type = isset($colMap['Type']) ? ($row[$colMap['Type']] ?? null) : null;
                try {
                    if (strtoupper($type) === 'BANK') {
                        // Create or get subject, difficulty, type
                        $subject = \App\Models\Curriculum::firstOrCreate(
                            ['name' => $row[$colMap['subject_name']]],
                            ['name' => $row[$colMap['subject_name']]]
                        );
                        $difficulty = \App\Models\QuestionBankDifficulty::firstOrCreate(
                            ['name' => $row[$colMap['difficulty_name']]],
                            ['name' => $row[$colMap['difficulty_name']]]
                        );
                        $questionType = \App\Models\QuestionBankType::firstOrCreate(
                            ['name' => $row[$colMap['question_type_name']]],
                            ['name' => $row[$colMap['question_type_name']]]
                        );
                        // Create the question bank
                        $currentBank = \App\Models\QuestionBank::create([
                            'name' => $row[$colMap['name']],
                            'question_bank_subject_id' => $subject->id,
                            'question_bank_chapter' => $row[$colMap['question_bank_chapter']],
                            'question_bank_difficulty_id' => $difficulty->id,
                            'question_bank_type_id' => $questionType->id,
                            'description' => $row[$colMap['description']] ?? null,
                        ]);
                        $successfulBanks++;
                    } elseif (strtoupper($type) === 'Q' && $currentBank) {
                        // Get the question content
                        $questionContent = $row[$colMap['question']] ?? '';
                        
                        // Format the question content if it contains code
                        $formattedQuestionContent = $this->formatQuestionContent($questionContent);
                        
                        // Debug: Log the question content before saving
                        \Log::info('Processing question', [
                            'row_index' => $rowIndex,
                            'question_length' => strlen($questionContent),
                            'formatted_length' => strlen($formattedQuestionContent),
                            'question_preview' => substr($questionContent, 0, 100) . '...',
                            'col_map' => $colMap,
                            'question_index' => $colMap['question'] ?? 'not_found'
                        ]);
                        
                        // Create the question
                        $question = \App\Models\Question::create([
                            'question_bank_id' => $currentBank->id,
                            'question' => $formattedQuestionContent,
                            'question_type' => $row[$colMap['question_type']] ?? '',
                            'marks' => $row[$colMap['marks']] ?? 0,
                            'negative_marks' => $row[$colMap['negative_marks']] ?? 0,
                        ]);
                        // Create options
                        for ($i = 1; $i <= 4; $i++) {
                            $optionKey = 'option_' . $i;
                            if (isset($colMap[$optionKey]) && !empty($row[$colMap[$optionKey]])) {
                                $correctAnswers = $row[$colMap['correct_answer']] ?? '';
                                $correctAnswerArray = [];
                                if (strpos($correctAnswers, ',') !== false) {
                                    $correctAnswerArray = array_map('trim', explode(',', $correctAnswers));
                                } else {
                                    $correctAnswerArray = [$correctAnswers];
                                }
                                $correct = in_array((string)$i, $correctAnswerArray);
                                \App\Models\QuestionOption::create([
                                    'question_id' => $question->id,
                                    'option' => $row[$colMap[$optionKey]],
                                    'is_correct' => $correct
                                ]);
                            }
                        }
                        $successfulQuestions++;
                    } else {
                        // Ignore or error
                        $failedRows++;
                        $errors[] = "Row " . ($rowIndex + 1) . ": Invalid or missing Type, or BANK not defined before Q.";
                    }
                } catch (\Exception $e) {
                    $failedRows++;
                    $errors[] = "Row " . ($rowIndex + 1) . ": " . $e->getMessage();
                }
            }

            return response()->json([
                'success' => true,
                'imported_count' => $successfulBanks,
                'total_questions' => $successfulQuestions,
                'failed_count' => $failedRows,
                'errors' => $errors,
                'message' => "Successfully imported $successfulBanks question banks with $successfulQuestions questions."
            ]);
        } catch (\Exception $e) {
            \Log::error('Import failed with exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage()
            ], 500);
        }
    }

    private function readExcelFile($file)
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $path = $file->getRealPath();

        if ($extension === 'csv') {
            // For CSV files, use a larger buffer size to handle long questions
            $data = [];
            if (($handle = fopen($path, "r")) !== FALSE) {
                // Set the maximum line length to 0 (unlimited) to handle very long questions
                while (($row = fgetcsv($handle, 0, ',')) !== FALSE) {
                    if (!empty(array_filter($row))) { // Skip empty rows
                        // Clean up any encoding issues and trim whitespace
                        $cleanedRow = array_map(function($field) {
                            // Remove any BOM characters and normalize line endings
                            $field = str_replace(["\xEF\xBB\xBF", "\r\n", "\r"], ["", "\n", "\n"], $field);
                            return trim($field);
                        }, $row);
                        $data[] = $cleanedRow;
                    }
                }
                fclose($handle);
            }
            return $data;
        } else {
            // For Excel files (xlsx, xls), try multiple approaches
            $data = [];
            
            // Method 1: Try to read as CSV with different delimiters
            $delimiters = [',', "\t", ';', '|'];
            
            foreach ($delimiters as $delimiter) {
                if (($handle = fopen($path, "r")) !== FALSE) {
                    $tempData = [];
                    while (($row = fgetcsv($handle, 0, $delimiter)) !== FALSE) {
                        if (!empty(array_filter($row))) { // Skip empty rows
                            $tempData[] = $row;
                        }
                    }
                    fclose($handle);
                    
                    if (!empty($tempData) && count($tempData) > 1) {
                        $data = $tempData;
                        break;
                    }
                }
            }
            
            // Method 2: If no data found, try to read the file as text and parse manually
            if (empty($data)) {
                $content = file_get_contents($path);
                if ($content !== false) {
                    // Try to extract CSV-like data from the content
                    $lines = explode("\n", $content);
                    foreach ($lines as $line) {
                        $line = trim($line);
                        if (!empty($line)) {
                            // Try different delimiters
                            foreach ($delimiters as $delimiter) {
                                $row = str_getcsv($line, $delimiter);
                                if (!empty($row) && count($row) > 1) {
                                    $data[] = $row;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            
            // Method 3: If still no data, try to read as XML (for some Excel files)
            if (empty($data)) {
                $content = file_get_contents($path);
                if ($content !== false && strpos($content, '<?xml') !== false) {
                    // Try to extract data from XML content
                    preg_match_all('/<c[^>]*>(.*?)<\/c>/s', $content, $matches);
                    if (!empty($matches[1])) {
                        $row = [];
                        foreach ($matches[1] as $cell) {
                            $row[] = strip_tags($cell);
                        }
                        if (!empty($row)) {
                            $data[] = $row;
                        }
                    }
                }
            }
            
            \Log::info('Excel file processing result', [
                'file' => $file->getClientOriginalName(),
                'extension' => $extension,
                'data_rows' => count($data),
                'first_row' => $data[0] ?? 'No data'
            ]);
            
            return $data;
        }
    }

    private function formatQuestionContent($content)
    {
        if (empty($content)) {
            return $content;
        }

        // Check if the content contains code patterns
        $codePatterns = [
            '/class\s+\w+/i',
            '/function\s+\w+/i',
            '/if\s*\(/i',
            '/for\s*\(/i',
            '/while\s*\(/i',
            '/switch\s*\(/i',
            '/try\s*\{/i',
            '/catch\s*\(/i',
            '/import\s+/i',
            '/export\s+/i',
            '/const\s+/i',
            '/let\s+/i',
            '/var\s+/i',
            '/public\s+/i',
            '/private\s+/i',
            '/protected\s+/i',
            '/static\s+/i',
            '/final\s+/i',
            '/abstract\s+/i',
            '/interface\s+/i',
            '/extends\s+/i',
            '/implements\s+/i',
            '/new\s+/i',
            '/return\s+/i',
            '/break\s+/i',
            '/continue\s+/i',
            '/throw\s+/i',
            '/throws\s+/i',
            '/package\s+/i',
            '/namespace\s+/i',
            '/using\s+/i',
            '/include\s+/i',
            '/require\s+/i',
            '/def\s+/i',
            '/end\s+/i',
            '/begin\s+/i',
            '/initial\s+/i',
            '/always\s+/i',
            '/module\s+/i',
            '/endmodule\s+/i',
            '/wire\s+/i',
            '/reg\s+/i',
            '/input\s+/i',
            '/output\s+/i',
            '/inout\s+/i',
            '/parameter\s+/i',
            '/localparam\s+/i',
            '/assign\s+/i',
            '/always_comb\s+/i',
            '/always_ff\s+/i',
            '/always_latch\s+/i',
            '/posedge\s+/i',
            '/negedge\s+/i',
            '/\$display\s*\(/i',
            '/\$finish\s*\(/i',
            '/\$stop\s*\(/i'
        ];

        $hasCodePattern = false;
        foreach ($codePatterns as $pattern) {
            if (preg_match($pattern, $content)) {
                $hasCodePattern = true;
                break;
            }
        }

        if ($hasCodePattern) {
            // Check if the entire content looks like a code block (has multiple lines with code patterns)
            $lines = explode("\n", $content);
            $codeLineCount = 0;
            $totalLines = count($lines);
            
            foreach ($lines as $line) {
                $trimmedLine = trim($line);
                if (!empty($trimmedLine)) {
                    foreach ($codePatterns as $pattern) {
                        if (preg_match($pattern, $trimmedLine)) {
                            $codeLineCount++;
                            break;
                        }
                    }
                }
            }
            
            // If more than 30% of lines contain code patterns, treat as a complete code block
            if ($codeLineCount > 0 && ($codeLineCount / max(1, $totalLines)) > 0.3) {
                // Format as a complete code block
                return '<pre style="background-color: #f8f9fa; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 14px; border: 1px solid #e9ecef; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; margin: 8px 0; line-height: 1.4;">' . htmlspecialchars($content) . '</pre>';
            } else {
                // Format individual lines as before
                $formattedLines = [];
                
                foreach ($lines as $line) {
                    $trimmedLine = trim($line);
                    if (!empty($trimmedLine)) {
                        // Check if this line contains code patterns
                        $isCodeLine = false;
                        foreach ($codePatterns as $pattern) {
                            if (preg_match($pattern, $trimmedLine)) {
                                $isCodeLine = true;
                                break;
                            }
                        }
                        
                        if ($isCodeLine) {
                            $formattedLines[] = '<div style="background-color: #f8f9fa; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 14px; margin: 4px 0; border: 1px solid #e9ecef; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">' . htmlspecialchars($line) . '</div>';
                        } else {
                            $formattedLines[] = '<div style="margin: 4px 0; word-wrap: break-word; overflow-wrap: break-word;">' . htmlspecialchars($line) . '</div>';
                        }
                    } else {
                        $formattedLines[] = '<div style="margin: 2px 0;">&nbsp;</div>';
                    }
                }
                
                return implode('', $formattedLines);
            }
        }

        return $content;
    }

    private function validateAndProcessRow($row)
    {
        // Map CSV columns to expected data structure
        $mappedData = [
            'name' => $row[0] ?? null,
            'subject_name' => $row[1] ?? null,
            'question_bank_chapter' => $row[2] ?? null,
            'difficulty_name' => $row[3] ?? null,
            'question_type_name' => $row[4] ?? null,
            'description' => $row[5] ?? null,
            'question' => $row[6] ?? null,
            'question_type' => $row[7] ?? null,
            'marks' => $row[8] ?? null,
            'negative_marks' => $row[9] ?? null,
            'hint' => $row[10] ?? null,
            'explanation' => $row[11] ?? null,
            'answer' => $row[12] ?? null,
            'check_capitalization' => $row[13] ?? null,
            'check_punctuation' => $row[14] ?? null,
            'audio_file' => $row[15] ?? null,
            'paragraph' => $row[16] ?? null,
            'difficulty' => $row[17] ?? null,
            'topic' => $row[18] ?? null,
            'option_1' => $row[19] ?? null,
            'option_2' => $row[20] ?? null,
            'option_3' => $row[21] ?? null,
            'option_4' => $row[22] ?? null,
            'option_5' => $row[23] ?? null,
            'option_6' => $row[24] ?? null,
            'option_7' => $row[25] ?? null,
            'option_8' => $row[26] ?? null,
            'option_9' => $row[27] ?? null,
            'option_10' => $row[28] ?? null,
            'correct_answer' => $row[29] ?? null,
        ];

        // Basic validation - check required fields
        if (empty($mappedData['name']) || empty($mappedData['subject_name']) || empty($mappedData['question'])) {
            return null;
        }

        // Convert numeric fields
        if (!empty($mappedData['marks'])) {
            $mappedData['marks'] = floatval($mappedData['marks']);
        }
        if (!empty($mappedData['negative_marks'])) {
            $mappedData['negative_marks'] = floatval($mappedData['negative_marks']);
        }

        // Convert boolean fields
        if (!empty($mappedData['check_capitalization'])) {
            $mappedData['check_capitalization'] = in_array(strtolower($mappedData['check_capitalization']), ['true', '1', 'yes', 'on']);
        }
        if (!empty($mappedData['check_punctuation'])) {
            $mappedData['check_punctuation'] = in_array(strtolower($mappedData['check_punctuation']), ['true', '1', 'yes', 'on']);
        }

        return $mappedData;
    }
}