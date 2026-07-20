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
        Schema::create('utilisateurs', function (Blueprint $table) {
            $table->id('id_user');
            $table->string('nom', 100);
            $table->string('prenom', 100);
            $table->string('email', 150)->unique();
            $table->string('password');
            $table->enum('role', ['ADMIN', 'GESTIONNAIRE'])->default('GESTIONNAIRE');
            $table->enum('statut', ['ACTIF', 'INACTIF'])->default('ACTIF');
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            
            // Indexes
            $table->index('email');
            $table->index('role');
            $table->index('statut');
        });

        // Ajouter les colonnes created_at et updated_at
        Schema::table('utilisateurs', function (Blueprint $table) {
            $table->renameColumn('created_at', 'date_creation');
            $table->renameColumn('updated_at', 'date_modification');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utilisateurs');
    }
};