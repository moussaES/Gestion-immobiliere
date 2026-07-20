<?php

use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\ProprietaireController;
use App\Http\Controllers\LocataireController;
use App\Http\Controllers\BienController;
use App\Http\Controllers\ContratController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\HistoriqueOperationController;
use App\Http\Controllers\DocumentController;
use Illuminate\Support\Facades\Route;

// ========================================================================
// Routes API - Étoiles du Sine
// ========================================================================

// Groupe de routes API
Route::middleware('api')->group(function () {

    // ====================================================================
    // Routes: AUTHENTIFICATION
    // ====================================================================
    Route::post('auth/login', [\App\Http\Controllers\AuthController::class, 'login']);
    Route::post('auth/logout', [\App\Http\Controllers\AuthController::class, 'logout']);

    // ====================================================================
    // Routes: UTILISATEURS
    // ====================================================================
    Route::prefix('utilisateurs')->group(function () {
        Route::get('/', [UtilisateurController::class, 'index']);                    // GET /api/utilisateurs
        Route::post('/', [UtilisateurController::class, 'store']);                   // POST /api/utilisateurs
        Route::get('{id}', [UtilisateurController::class, 'show']);                  // GET /api/utilisateurs/{id}
        Route::put('{id}', [UtilisateurController::class, 'update']);                // PUT /api/utilisateurs/{id}
        Route::delete('{id}', [UtilisateurController::class, 'destroy']);            // DELETE /api/utilisateurs/{id}
        Route::get('by-role/{role}', [UtilisateurController::class, 'byRole']);      // GET /api/utilisateurs/by-role/{role}
    });

    // ====================================================================
    // Routes: PROPRIÉTAIRES
    // ====================================================================
    Route::prefix('proprietaires')->group(function () {
        Route::get('/', [ProprietaireController::class, 'index']);                   // GET /api/proprietaires
        Route::post('/', [ProprietaireController::class, 'store']);                  // POST /api/proprietaires
        Route::get('{id}', [ProprietaireController::class, 'show']);                 // GET /api/proprietaires/{id}
        Route::put('{id}', [ProprietaireController::class, 'update']);               // PUT /api/proprietaires/{id}
        Route::delete('{id}', [ProprietaireController::class, 'destroy']);           // DELETE /api/proprietaires/{id}
        Route::get('{id}/biens', [ProprietaireController::class, 'biens']);          // GET /api/proprietaires/{id}/biens
        Route::get('{id}/contrats', [ProprietaireController::class, 'contrats']);    // GET /api/proprietaires/{id}/contrats
    });

    // ====================================================================
    // Routes: LOCATAIRES
    // ====================================================================
    Route::prefix('locataires')->group(function () {
        Route::get('/', [LocataireController::class, 'index']);                      // GET /api/locataires
        Route::post('/', [LocataireController::class, 'store']);                     // POST /api/locataires
        Route::get('{id}', [LocataireController::class, 'show']);                    // GET /api/locataires/{id}
        Route::put('{id}', [LocataireController::class, 'update']);                  // PUT /api/locataires/{id}
        Route::delete('{id}', [LocataireController::class, 'destroy']);              // DELETE /api/locataires/{id}
        Route::get('{id}/contrats', [LocataireController::class, 'contrats']);       // GET /api/locataires/{id}/contrats
        Route::get('by-profession/{profession}', [LocataireController::class, 'byProfession']); // GET /api/locataires/by-profession/{profession}
    });

    // ====================================================================
    // Routes: BIENS
    // ====================================================================
    Route::prefix('biens')->group(function () {
        Route::get('/', [BienController::class, 'index']);                           // GET /api/biens
        Route::post('/', [BienController::class, 'store']);                          // POST /api/biens
        Route::get('{id}', [BienController::class, 'show']);                         // GET /api/biens/{id}
        Route::put('{id}', [BienController::class, 'update']);                       // PUT /api/biens/{id}
        Route::delete('{id}', [BienController::class, 'destroy']);                   // DELETE /api/biens/{id}
        Route::get('by-statut/{statut}', [BienController::class, 'byStatut']);       // GET /api/biens/by-statut/{statut}
        Route::get('by-type/{type}', [BienController::class, 'byType']);             // GET /api/biens/by-type/{type}
        Route::get('by-ville/{ville}', [BienController::class, 'byVille']);          // GET /api/biens/by-ville/{ville}
        Route::get('{id}/contrats', [BienController::class, 'contrats']);            // GET /api/biens/{id}/contrats
    });

    // ====================================================================
    // Routes: CONTRATS
    // ====================================================================
    Route::prefix('contrats')->group(function () {
        Route::get('export/pdf', [ContratController::class, 'exportAllPdf']);         // GET /api/contrats/export/pdf
        Route::get('export/csv', [ContratController::class, 'exportAllCsv']);         // GET /api/contrats/export/csv
        Route::get('actifs', [ContratController::class, 'actifs']);                  // GET /api/contrats/actifs
        Route::get('en-cours', [ContratController::class, 'enCours']);               // GET /api/contrats/en-cours
        Route::get('by-type/{type}', [ContratController::class, 'byType']);          // GET /api/contrats/by-type/{type}
        Route::get('/', [ContratController::class, 'index']);                        // GET /api/contrats
        Route::post('/', [ContratController::class, 'store']);                       // POST /api/contrats
        Route::get('{id}', [ContratController::class, 'show']);                      // GET /api/contrats/{id}
        Route::get('{id}/export/pdf', [ContratController::class, 'exportPdf']);      // GET /api/contrats/{id}/export/pdf
        Route::get('{id}/export/csv', [ContratController::class, 'exportCsv']);      // GET /api/contrats/{id}/export/csv
        Route::put('{id}', [ContratController::class, 'update']);                    // PUT /api/contrats/{id}
        Route::delete('{id}', [ContratController::class, 'destroy']);                // DELETE /api/contrats/{id}
        Route::get('{id}/paiements', [ContratController::class, 'paiements']);       // GET /api/contrats/{id}/paiements
    });

    // ====================================================================
    // Routes: PAIEMENTS
    // ====================================================================
    Route::prefix('paiements')->group(function () {
        Route::get('statistiques', [PaiementController::class, 'statistiques']);     // GET /api/paiements/statistiques
        Route::get('payes', [PaiementController::class, 'payes']);                   // GET /api/paiements/payes
        Route::get('en-attente', [PaiementController::class, 'enAttente']);          // GET /api/paiements/en-attente
        Route::get('by-mode/{mode}', [PaiementController::class, 'byMode']);         // GET /api/paiements/by-mode/{mode}
        Route::get('by-mois/{mois}', [PaiementController::class, 'byMois']);         // GET /api/paiements/by-mois/{mois}
        Route::get('/', [PaiementController::class, 'index']);                       // GET /api/paiements
        Route::post('/', [PaiementController::class, 'store']);                      // POST /api/paiements
        Route::get('{id}', [PaiementController::class, 'show']);                     // GET /api/paiements/{id}
        Route::put('{id}', [PaiementController::class, 'update']);                   // PUT /api/paiements/{id}
        Route::delete('{id}', [PaiementController::class, 'destroy']);               // DELETE /api/paiements/{id}
    });

    // ====================================================================
    // Routes: HISTORIQUE & AUDIT
    // ====================================================================
    Route::prefix('historique')->group(function () {
        Route::get('statistiques', [HistoriqueOperationController::class, 'statistiques']);                  // GET /api/historique/statistiques
        Route::get('recent/{jours?}', [HistoriqueOperationController::class, 'recent']);                    // GET /api/historique/recent/{jours?}
        Route::get('by-user/{id_user}', [HistoriqueOperationController::class, 'byUser']);                   // GET /api/historique/by-user/{id_user}
        Route::get('by-type/{type}', [HistoriqueOperationController::class, 'byType']);                      // GET /api/historique/by-type/{type}
        Route::get('by-entite/{entite}/{id}', [HistoriqueOperationController::class, 'byEntiteAndId']);      // GET /api/historique/by-entite/{entite}/{id}
        Route::get('by-entite/{entite}', [HistoriqueOperationController::class, 'byEntite']);                // GET /api/historique/by-entite/{entite}
        Route::get('/', [HistoriqueOperationController::class, 'index']);                                    // GET /api/historique
        Route::post('/', [HistoriqueOperationController::class, 'store']);                                   // POST /api/historique
        Route::get('{id}', [HistoriqueOperationController::class, 'show']);                                  // GET /api/historique/{id}
        Route::delete('{id}', [HistoriqueOperationController::class, 'destroy']);                            // DELETE /api/historique/{id}
        Route::delete('cleanup/{jours?}', [HistoriqueOperationController::class, 'cleanup']);                // DELETE /api/historique/cleanup/{jours?}
    });

    // ====================================================================
    // Routes: DASHBOARD STATISTIQUES
    // ====================================================================
    Route::get('statistiques', function () {
        // ... (conservé en l'état)
        $total_biens = \App\Models\Bien::count();
        $biens_libres = \App\Models\Bien::where('statut', 'libre')->count();
        $biens_occupes = \App\Models\Bien::where('statut', 'occupe')->count();
        $total_proprietaires = \App\Models\Proprietaire::count();
        $total_locataires = \App\Models\Locataire::count();
        $contrats_actifs = \App\Models\Contrat::where('statut', 'ACTIF')->count();
        $revenu_mensuel = \App\Models\Paiement::whereMonth('date_paiement', date('m'))
                            ->whereYear('date_paiement', date('Y'))
                            ->where('statut', 'PAYE')->sum('montant');
        $paiements_en_attente = \App\Models\Paiement::where('statut', 'EN_ATTENTE')->sum('montant');
        $taux_occupation = $total_biens > 0 ? round(($biens_occupes / $total_biens) * 100, 2) : 0;

        // Nouvelles statistiques:
        $loyers_attendus = \App\Models\Contrat::where('statut', 'ACTIF')
                            ->where('type_contrat', 'LOCATAIRE')
                            ->sum('montant');

        $loyers_payes_locataires = \App\Models\Paiement::whereHas('contrat', function ($q) {
                $q->where('type_contrat', 'LOCATAIRE');
            })
            ->whereMonth('date_paiement', date('m'))
            ->whereYear('date_paiement', date('Y'))
            ->where('statut', 'PAYE')
            ->sum('montant');

        $part_proprietaire_attendue = $loyers_attendus * 0.90;
        $revenus_agence_attendus = $loyers_attendus * 0.10;

        $part_proprietaire_versee = $loyers_payes_locataires * 0.90;
        $revenus_agence_encaisses = $loyers_payes_locataires * 0.10;

        return response()->json([
            'success' => true,
            'message' => 'Statistiques récupérées avec succès',
            'data' => [
                'total_biens' => $total_biens,
                'biens_libres' => $biens_libres,
                'biens_occupes' => $biens_occupes,
                'total_proprietaires' => $total_proprietaires,
                'total_locataires' => $total_locataires,
                'contrats_actifs' => $contrats_actifs,
                'revenu_mensuel' => $revenu_mensuel,
                'paiements_en_attente' => $paiements_en_attente,
                'taux_occupation' => $taux_occupation,
                'loyers_attendus' => $loyers_attendus,
                'part_proprietaire_attendue' => $part_proprietaire_attendue,
                'revenus_agence_attendus' => $revenus_agence_attendus,
                'part_proprietaire_versee' => $part_proprietaire_versee,
                'revenus_agence_encaisses' => $revenus_agence_encaisses,
            ]
        ]);
    });

    // ====================================================================
    // Routes: DOCUMENTS
    // ====================================================================
    Route::prefix('documents')->group(function () {
        Route::get('/', [DocumentController::class, 'index']);                        // GET /api/documents
        Route::get('by-entite/{entite}/{id}', [DocumentController::class, 'byEntiteAndId']); // GET /api/documents/by-entite/{entite}/{id}
        Route::get('{id}/download', [DocumentController::class, 'download']);         // GET /api/documents/{id}/download
    });

    // ====================================================================
    // Routes: TRAVAUX
    // ====================================================================
    Route::prefix('travaux')->group(function () {
        Route::get('/', [App\Http\Controllers\TravailController::class, 'index']);
        Route::post('/', [App\Http\Controllers\TravailController::class, 'store']);
        Route::get('{id}', [App\Http\Controllers\TravailController::class, 'show']);
        Route::put('{id}', [App\Http\Controllers\TravailController::class, 'update']);
        Route::delete('{id}', [App\Http\Controllers\TravailController::class, 'destroy']);
    });

});
// ========================================================================
// Route d'accueil / Health Check
// ========================================================================
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Étoiles du Sine API - Operational',
        'timestamp' => now(),
    ]);
});
