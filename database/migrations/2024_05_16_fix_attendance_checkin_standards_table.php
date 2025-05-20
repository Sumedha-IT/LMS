<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // First drop any foreign key constraints
        Schema::table('attendance_checkin_standards', function (Blueprint $table) {
            $foreignKeys = $this->listTableForeignKeys('attendance_checkin_standards');
            foreach ($foreignKeys as $key) {
                $table->dropForeign($key);
            }
        });

        // Then truncate the table to remove any existing data
        DB::table('attendance_checkin_standards')->truncate();

        // Insert default data
        DB::table('attendance_checkin_standards')->insert([
            'check_in_starttime' => '09:00:00',
            'checkin_buffertime' => 15,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    public function down()
    {
        // No need for down migration as we're fixing data
    }

    private function listTableForeignKeys($table)
    {
        $conn = Schema::getConnection()->getDoctrineSchemaManager();
        return array_map(function($key) {
            return $key->getName();
        }, $conn->listTableForeignKeys($table));
    }
}; 