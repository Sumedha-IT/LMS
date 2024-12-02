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

            Schema::create('projects', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

                $table->string('name');
                $table->date('started_at');
                $table->date('ends_at')->nullable();
                $table->string('description')->nullable();
                // $table->string('project_link')->nullable();
                // $table->string('nature_of_employment')->nullable();
                $table->timestamps();
            });
       
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
