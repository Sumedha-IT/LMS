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
        Schema::create('team_jobs', function (Blueprint $table) {
            $table->id();
            
            // Foreign key for job_id referencing the jobs table
            $table->foreignId('job_id')->constrained('jobs')->onDelete('cascade');
            
            // Foreign key for team_id referencing the teams table
            $table->foreignId('team_id')->constrained('teams')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_jobs');
    }
};
