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
        Schema::table('users', function (Blueprint $table) {
            $table->string('zoho_crm_id')->nullable()->unique()->default(null); // Add the new column     
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('zoho_crm_id'); // Remove the column if rolling back
        });
    }
<<<<<<< HEAD
<<<<<<< HEAD
};
=======
};
>>>>>>> b647374f1708982fdbe3aee44ffd6e7cbf18936e
=======
};
>>>>>>> 7c30c59638a9c12ae28a36a478aaa51305c6f9d5
