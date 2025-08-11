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
        Schema::create('student_placement_eligibility', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->boolean('is_eligible')->default(false);
            $table->text('eligibility_reasons')->nullable();
            $table->decimal('profile_completion_percentage', 5, 2)->default(0.00);
            $table->boolean('course_completion_status')->default(false);
            $table->boolean('exam_standards_met')->default(false);
            $table->decimal('attendance_percentage', 5, 2)->default(0.00);
            $table->boolean('fees_payment_status')->default(false);
            $table->boolean('lab_test_cases_completed')->default(false);
            $table->boolean('assignments_completed')->default(false);
            $table->boolean('is_placed')->default(false);
            $table->timestamp('placement_date')->nullable();
            $table->decimal('placement_salary', 10, 2)->nullable();
            $table->string('placement_company')->nullable();
            $table->boolean('is_pap_student')->default(false);
            $table->decimal('remaining_fee_amount', 10, 2)->nullable();
            $table->enum('google_review_status', ['pending', 'completed', 'declined'])->default('pending');
            $table->string('google_review_link', 500)->nullable();
            $table->timestamp('last_eligibility_check')->nullable();
            $table->timestamps();
            
            $table->unique('user_id');
            $table->index('is_eligible');
            $table->index('is_placed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_placement_eligibility');
    }
};
