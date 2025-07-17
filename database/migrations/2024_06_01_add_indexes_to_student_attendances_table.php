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
        Schema::table('student_attendances', function (Blueprint $table) {
            // Add indexes to improve query performance
            $table->index('user_id');
            $table->index('ip_address');
            $table->index('laptop_id');
            $table->index('check_in_datetime');
            $table->index('check_out_datetime');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_attendances', function (Blueprint $table) {
            // Remove indexes
            $table->dropIndex(['user_id']);
            $table->dropIndex(['ip_address']);
            $table->dropIndex(['laptop_id']);
            $table->dropIndex(['check_in_datetime']);
            $table->dropIndex(['check_out_datetime']);
        });
    }
};
