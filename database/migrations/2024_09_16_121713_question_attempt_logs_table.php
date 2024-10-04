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
            $table->json('answer');
            $table->float('score');

            // 1 =>  'Answered',
            // 2 =>  'Not_Answered',
            // 3 =>  'Answered_and_Mark_for_review',
            // 4 =>  'Mark_for_review'
            $table->enum('stage', [1,2,3,4]);
            $table->foreignId('exam_question_id');
            $table->timestamps();

            $table->unique(['exam_attempt_id', 'exam_question_id']);
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
