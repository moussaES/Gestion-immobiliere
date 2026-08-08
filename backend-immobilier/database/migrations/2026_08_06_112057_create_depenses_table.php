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
        Schema::create('depenses', function (Blueprint $table) {
            $table->id('id_depense');
            $table->enum('type_depense', ['AGENCE', 'BIEN']);
            $table->enum('categorie', ['DEPLACEMENT', 'ACHAT', 'AUTRE'])->nullable();
            $table->text('description');
            $table->decimal('montant', 10, 2);
            $table->date('date_depense');
            $table->unsignedBigInteger('id_bien')->nullable();
            $table->unsignedBigInteger('id_proprietaire')->nullable();
            $table->unsignedBigInteger('id_prestataire')->nullable();
            $table->string('justificatif')->nullable();
            $table->timestamps();
            
            $table->foreign('id_bien')->references('id_bien')->on('biens')->onDelete('set null');
            $table->foreign('id_proprietaire')->references('id_proprietaire')->on('proprietaires')->onDelete('set null');
            $table->foreign('id_prestataire')->references('id_prestataire')->on('prestataires')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('depenses');
    }
};
