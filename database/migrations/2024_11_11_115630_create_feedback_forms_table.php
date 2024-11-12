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
        Schema::create('feedback_forms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('notify_users')->default(false);
            $table->string('form_source_link'); // link to be used in the iframe
            $table->foreignId('team_id')->constrained()->onDelete('cascade');
            $table->foreignId('announcement_id')->default(null);


            $table->timestamps();
        });

        Schema::create('batch_feedback_form', function (Blueprint $table) {
            $table->id();
            $table->foreignId('feedback_form_id')->constrained()->onDelete('cascade');
            $table->foreignId('batch_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batch_feedback_form');
        Schema::dropIfExists('feedback_forms');
    }
};
