<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('role');
            $table->string('technologies');
            $table->string('project_url')->nullable();
            $table->string('github_url')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_ongoing')->default(false);
            $table->string('team_size')->nullable();
            $table->text('key_achievements')->nullable();
            $table->string('project_type'); // Academic, Personal, Professional
            $table->string('client_name')->nullable();
            $table->string('organization')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('projects');
    }
}; 