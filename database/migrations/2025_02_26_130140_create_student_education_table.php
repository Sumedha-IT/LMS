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
        Schema::create('student_education', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('degree_type_id');
            $table->unsignedBigInteger('specialization_id');
            $table->string('other_specialization')->nullable();
            $table->decimal('percentage_cgpa');
            $table->string('institute_name');
            $table->string('location');
            $table->string('duration_from');
            $table->string('duration_to');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_education');
    }
};
