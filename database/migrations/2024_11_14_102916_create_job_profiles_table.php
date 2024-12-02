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
        Schema::create('job_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->json('meta')->nullable();
            $table->string('current_location');
            $table->string('total_experience');
            $table->json('social_links')->nullable();
            $table->json('languages_known')->nullable();
            $table->text('about_me')->nullable();
            $table->json('awards')->nullable();
            $table->string('address');
            $table->string('state');
            $table->string('country');


            $table->timestamps();
            // $table->json('awards_and_achievements')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_profiles');
    }
};
