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
        Schema::create('paiements', function (Blueprint $table) {
            $table->id('id_paiement');
            $table->string('reference', 50)->unique();
            $table->date('date_paiement');
            $table->decimal('montant', 12, 2);
            $table->enum('mode_paiement', ['CHEQUE', 'VIREMENT', 'ESPECES', 'WAVE', 'ORANGE_MONEY']);
            $table->enum('statut', ['PAYE', 'PARTIEL', 'EN_ATTENTE'])->default('EN_ATTENTE');
            
            // Foreign Keys
            $table->unsignedBigInteger('id_contrat');
            $table->foreign('id_contrat')
                ->references('id_contrat')
                ->on('contrats')
                ->onDelete('restrict')
                ->onUpdate('cascade');
            
            $table->unsignedBigInteger('id_user_enregistrement')->nullable();
            $table->foreign('id_user_enregistrement')
                ->references('id_user')
                ->on('utilisateurs')
                ->onDelete('set null')
                ->onUpdate('cascade');
            
            $table->longText('notes')->nullable();
            $table->timestamp('date_enregistrement')->useCurrent();
            $table->timestamp('date_modification')->useCurrent()->useCurrentOnUpdate();
            
            // Indexes
            $table->index('reference');
            $table->index('statut');
            $table->index('mode_paiement');
            $table->index('id_contrat');
            $table->index('id_user_enregistrement');
            $table->index('date_paiement');
            $table->fullText(['reference', 'notes']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
