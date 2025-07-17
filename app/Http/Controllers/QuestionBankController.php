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
            ]);

            $validator = Validator::make($request->all(), [
                'file' => 'required|file|mimetypes:text/plain,text/csv,application/csv,application/vnd.ms-excel,application/octet-stream,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12|max:10240',
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
                'first_row' => $rows[0] ?? 'No data'
            ]);

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
                        // Create the question
                        $question = \App\Models\Question::create([
                            'question_bank_id' => $currentBank->id,
                            'question' => $row[$colMap['question']] ?? '',
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
        $extension = $file->getClientOriginalExtension();
        $path = $file->getRealPath();

        if ($extension === 'csv') {
            return array_map('str_getcsv', file($path));
        } else {
            // For Excel files, try to read as CSV first (most Excel files can be read as CSV)
            $data = [];
            if (($handle = fopen($path, "r")) !== FALSE) {
                while (($row = fgetcsv($handle, 1000, ",")) !== FALSE) {
                    $data[] = $row;
                }
                fclose($handle);
            }
            
            // If no data was read, try with different delimiter
            if (empty($data)) {
                if (($handle = fopen($path, "r")) !== FALSE) {
                    while (($row = fgetcsv($handle, 1000, "\t")) !== FALSE) {
                        $data[] = $row;
                    }
                    fclose($handle);
                }
            }
            
            return $data;
        }
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