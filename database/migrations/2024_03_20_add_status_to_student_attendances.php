<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('student_attendances', function (Blueprint $table) {
            $table->enum('status', ['Present', 'Absent'])->default('Absent')->after('check_out_datetime');
        });
    }

    public function down()
    {
        Schema::table('student_attendances', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
}; 