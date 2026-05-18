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
        Schema::create('historique_operations', function (Blueprint $table) {
            $table->id('id_historique');
            
            // Foreign Key
            $table->unsignedBigInteger('id_user')->nullable();
            $table->foreign('id_user')
                ->references('id_user')
                ->on('utilisateurs')
                ->onDelete('set null')
                ->onUpdate('cascade');
            
            $table->string('type_operation', 50);
            $table->string('entite', 50);
            $table->unsignedBigInteger('id_entite')->nullable();
            $table->longText('description')->nullable();
            $table->longText('ancienne_valeur')->nullable();
            $table->longText('nouvelle_valeur')->nullable();
            $table->timestamp('date_operation')->useCurrent();
            
            // Indexes
            $table->index('id_user');
            $table->index('date_operation');
            $table->index('type_operation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historique_operations');
    }
};
