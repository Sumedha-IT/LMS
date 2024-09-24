<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exams_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id');
            $table->foreignId('exam_id');
            $table->string('score')->nullable();
            $table->json('report')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exams_attempts');
    }
};
