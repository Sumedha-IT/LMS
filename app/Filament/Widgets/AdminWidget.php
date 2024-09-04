<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Carbon\Carbon;
use Filament\Widgets\Concerns\InteractsWithPageFilters;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class AdminWidget extends BaseWidget
{
    use InteractsWithPageFilters;

    protected static ?int $sort = 0;

    protected function getStats(): array
    {
        $startDate = !is_null($this->filters['startDate'] ?? null) ?
            Carbon::parse($this->filters['startDate']) :
            now()->subDays(6); // Default to the last 7 days if no start date is provided

        $endDate = !is_null($this->filters['endDate'] ?? null) ?
            Carbon::parse($this->filters['endDate']) :
            now();

        $course = $this->filters['course'] ?? null;
        $batch = $this->filters['batch'] ?? null;

        $userCount = User::when($course, function ($query) use ($course) {
            $query->where('domain_id', $course);
        })
//            ->when($batch, function ($query) use ($batch) {
//                $query->whereHas('batchUsers', function ($subQuery) use ($batch) {
//                    $subQuery->where('batch_id', $batch);
//                });
//            })
            ->when($startDate, function ($query) use ($startDate) {
                $query->whereDate('created_at', '>=', $startDate);
            })
            ->when($endDate, function ($query) use ($endDate) {
                $query->whereDate('created_at', '<=', $endDate);
            })
            ->where('role_id', 6)
            ->count();

        $tutorCount = User::when($course, function ($query) use ($course) {
            $query->where('domain_id', $course);
        })
//            ->when($batch, function ($query) use ($batch) {
//                $query->whereHas('batchUsers', function ($subQuery) use ($batch) {
//                    $subQuery->where('batch_id', $batch);
//                });
//            })
            ->when($startDate, function ($query) use ($startDate) {
                $query->whereDate('created_at', '>=', $startDate);
            })
            ->when($endDate, function ($query) use ($endDate) {
                $query->whereDate('created_at', '<=', $endDate);
            })
            ->where('role_id', 7)
            ->count();


        // Generate chart data based on the start and end dates
        $userChartData = $this->generateChartData($startDate, $endDate, $course, $batch, 6);
        $tutorChartData = $this->generateChartData($startDate, $endDate, $course, $batch, 7);

        // Example description logic
        $description = $userCount > 100 ? 'Significant increase' : 'Moderate increase';

        return [
            Stat::make('Total Enrollment', $userCount)
                ->description($description)
                ->descriptionIcon($userCount > 100 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->chart($userChartData)
                ->color($userCount > 100 ? 'success' : 'warning'),
            Stat::make('Total Tutors', $tutorCount)
                ->description($description)
                ->descriptionIcon($tutorCount > 10 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->chart($tutorChartData)
                ->color($tutorCount > 10 ? 'success' : 'warning'),
        ];
    }

    protected function generateChartData($startDate, $endDate, $course, $batch, $role_id): array
    {
        $chartData = [];
        $date = $startDate->copy();

        while ($date->lte($endDate)) {
            $dailyCount = User::when($course, function ($query) use ($course) {
                $query->where('domain_id', $course);
            })
//                ->when($batch, function ($query) use ($batch) {
//                    $query->whereHas('batchUsers', function ($subQuery) use ($batch) {
//                        $subQuery->where('batch_id', $batch);
//                    });
//                })
                ->whereDate('created_at', $date)
                ->where('role_id', $role_id)
                ->count();

            $chartData[] = $dailyCount;
            $date->addDay();
        }

        return $chartData;
    }
}
