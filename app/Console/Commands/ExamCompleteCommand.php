<?php

namespace App\Console\Commands;

use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Services\ExamService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ExamCompleteCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'exam-complete-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(ExamService $es)
    {
        $todayExams = Exam::whereDate('exam_date', Carbon::today())->get();


        $lastTenMinutes = Carbon::now()->subMinutes(10)->format('H:i'); // Time 10 minutes ago
        $currentTime = Carbon::now()->format('H:i'); // Current time

        $todayExams = Exam::whereDate('exam_date', Carbon::today())
            ->whereBetween('ends_at', [$lastTenMinutes, $currentTime])
            ->get();
        $timeTaken = [];
        foreach ($todayExams as $exam) {
            $timeTaken[$exam->id] = subtractTime($exam->starts_at . ':00', $exam->ends_at . ':00');
        }
        $examAttempts = ExamAttempt::whereIn('exam_id', $todayExams->plucK('id')->toArray())->where('status', 'started')->get();

        foreach ($examAttempts as $log) {
            $result = (array)$es->generateReport($log);
            $result['timeTaken'] = $timeTaken[$log->exam_id];
            $log->report = $result;

            $log->status = 'completed';
            $log->score = $result['aggregateReport']['totalMarksObtained'];
            $log->save();
        }
        Log::channel('cron_log')->info(json_encode([
            "cmd" => "Exam CC",
            "totalCnt" => count($examAttempts)
        ]));
    }
}
