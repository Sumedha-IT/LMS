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
        
        Schema::table('job_profiles', function (Blueprint $table) {
            $table->text('achievements')->nullable(); // Replace 'column_name' with the actual column after which this new column should be added.
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_profiles', function (Blueprint $table) {
            $table->dropColumn('achievements');
        });
    }
};
