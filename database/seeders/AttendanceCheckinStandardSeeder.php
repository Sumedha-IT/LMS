<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AttendanceCheckinStandard;

class AttendanceCheckinStandardSeeder extends Seeder
{
    public function run()
    {
        AttendanceCheckinStandard::create([
            'check_in_starttime' => '09:00:00',
            'checkin_buffertime' => 15 // 15 minutes buffer
        ]);
    }
} 