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
        Schema::create('question_attempt_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_attempt_id');
            $table->foreignId('exam_id');
            $table->text('answer');
            $table->float('score');
            $table->enum('stage', [
                'Answered',
                'Not Answered',
                'Not visited',
                'Answered and Mark for review',
                'Mark for review'
            ]);
            
            $table->foreignId('exam_question_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_attempt_logs');
    }
};
