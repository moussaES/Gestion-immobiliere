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
        Schema::create('biens', function (Blueprint $table) {
            $table->id('id_bien');
            $table->string('reference', 50)->unique();
            $table->enum('type', ['MAISON', 'APPARTEMENT', 'IMMEUBLE', 'TERRAIN', 'STUDIO']);
            $table->string('adresse', 255);
            $table->string('ville', 100);
            $table->string('code_postal', 10)->nullable();
            $table->decimal('surface', 10, 2)->nullable();
            $table->integer('nombre_pieces')->nullable();
            $table->decimal('loyer_mensuel', 12, 2);
            $table->enum('statut', ['OCCUPE', 'LIBRE', 'RESERVE'])->default('LIBRE');
            $table->longText('description')->nullable();
            
            // Foreign Key
            $table->unsignedBigInteger('id_proprietaire');
            $table->foreign('id_proprietaire')
                ->references('id_proprietaire')
                ->on('proprietaires')
                ->onDelete('restrict')
                ->onUpdate('cascade');
            
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamp('date_modification')->useCurrent()->useCurrentOnUpdate();
            
            // Indexes
            $table->index('reference');
            $table->index('type');
            $table->index('statut');
            $table->index('ville');
            $table->index('id_proprietaire');
            $table->fullText(['reference', 'adresse', 'ville']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biens');
    }
};
