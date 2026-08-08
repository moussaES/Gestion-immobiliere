<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PaiementService;

class GenererPaiementsMensuelsCommand extends Command
{
    protected $signature = 'paiements:generer-mensuels';
    protected $description = 'Génère automatiquement les paiements du 1er du mois pour les contrats actifs et met à jour les impayés';

    public function handle(PaiementService $paiementService)
    {
        $this->info('Génération automatique des paiements mensuels...');
        $paiementService->genererPaiementsMensuelsEtMettreAJourImpayes();
        $this->info('Paiements mensuels générés et impayés mis à jour avec succès.');
        return Command::SUCCESS;
    }
}
