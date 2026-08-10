<?php

namespace App\Services;

use App\Models\Paiement;
use App\Models\Document;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class PaiementService
{
    public function getAllPaginated(int $perPage = 15)
    {
        $this->genererPaiementsMensuelsEtMettreAJourImpayes();
        return Paiement::with('contrat.bien', 'contrat.locataire', 'contrat.proprietaire', 'utilisateur')->paginate($perPage);
    }

    public function getById(int $id)
    {
        return Paiement::with('contrat.bien', 'contrat.locataire', 'contrat.proprietaire', 'utilisateur')->findOrFail($id);
    }

    public function create(array $data)
    {
        $paiement = Paiement::create($data);
        if ($paiement->statut === 'PAYE') {
            $this->generatePdfReceipt($paiement);
        }
        return $paiement;
    }

    public function update(int $id, array $data)
    {
        $paiement = Paiement::findOrFail($id);
        $paiement->update($data);
        if ($paiement->statut === 'PAYE') {
            $this->generatePdfReceipt($paiement);
        }
        return $paiement;
    }

    public function delete(int $id)
    {
        $paiement = Paiement::findOrFail($id);
        // Supprimer également le document de reçu s'il existe
        Document::where('id_paiement', $id)->delete();
        return $paiement->delete();
    }

    public function getPayes(int $perPage = 15)
    {
        return Paiement::paye()->paginate($perPage);
    }

    public function getEnAttente(int $perPage = 15)
    {
        return Paiement::enAttente()->paginate($perPage);
    }

    public function getByMode(string $mode, int $perPage = 15)
    {
        return Paiement::byMode($mode)->paginate($perPage);
    }

    public function getByMois(string $mois, int $perPage = 15)
    {
        return Paiement::byMois($mois)->paginate($perPage);
    }

    public function genererPaiementsMensuelsEtMettreAJourImpayes()
    {
        $now = \Carbon\Carbon::now();
        $previousMonthDate = $now->copy()->subMonth();
        
        $moisNoms = [
            1 => 'janvier', 2 => 'février', 3 => 'mars', 4 => 'avril', 5 => 'mai', 6 => 'juin',
            7 => 'juillet', 8 => 'août', 9 => 'septembre', 10 => 'octobre', 11 => 'novembre', 12 => 'décembre'
        ];
        
        // Exemple : Le 1er septembre, on génère les paiements en attente du mois d'août
        $moisLibelle = ($moisNoms[$previousMonthDate->month] ?? '') . ' ' . $previousMonthDate->year;

        // 1. Basculer les paiements en attente des mois précédents en IMPAYE (ex: le 1er octobre pour le loyer d'août non réglé)
        Paiement::where('statut', 'EN_ATTENTE')
            ->whereDate('date_paiement', '<', $now->copy()->startOfMonth())
            ->update(['statut' => 'IMPAYE']);

        // 2. Générer les nouveaux paiements pour le mois écoulé pour chaque contrat locataire ACTIF
        $contratsActifs = \App\Models\Contrat::where('statut', 'ACTIF')
            ->where('type_contrat', 'LOCATAIRE')
            ->get();

        foreach ($contratsActifs as $contrat) {
            $existe = Paiement::where('id_contrat', $contrat->id_contrat)
                ->where('mois_concerne', $moisLibelle)
                ->exists();

            if (!$existe) {
                Paiement::create([
                    'reference' => 'PAY-' . date('Ym') . '-' . str_pad($contrat->id_contrat, 3, '0', STR_PAD_LEFT) . '-' . rand(10, 99),
                    'date_paiement' => $now->copy()->startOfMonth()->toDateString(),
                    'montant' => $contrat->montant,
                    'mode_paiement' => 'ESPECES',
                    'statut' => 'EN_ATTENTE',
                    'id_contrat' => $contrat->id_contrat,
                    'mois_concerne' => $moisLibelle,
                    'notes' => 'Génération automatique du 1er du mois pour le mois de ' . $moisLibelle,
                ]);
            }
        }
    }

    public function validerPaiement(int $id, ?string $modePaiement = null)
    {
        $paiement = Paiement::findOrFail($id);
        $updateData = [
            'statut' => 'PAYE',
            'date_paiement' => \Carbon\Carbon::now()->toDateString()
        ];
        if ($modePaiement) {
            $updateData['mode_paiement'] = $modePaiement;
        }
        $paiement->update($updateData);
        $this->generatePdfReceipt($paiement);
        return $paiement;
    }

    public function getStatistiques()
    {
        $this->genererPaiementsMensuelsEtMettreAJourImpayes();

        return [
            'total_paiements' => Paiement::sum('montant'),
            'nombre_paiements' => Paiement::count(),
            'paiements_payes' => Paiement::paye()->sum('montant'),
            'paiements_en_attente' => Paiement::whereIn('statut', ['EN_ATTENTE', 'IMPAYE'])->sum('montant'),
            'paiements_partiels' => Paiement::partiel()->sum('montant'),
        ];
    }

    public function genererRecusManquantsPourPaiementsPayes()
    {
        $paiementsPayes = Paiement::where('statut', 'PAYE')->get();
        foreach ($paiementsPayes as $p) {
            $hasDoc = Document::where('id_paiement', $p->id_paiement)->exists();
            if (!$hasDoc) {
                $this->generatePdfReceipt($p);
            }
        }
    }

    public function generatePdfReceipt(Paiement $paiement)
    {
        if ($paiement->statut !== 'PAYE') {
            return;
        }

        try {
            $paiement->load('contrat.bien.proprietaire', 'contrat.locataire', 'contrat.proprietaire');
            $contrat = $paiement->contrat;
            $bien = $contrat ? $contrat->bien : null;
            $proprietaire = $bien ? $bien->proprietaire : ($contrat ? $contrat->proprietaire : null);
            $locataire = $contrat ? $contrat->locataire : null;

            $documentData = Document::where('id_paiement', $paiement->id_paiement)->first();

            if (!$documentData) {
                $documentData = new Document([
                    'reference' => 'DOC-' . time() . '-' . rand(1000, 9999),
                    'type' => 'RECU_PAIEMENT',
                    'id_paiement' => $paiement->id_paiement,
                    'id_contrat' => $contrat ? $contrat->id_contrat : null,
                    'id_bien' => $bien ? $bien->id_bien : null,
                    'id_proprietaire' => $proprietaire ? $proprietaire->id_proprietaire : ($contrat ? $contrat->id_proprietaire : null),
                    'id_locataire' => $locataire ? $locataire->id_locataire : ($contrat ? $contrat->id_locataire : null),
                    'chemin_fichier' => '',
                    'nom_fichier' => 'Recu_Paiement_' . $paiement->reference . '.pdf',
                ]);
            }

            $pdf = Pdf::loadView('pdfs.recu_paiement', [
                'paiement' => $paiement,
                'document' => $documentData,
                'contrat' => $contrat,
                'bien' => $bien,
                'proprietaire' => $proprietaire,
                'locataire' => $locataire,
            ]);

            $fileName = 'documents/' . $documentData->reference . '.pdf';
            Storage::disk('public')->put($fileName, $pdf->output());

            $documentData->chemin_fichier = $fileName;
            $documentData->save();
        } catch (\Exception $ex) {
            \Illuminate\Support\Facades\Log::error('Erreur génération PDF : ' . $ex->getMessage());
        }
    }
}
