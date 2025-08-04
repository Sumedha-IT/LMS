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
        Schema::create('placement_criteria', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('profile_completion_percentage', 5, 2)->default(90.00);
            $table->boolean('course_completion_required')->default(true);
            $table->boolean('exam_standards_required')->default(true);
            $table->decimal('attendance_percentage', 5, 2)->default(75.00);
            $table->boolean('fees_payment_required')->default(true);
            $table->boolean('lab_test_cases_required')->default(true);
            $table->boolean('assignments_required')->default(true);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('placement_criteria');
    }
};
