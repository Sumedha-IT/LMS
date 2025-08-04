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
        Schema::create('job_eligibility_criteria', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_posting_id')->constrained('job_postings')->onDelete('cascade');
            $table->integer('btech_year_of_passout_min')->nullable();
            $table->integer('btech_year_of_passout_max')->nullable();
            $table->integer('mtech_year_of_passout_min')->nullable();
            $table->integer('mtech_year_of_passout_max')->nullable();
            $table->decimal('btech_percentage_min', 5, 2)->nullable();
            $table->decimal('mtech_percentage_min', 5, 2)->nullable();
            $table->json('skills_required')->nullable();
            $table->text('additional_criteria')->nullable();
            $table->timestamps();
            
            $table->index('job_posting_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_eligibility_criteria');
    }
};
