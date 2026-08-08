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
        Schema::table('travails', function (Blueprint $table) {
            $table->unsignedBigInteger('id_prestataire')->nullable()->after('description');
            $table->foreign('id_prestataire')->references('id_prestataire')->on('prestataires')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('travails', function (Blueprint $table) {
            $table->dropForeign(['id_prestataire']);
            $table->dropColumn('id_prestataire');
        });
    }
};
