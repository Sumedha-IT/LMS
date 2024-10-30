<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up()
    {
        Schema::table('exams', function (Blueprint $table) {
            $table->json('curriculums')->nullable(); // Adds the 'curriculums' JSON column
            $table->dropColumn('subject_id'); // Removes the 'subject' column
        });
    }

    public function down()
    {
        Schema::table('exams', function (Blueprint $table) {
            $table->dropColumn('curriculums'); // Drops the 'curriculums' column
            $table->string('subject_id')->nullable(); // Restores the 'subject' column
        });
    }
};
