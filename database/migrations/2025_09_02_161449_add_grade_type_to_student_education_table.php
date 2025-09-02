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
        Schema::table('student_education', function (Blueprint $table) {
            $table->enum('grade_type', ['percentage', 'cgpa'])->default('percentage')->after('percentage_cgpa');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_education', function (Blueprint $table) {
            $table->dropColumn('grade_type');
        });
    }
};
