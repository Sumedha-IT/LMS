<?php

namespace App\Http\Controllers;

use App\Models\Holiday;
use App\Models\Calendar;
use Illuminate\Http\Request;
use App\Http\Resources\HolidayResource;
use App\Http\Resources\CalendarResource;
use Illuminate\Pagination\Paginator;
use Illuminate\Pagination\LengthAwarePaginator;

class CalendarController extends Controller
{
    public function fetchData(Request $request)
    {
        // Validate input parameters
        $request->validate([
            'start' => 'required|date_format:Y-m-d',
            'end' => 'required|date_format:Y-m-d|after_or_equal:start',
        ]);

        $startDate = $request->input('start');
        $endDate = $request->input('end');
        $getAllHolidays = $request->input('all_holidays', false);

        // Get calendar events
        $calendar = Calendar::with('curriculum')
            ->whereBetween('start_time', ["{$startDate} 00:00:00", "{$endDate} 23:59:59"])
            ->get();

        $calendarData = CalendarResource::collection($calendar);

        // Get all holidays
        $holidays = Holiday::all();
        $holidaysData = HolidayResource::collection($holidays);

        // Check if we should return all holidays without pagination
        if ($getAllHolidays) {
            // For the all_holidays request, we'll return all holidays and calendar events
            $allData = [];

            // Add calendar events
            foreach ($calendarData as $event) {
                $allData[] = $event;
            }

            // Add all holidays
            foreach ($holidaysData as $holiday) {
                $allData[] = $holiday;
            }

            return [
                'data' => $allData,
            ];
        }

        // For regular requests with pagination
        $mergedData = [];

        // Add calendar events
        foreach ($calendarData as $event) {
            $mergedData[] = $event;
        }

        // Add holidays
        foreach ($holidaysData as $holiday) {
            $mergedData[] = $holiday;
        }

        // Apply pagination
        $perPage = $request->input('page_size', 3); // Default page size is 3
        $page = Paginator::resolveCurrentPage() ?: 1;

        $collection = collect($mergedData);
        $items = $collection->slice(($page - 1) * $perPage, $perPage)->values();

        return [
            'data' => $items,
        ];
    }
}
