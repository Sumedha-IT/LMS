<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\ExamCalculationService;

class InitializeExamMarks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'exam:initialize-marks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Initialize exam marks for all students';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting exam marks initialization...');
        
        $examService = new ExamCalculationService();
        $examService->recalculateAllStudentsExamMarks();
        
        $this->info('Exam marks initialization completed successfully!');
        
        return 0;
    }
} 