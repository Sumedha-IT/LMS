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
        Schema::create('batch_curriculum_topics', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('batch_curriculum_id')->nullable()->index();
            $table->foreignId('topic_id')->constrained('topics')->onDelete('cascade');
            $table->boolean('is_topic_completed')->default(false);
            $table->datetime('topic_completed_at')->nullable();
            // $table->foreign('batch_curriculum_id')->references('id')->on('batch_curriculum')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batch_curriculum_topics');
    }
};
