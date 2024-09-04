<?php

namespace App\Filament\Widgets;

use App\Models\TeachingMaterial;
use Filament\Widgets\ChartWidget;
use App\Models\TeachingMaterialStatus;
use Illuminate\Support\Facades\Auth;

class AssignmentChart extends ChartWidget
{
    protected static ?string $heading = 'Assignments Performance';
    protected int | string | array  $columnSpan = 'full';


    protected function getData(): array
    {
        // Get the data for each assignment
        $data = $this->getAssignmentData();

        return [
            'datasets' => [
                [
                    'label' => 'Maximum Marks',
                    'data' => $data['maximumMarks'],
                    'borderColor' => '#36A2EB',
                    'backgroundColor' => 'rgba(54, 162, 235, 0.2)',
                ],
                [
                    'label' => 'Obtained Marks',
                    'data' => $data['obtainedMarks'],
                    'borderColor' => '#FF6384',
                    'backgroundColor' => 'rgba(255, 99, 132, 0.2)',
                ],
            ],
            'labels' => $data['assignmentLabels'],
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }

    protected function getAssignmentData()
    {
        $maximumMarks = [];
        $obtainedMarks = [];
        $assignmentLabels = [];

        // Get all assignments (doc_type 2) and their statuses
        $userId = Auth::id();
        $assignmentStatuses = TeachingMaterialStatus::where('teaching_material_statuses.user_id', $userId)->get();

        foreach ($assignmentStatuses as $assignmentStatus) {
            $teachingMaterial = TeachingMaterial::find($assignmentStatus->teaching_material_id);

            if ($teachingMaterial) {
                $maximumMarks[] = $teachingMaterial->maximum_marks;
                $obtainedMarks[] = $assignmentStatus->obtained_marks;
                $assignmentLabels[] =  $teachingMaterial->name;
            }
        }

        return [
            'maximumMarks' => $maximumMarks,
            'obtainedMarks' => $obtainedMarks,
            'assignmentLabels' => $assignmentLabels,
        ];
    }
}
