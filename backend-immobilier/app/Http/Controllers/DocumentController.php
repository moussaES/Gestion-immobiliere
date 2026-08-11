<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function index()
    {
        try {
            app(\App\Services\PaiementService::class)->genererRecusManquantsPourPaiementsPayes();
            app(\App\Services\ContratService::class)->genererDocumentsContratsManquants();

            $documents = Document::with([
                'locataire', 
                'proprietaire', 
                'bien', 
                'contrat.locataire', 
                'contrat.proprietaire', 
                'contrat.bien', 
                'paiement.contrat.locataire',
                'paiement.contrat.proprietaire',
                'paiement.contrat.bien'
            ])
            ->orderBy('date_creation', 'desc')
            ->get();
                
            return response()->json([
                'success' => true,
                'data' => $documents,
                'message' => 'Documents récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function byEntiteAndId($entite, $id)
    {
        try {
            $colonne = 'id_' . strtolower($entite);
            
            $documents = Document::with('locataire', 'proprietaire', 'bien', 'contrat', 'paiement')
                ->where($colonne, $id)
                ->orderBy('date_creation', 'desc')
                ->get();
                
            return response()->json([
                'success' => true,
                'data' => $documents,
                'message' => 'Documents récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Entité invalide ou erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    public function download($id)
    {
        try {
            $document = Document::findOrFail($id);
            
            // Si le fichier PDF est manquant sur le disque (ex: redémarrage conteneur), le régénérer automatiquement à la volée !
            if (empty($document->chemin_fichier) || !Storage::disk('public')->exists($document->chemin_fichier)) {
                if ($document->type === 'CONTRAT' || $document->id_contrat) {
                    if ($document->id_contrat) {
                        app(\App\Services\ContratService::class)->generateAndSaveDocument($document->id_contrat);
                        $document->refresh();
                    }
                } elseif ($document->type === 'RECU_PAIEMENT' || $document->id_paiement) {
                    if ($document->paiement && $document->paiement->statut === 'PAYE') {
                        app(\App\Services\PaiementService::class)->generatePdfReceipt($document->paiement);
                        $document->refresh();
                    }
                }
            }

            if (!Storage::disk('public')->exists($document->chemin_fichier)) {
                return response()->json(['success' => false, 'message' => 'Fichier introuvable sur le disque'], 404);
            }

            return Storage::disk('public')->download($document->chemin_fichier, $document->nom_fichier);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Document non trouvé: ' . $e->getMessage()
            ], 404);
        }
    }
}
