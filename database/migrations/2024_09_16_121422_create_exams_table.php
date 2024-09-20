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
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->integer('total_marks')->default(0);
            $table->integer('max_attempts')->default(10);
            $table->text('instructions')->nullable();

            $table->string('starts_at');
            $table->string('ends_at');

            $table->timestamp('exam_date');
            $table->boolean('immediate_result');
            $table->foreignId('batch_id');
            $table->foreignId('subject_id');
            $table->json('invigilators')->nullable();
            $table->timestamps();
            
            $table->unique(['title', 'batch_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
