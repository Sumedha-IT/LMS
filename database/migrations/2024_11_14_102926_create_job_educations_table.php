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
        Schema::create('profile_educations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('institute')->nullable();
            $table->string('grade_type')->nullable();
            $table->string('degree_type')->nullable();
            $table->string('course')->nullable();
            $table->string('result')->nullable();
            $table->date('started_at')->nullable();
            $table->date('ends_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'institute', 'course']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profile_educations');
    }
};
