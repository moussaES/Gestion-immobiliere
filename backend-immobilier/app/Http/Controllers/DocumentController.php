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
            $documents = Document::with('locataire', 'proprietaire', 'bien', 'contrat', 'paiement')
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
            
            if (!Storage::disk('public')->exists($document->chemin_fichier)) {
                return response()->json(['success' => false, 'message' => 'Fichier introuvable sur le disque'], 404);
            }

            return Storage::disk('public')->download($document->chemin_fichier, $document->nom_fichier);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Document non trouvé'
            ], 404);
        }
    }
}
