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
        // Add course_id to job_postings table
        Schema::table('job_postings', function (Blueprint $table) {
            $table->unsignedBigInteger('course_id')->nullable()->after('domain_id');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('set null');
        });

        // Add course_id to users table
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('course_id')->nullable()->after('domain_id');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('set null');
        });

        // Remove domain_id from job_postings table
        Schema::table('job_postings', function (Blueprint $table) {
            $table->dropForeign(['domain_id']);
            $table->dropColumn('domain_id');
        });

        // Remove domain_id from users table
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['domain_id']);
            $table->dropColumn('domain_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add back domain_id to job_postings table
        Schema::table('job_postings', function (Blueprint $table) {
            $table->unsignedBigInteger('domain_id')->nullable()->after('company_id');
            $table->foreign('domain_id')->references('id')->on('domains')->onDelete('set null');
        });

        // Add back domain_id to users table
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('domain_id')->nullable()->after('branch_id');
            $table->foreign('domain_id')->references('id')->on('domains')->onDelete('set null');
        });

        // Remove course_id from job_postings table
        Schema::table('job_postings', function (Blueprint $table) {
            $table->dropForeign(['course_id']);
            $table->dropColumn('course_id');
        });

        // Remove course_id from users table
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['course_id']);
            $table->dropColumn('course_id');
        });
    }
};
