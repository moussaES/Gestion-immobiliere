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
        Schema::create('contrats', function (Blueprint $table) {
            $table->id('id_contrat');
            $table->string('reference', 50)->unique();
            $table->enum('type_contrat', ['LOCATAIRE', 'PROPRIETAIRE']);
            $table->date('date_debut');
            $table->date('date_fin');
            $table->decimal('montant', 12, 2);
            $table->enum('statut', ['ACTIF', 'RESILIE', 'ARCHIVE'])->default('ACTIF');
            
            // Foreign Keys
            $table->unsignedBigInteger('id_bien');
            $table->foreign('id_bien')
                ->references('id_bien')
                ->on('biens')
                ->onDelete('restrict')
                ->onUpdate('cascade');
            
            $table->unsignedBigInteger('id_proprietaire');
            $table->foreign('id_proprietaire')
                ->references('id_proprietaire')
                ->on('proprietaires')
                ->onDelete('restrict')
                ->onUpdate('cascade');
            
            $table->unsignedBigInteger('id_locataire')->nullable();
            $table->foreign('id_locataire')
                ->references('id_locataire')
                ->on('locataires')
                ->onDelete('set null')
                ->onUpdate('cascade');
            
            $table->unsignedBigInteger('id_user_createur')->nullable();
            $table->foreign('id_user_createur')
                ->references('id_user')
                ->on('utilisateurs')
                ->onDelete('set null')
                ->onUpdate('cascade');
            
            $table->longText('notes')->nullable();
            $table->dateTime('date_annulation')->nullable();
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamp('date_modification')->useCurrent()->useCurrentOnUpdate();
            
            // Indexes
            $table->index('reference');
            $table->index('type_contrat');
            $table->index('statut');
            $table->index('id_bien');
            $table->index('id_proprietaire');
            $table->index('id_locataire');
            $table->index('date_debut');
            $table->index('date_fin');
            $table->fullText(['reference', 'notes']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contrats');
    }
};