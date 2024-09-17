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
            $table->string('name');
            $table->integer('total_marks')->default(0);
            $table->integer('max_attempts')->default(10);
            $table->text('instructions')->nullable();
            $table->timestamp('starts_at');
            $table->timestamp('ends_at');
            $table->string('duration');
            $table->boolean('immediate_result');
            $table->foreignId('batch_id');
            $table->foreignId('invigilator_id');

            $table->timestamps();
            $table->unique(['name', 'batch_id']);
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
