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
             // role: pending, warga, bendahara, sekretaris, admin_rt
            $table->string('role')->default('pending')->after('password');
            // status approval: waiting, approved, rejected
            $table->string('status')->default('waiting')->after('role');
            // kode atau id RT yang dituju
           
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'status', 'rt_id']);
        });
    }
};
