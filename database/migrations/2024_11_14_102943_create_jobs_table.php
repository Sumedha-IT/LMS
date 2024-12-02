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
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recruiter_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('status');
            $table->string('job_type');
            $table->string('office_policy');
            $table->tinyInteger('min_experience');
            $table->tinyInteger('max_experience');
            $table->string('company');
            $table->string('location')->nullable();
            $table->text('description');
            $table->integer('salary');
            $table->json('meta')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
