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
        Schema::create('documents', function (Blueprint $table) {
            $table->id('id_document');
            $table->string('reference')->unique();
            $table->string('type'); // RECU_PAIEMENT, CONTRAT_BAIL, etc.
            $table->string('nom_fichier')->nullable();
            $table->string('chemin_fichier');
            
            // Clés étrangères
            $table->unsignedBigInteger('id_locataire')->nullable();
            $table->unsignedBigInteger('id_proprietaire')->nullable();
            $table->unsignedBigInteger('id_bien')->nullable();
            $table->unsignedBigInteger('id_contrat')->nullable();
            $table->unsignedBigInteger('id_paiement')->nullable();

            $table->foreign('id_locataire')->references('id_locataire')->on('locataires')->nullOnDelete();
            $table->foreign('id_proprietaire')->references('id_proprietaire')->on('proprietaires')->nullOnDelete();
            $table->foreign('id_bien')->references('id_bien')->on('biens')->nullOnDelete();
            $table->foreign('id_contrat')->references('id_contrat')->on('contrats')->nullOnDelete();
            $table->foreign('id_paiement')->references('id_paiement')->on('paiements')->nullOnDelete();

            $table->timestamp('date_creation')->useCurrent();
            $table->timestamp('date_modification')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
