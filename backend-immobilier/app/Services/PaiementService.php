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
        return Paiement::with('contrat.bien', 'contrat.locataire', 'contrat.proprietaire', 'utilisateur')->paginate($perPage);
    }

    public function getById(int $id)
    {
        return Paiement::with('contrat.bien', 'contrat.locataire', 'contrat.proprietaire', 'utilisateur')->findOrFail($id);
    }

    public function create(array $data)
    {
        $paiement = Paiement::create($data);
        $this->generatePdfReceipt($paiement);
        return $paiement;
    }

    public function update(int $id, array $data)
    {
        $paiement = Paiement::findOrFail($id);
        $paiement->update($data);
        return $paiement;
    }

    public function delete(int $id)
    {
        $paiement = Paiement::findOrFail($id);
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

    public function getStatistiques()
    {
        return [
            'total_paiements' => Paiement::sum('montant'),
            'nombre_paiements' => Paiement::count(),
            'paiements_payes' => Paiement::paye()->sum('montant'),
            'paiements_en_attente' => Paiement::enAttente()->sum('montant'),
            'paiements_partiels' => Paiement::partiel()->sum('montant'),
        ];
    }

    private function generatePdfReceipt(Paiement $paiement)
    {
        try {
            $paiement->load('contrat.bien.proprietaire', 'contrat.locataire');
            $contrat = $paiement->contrat;
            $bien = $contrat ? $contrat->bien : null;
            $proprietaire = $bien ? $bien->proprietaire : null;
            $locataire = $contrat ? $contrat->locataire : null;

            $documentData = new Document([
                'reference' => 'DOC-' . time() . '-' . rand(1000, 9999),
                'type' => 'RECU_PAIEMENT',
                'id_paiement' => $paiement->id_paiement,
                'id_contrat' => $contrat ? $contrat->id_contrat : null,
                'id_bien' => $bien ? $bien->id_bien : null,
                'id_proprietaire' => $proprietaire ? $proprietaire->id_proprietaire : null,
                'id_locataire' => $locataire ? $locataire->id_locataire : null,
                'chemin_fichier' => '',
                'nom_fichier' => 'Recu_Paiement_' . $paiement->reference . '.pdf',
            ]);

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
