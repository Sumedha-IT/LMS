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
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_posting_id')->constrained('job_postings')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['applied', 'shortlisted', 'interview_scheduled', 'interviewed', 'selected', 'selected_not_joined', 'rejected', 'withdrawn'])->default('applied');
            $table->timestamp('application_date')->useCurrent();
            $table->timestamp('shortlisted_date')->nullable();
            $table->timestamp('interview_date')->nullable();
            $table->timestamp('selection_date')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
