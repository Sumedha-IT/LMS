<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('student_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->dateTime('check_in_datetime');
            $table->dateTime('check_out_datetime')->nullable();
            $table->enum('status', ['Present', 'Absent'])->default('Absent');
            $table->timestamps();
        });

        Schema::create('attendance_checkin_standards', function (Blueprint $table) {
            $table->id();
            $table->time('check_in_starttime');
            $table->integer('checkin_buffertime')->default(15); // Buffer time in minutes
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('student_attendances');
        Schema::dropIfExists('attendance_checkin_standards');
    }
}; 