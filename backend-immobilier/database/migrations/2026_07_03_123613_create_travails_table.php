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
        Schema::create('travaux', function (Blueprint $table) {
            $table->id('id_travail');
            $table->string('titre');
            $table->text('description')->nullable();
            $table->decimal('montant', 10, 2);
            $table->date('date_intervention');
            $table->enum('statut', ['PREVU', 'EN_COURS', 'TERMINE', 'ANNULE'])->default('PREVU');
            
            $table->unsignedBigInteger('id_bien');
            $table->unsignedBigInteger('id_locataire')->nullable();
            $table->unsignedBigInteger('id_proprietaire')->nullable();

            $table->foreign('id_bien')->references('id_bien')->on('biens')->onDelete('cascade');
            $table->foreign('id_locataire')->references('id_locataire')->on('locataires')->onDelete('set null');
            $table->foreign('id_proprietaire')->references('id_proprietaire')->on('proprietaires')->onDelete('set null');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('travaux');
    }
};
