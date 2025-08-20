<?php

namespace App\Filament\Imports;

use App\Models\QuestionBank;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\Curriculum;
use App\Models\QuestionBankDifficulty;
use App\Models\QuestionBankType;
use Filament\Actions\Imports\ImportColumn;
use Filament\Actions\Imports\Importer;
use Filament\Actions\Imports\Models\Import;

class QuestionBankImporter extends Importer
{
    protected static ?string $model = QuestionBank::class;

    public static function getColumns(): array
    {
        return [
            // Question Bank Details
            ImportColumn::make('name')
                ->requiredMapping()
                ->rules(['required', 'max:255']),
            ImportColumn::make('subject_name')
                ->requiredMapping()
                ->rules(['required', 'max:255']),
            ImportColumn::make('question_bank_chapter')
                ->requiredMapping()
                ->rules(['required', 'max:255']),
            ImportColumn::make('difficulty_name')
                ->requiredMapping()
                ->rules(['required', 'max:255']),
            ImportColumn::make('question_type_name')
                ->requiredMapping()
                ->rules(['required', 'max:255']),
            ImportColumn::make('description')
                ->rules(['max:1000']),
            
            // Question Details
            ImportColumn::make('question')
                ->requiredMapping()
                ->rules(['required']),
            ImportColumn::make('question_type')
                ->requiredMapping()
                ->rules(['required', 'max:255']),
            ImportColumn::make('marks')
                ->requiredMapping()
                ->numeric()
                ->rules(['required']),
            ImportColumn::make('negative_marks')
                ->requiredMapping()
                ->rules(['required']),
            ImportColumn::make('hint'),
            ImportColumn::make('explanation'),
            ImportColumn::make('answer'),
            ImportColumn::make('check_capitalization')
                ->boolean(),
            ImportColumn::make('check_punctuation')
                ->boolean(),
            
            // Question Options
            ImportColumn::make('option_1'),
            ImportColumn::make('option_2'),
            ImportColumn::make('option_3'),
            ImportColumn::make('option_4'),
            ImportColumn::make('option_5'),
            ImportColumn::make('option_6'),
            ImportColumn::make('option_7'),
            ImportColumn::make('option_8'),
            ImportColumn::make('option_9'),
            ImportColumn::make('option_10'),
            ImportColumn::make('correct_answer'),
        ];
    }

    public function resolveRecord(): ?QuestionBank
    {
        return new QuestionBank();
    }

    public function saveRecord(): void
    {
        // Get or create the subject (curriculum)
        $subject = Curriculum::firstOrCreate(
            ['name' => $this->data['subject_name']],
            ['name' => $this->data['subject_name']]
        );

        // Get or create the difficulty
        $difficulty = QuestionBankDifficulty::firstOrCreate(
            ['name' => $this->data['difficulty_name']],
            ['name' => $this->data['difficulty_name']]
        );

        // Get or create the question type
        $questionType = QuestionBankType::firstOrCreate(
            ['name' => $this->data['question_type_name']],
            ['name' => $this->data['question_type_name']]
        );

        // Check if question bank already exists
        $existingQuestionBank = QuestionBank::where('name', $this->data['name'])
            ->where('question_bank_subject_id', $subject->id)
            ->where('question_bank_chapter', $this->data['question_bank_chapter'])
            ->first();

        if ($existingQuestionBank) {
            // Use existing question bank
            $this->record = $existingQuestionBank;
        } else {
            // Create new question bank
            $this->record->name = $this->data['name'];
            $this->record->question_bank_subject_id = $subject->id;
            $this->record->question_bank_chapter = $this->data['question_bank_chapter'];
            $this->record->question_bank_difficulty_id = $difficulty->id;
            $this->record->question_bank_type_id = $questionType->id;
            $this->record->description = $this->data['description'] ?? null;
            $this->record->save();
        }

        // Now create the question
        $questionData = clone $this->data;
        
        // Remove question bank related fields
        unset($questionData['name']);
        unset($questionData['subject_name']);
        unset($questionData['question_bank_chapter']);
        unset($questionData['difficulty_name']);
        unset($questionData['question_type_name']);
        unset($questionData['description']);
        unset($questionData['option_1']);
        unset($questionData['option_2']);
        unset($questionData['option_3']);
        unset($questionData['option_4']);
        unset($questionData['option_5']);
        unset($questionData['option_6']);
        unset($questionData['option_7']);
        unset($questionData['option_8']);
        unset($questionData['option_9']);
        unset($questionData['option_10']);
        unset($questionData['correct_answer']);

        // Add question bank ID
        $questionData['question_bank_id'] = $this->record->id;

        // Format question content if it contains code
        if (!empty($questionData['question'])) {
            $questionData['question'] = $this->formatQuestionContent($questionData['question']);
        }

        // Create the question
        $question = Question::create($questionData);

        // Create question options
        for ($i = 1; $i <= 10; $i++) {
            $option = 'option_' . $i;
            if (!empty($this->data[$option])) {
                $correct = in_array($i, explode(",", $this->data['correct_answer'] ?? ''));
                QuestionOption::create([
                    'question_id' => $question->id,
                    'option' => $this->data[$option],
                    'is_correct' => $correct
                ]);
            }
        }
    }

    public static function getCompletedNotificationBody(Import $import): string
    {
        $body = 'Your question bank import has completed and ' . number_format($import->successful_rows) . ' ' . str('row')->plural($import->successful_rows) . ' imported.';

        if ($failedRowsCount = $import->getFailedRowsCount()) {
            $body .= ' ' . number_format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to import.';
        }

        return $body;
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
            // Format as HTML with code block
            $lines = explode("\n", $content);
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
                        $formattedLines[] = '<div style="background-color: #f3f4f6; padding: 8px; border-radius: 4px; font-family: monospace; font-size: 14px; margin: 2px 0;">' . htmlspecialchars($line) . '</div>';
                    } else {
                        $formattedLines[] = '<div style="margin: 2px 0;">' . htmlspecialchars($line) . '</div>';
                    }
                } else {
                    $formattedLines[] = '<div style="margin: 2px 0;">&nbsp;</div>';
                }
            }
            
            return implode('', $formattedLines);
        }

        return $content;
    }
} 