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
        Schema::table('batch_curriculum_topics', function (Blueprint $table) {
            $table->boolean('is_topic_started')->default(false)->after('is_topic_completed');
            $table->datetime('topic_started_at')->nullable()->after('topic_completed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('batch_curriculum_topics', function (Blueprint $table) {
            $table->dropColumn(['is_topic_started', 'topic_started_at']);
        });
    }
};
