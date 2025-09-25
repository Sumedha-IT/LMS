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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('lead_id');
            $table->string('program');
            $table->decimal('total_fee', 10, 2);
            $table->integer('no_of_installments');
            $table->decimal('installment_amount', 10, 2);
            $table->decimal('paid_amount', 10, 2)->default(0);
            $table->decimal('remaining_amount', 10, 2);
            $table->enum('status', ['pending', 'partial', 'completed'])->default('pending');
            $table->json('installment_details')->nullable(); // Store installment payment history
            $table->timestamps();
            
            $table->index(['user_id', 'lead_id']);
            $table->index('program');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
