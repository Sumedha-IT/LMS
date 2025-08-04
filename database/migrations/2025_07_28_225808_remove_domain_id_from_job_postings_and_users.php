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
        // Remove domain_id from job_postings table
        Schema::table('job_postings', function (Blueprint $table) {
            $table->dropColumn('domain_id');
        });

        // Remove domain_id from users table
        Schema::table('users', function (Blueprint $table) {
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
        });

        // Add back domain_id to users table
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('domain_id')->nullable()->after('designation_id');
        });
    }
};
