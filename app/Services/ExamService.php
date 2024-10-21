<?php
namespace App\Services;

use Illuminate\Support\Facades\DB;

class ExamService
{

    public function getReport($examAttempLog,$review = false){
        if($review){
            return  (array)DB::select("
                        SELECT 
                            eq.part_id AS partId, 
                            COALESCE(SUM(qal.score), 0) AS marksObtained, 
                            COALESCE(COUNT(*), 0) AS totalQuestions, 
                            COALESCE(CAST(SUM(eq.score) AS FLOAT), 0) AS maxMarksForSection,
                            COALESCE(COUNT(qal.answer), 0) AS totalAttempedCount,
                            COALESCE(COUNT(CASE WHEN qal.stage = 2 THEN 1 END), 0) AS notAnswered,
                            COALESCE(COUNT(CASE WHEN qal.stage = 3 THEN 1 END), 0) AS answeredAndMarkForReview,
                            COALESCE(COUNT(CASE WHEN qal.stage = 4 THEN 1 END), 0) AS markForReview,
                            COALESCE(COUNT(CASE WHEN qal.score < 0 THEN 1 END), 0) AS wrong,
                            COALESCE(COUNT(CASE WHEN qal.score > 0 THEN 1 END), 0) AS correct,
                            COALESCE(COUNT(CASE WHEN qal.exam_question_id IS NULL THEN 1 END), 0) AS skippedQuestions
                        FROM 
                            lms.exam_questions AS eq
                        LEFT JOIN 
                            lms.question_attempt_logs AS qal 
                        ON 
                            eq.question_id = qal.exam_question_id 
                            AND qal.exam_attempt_id = ".$examAttempLog->id."
                        WHERE 
                            eq.exam_id = ".$examAttempLog->exam_id."
                        GROUP BY 
                            eq.part_id
            ");
        }else{
            return (array)DB::select("
                SELECT 
                    eq.part_id AS partId, 
                    COALESCE(COUNT(*), 0) AS noOfQuestions, 
                    COALESCE(COUNT(CASE WHEN qal.stage = 1 THEN 1 END), 0) AS answered,
                    COALESCE(COUNT(CASE WHEN qal.stage = 2 THEN 1 END), 0) AS notAnswered,
                    COALESCE(COUNT(CASE WHEN qal.stage = 3 THEN 1 END), 0) AS answeredAndMarkForReview,
                    COALESCE(COUNT(CASE WHEN qal.stage = 4 THEN 1 END), 0) AS markForReview,
                    COALESCE(COUNT(CASE WHEN qal.exam_question_id IS NULL THEN 1 END), 0) AS notVisited
                FROM 
                    lms.exam_questions AS eq
                LEFT JOIN 
                    lms.question_attempt_logs AS qal 
                ON 
                    eq.question_id = qal.exam_question_id 
                    AND qal.exam_attempt_id = ".$examAttempLog->id."
                WHERE 
                    eq.exam_id = ".$examAttempLog->exam_id."
                GROUP BY 
                    eq.part_id
            ");
        }
    }

    public function generateReport($examAttempLog){

        $timeTaken = $this->subtractTime($examAttempLog->created_at->format('H:i:s'),date('H:i:s'));
        $report = $this->getReport($examAttempLog,true);
        
        $partWiseReport = collect($report);
        $result['timeTaken'] = $timeTaken;
        
        // Combine all totals into a single array
        $totalData = [
            'totalMarksObtained' => $partWiseReport->sum(function ($item) {  
                return $item->marksObtained ?? 0; // Use object property access here
            }),
            'totalQuestions' => $partWiseReport->sum(function ($item) { 
                return $item->totalQuestions ?? 0; 
            }),
            'maxMarks' => $partWiseReport->sum(function ($item) { 
                return (float)$item->maxMarksForSection ?? 0; 
            }),
            'totalAttemptedCount' => $partWiseReport->sum(function ($item) { 
                return $item->totalAttempedCount ?? 0; 
            }),
            'notAnswered' => $partWiseReport->sum(function ($item) { 
                return $item->notAnswered ?? 0; 
            }),
            'answeredAndMarkForReview' => $partWiseReport->sum(function ($item) { 
                return $item->answeredAndMarkForReview ?? 0; 
            }),
            'markForReview' => $partWiseReport->sum(function ($item) { 
                return $item->markForReview ?? 0; 
            }),
            'wrong' => $partWiseReport->sum(function ($item) { 
                return $item->wrong ?? 0; 
            }),
            'correct' => $partWiseReport->sum(function ($item) { 
                return $item->correct ?? 0; 
            }),
            'skippedQuestions' => $partWiseReport->sum(function ($item) { 
                return $item->skippedQuestions ?? 0; 
            }),
        ];
        $result = [
            "aggregateReport" => $totalData,
            "partWiseReport" => $partWiseReport->toArray(),
            "timeTaken"     => $timeTaken
        ];

        $result['aggregateReport']['accuracy'] = ($result['aggregateReport']['correct'] / $result['aggregateReport']['totalQuestions']) * 100;
        $result['aggregateReport']['percentage'] = ($result['aggregateReport']['totalMarksObtained'] / $result['aggregateReport']['maxMarks']) * 100;
        $result['aggregateReport']['grade'] = $this->assignGrade($result['aggregateReport']['percentage']);
            
        return $result;
    } 

    public function subtractTime($timeA , $timeB){

        // Convert both times to timestamps
        $timeA = strtotime($timeA);
        $timeB = strtotime($timeB);
        
        // Calculate the difference in seconds
        $diffInSeconds = $timeB - $timeA;
        
        // Convert the difference into hours and minutes
        $hours = floor($diffInSeconds / 3600); // Get hours
        $minutes = floor(($diffInSeconds % 3600) / 60); // Get minutes
        
        // Format hours and minutes as HH:MM
        return  sprintf('%02d:%02d', $hours, $minutes);
    }
 
    public function assignGrade($percentage) {
        switch (true) {
            case ($percentage >= 90):
                return 'A';
            case ($percentage >= 80):
                return 'B';
            case ($percentage >= 70):
                return 'C';
            case ($percentage >= 60):
                return 'D';
            case ($percentage >= 50):
                return 'E';
            default:
                return 'F';
        }
    }

}