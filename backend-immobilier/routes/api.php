<?php

use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\ProprietaireController;
use App\Http\Controllers\LocataireController;
use App\Http\Controllers\BienController;
use App\Http\Controllers\ContratController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\HistoriqueOperationController;
use Illuminate\Support\Facades\Route;

// ========================================================================
// Routes API - Étoiles du Sine
// ========================================================================

// Groupe de routes API
Route::middleware('api')->group(function () {

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
        Route::get('/', [ContratController::class, 'index']);                        // GET /api/contrats
        Route::post('/', [ContratController::class, 'store']);                       // POST /api/contrats
        Route::get('{id}', [ContratController::class, 'show']);                      // GET /api/contrats/{id}
        Route::put('{id}', [ContratController::class, 'update']);                    // PUT /api/contrats/{id}
        Route::delete('{id}', [ContratController::class, 'destroy']);                // DELETE /api/contrats/{id}
        Route::get('actifs', [ContratController::class, 'actifs']);                  // GET /api/contrats/actifs
        Route::get('en-cours', [ContratController::class, 'enCours']);               // GET /api/contrats/en-cours
        Route::get('{id}/paiements', [ContratController::class, 'paiements']);       // GET /api/contrats/{id}/paiements
        Route::get('by-type/{type}', [ContratController::class, 'byType']);          // GET /api/contrats/by-type/{type}
    });

    // ====================================================================
    // Routes: PAIEMENTS
    // ====================================================================
    Route::prefix('paiements')->group(function () {
        Route::get('/', [PaiementController::class, 'index']);                       // GET /api/paiements
        Route::post('/', [PaiementController::class, 'store']);                      // POST /api/paiements
        Route::get('{id}', [PaiementController::class, 'show']);                     // GET /api/paiements/{id}
        Route::put('{id}', [PaiementController::class, 'update']);                   // PUT /api/paiements/{id}
        Route::delete('{id}', [PaiementController::class, 'destroy']);               // DELETE /api/paiements/{id}
        Route::get('payes', [PaiementController::class, 'payes']);                   // GET /api/paiements/payes
        Route::get('en-attente', [PaiementController::class, 'enAttente']);          // GET /api/paiements/en-attente
        Route::get('by-mode/{mode}', [PaiementController::class, 'byMode']);         // GET /api/paiements/by-mode/{mode}
        Route::get('by-mois/{mois}', [PaiementController::class, 'byMois']);         // GET /api/paiements/by-mois/{mois}
        Route::get('statistiques', [PaiementController::class, 'statistiques']);     // GET /api/paiements/statistiques
    });

    // ====================================================================
    // Routes: HISTORIQUE & AUDIT
    // ====================================================================
    Route::prefix('historique')->group(function () {
        Route::get('/', [HistoriqueOperationController::class, 'index']);                                    // GET /api/historique
        Route::post('/', [HistoriqueOperationController::class, 'store']);                                   // POST /api/historique
        Route::get('{id}', [HistoriqueOperationController::class, 'show']);                                  // GET /api/historique/{id}
        Route::delete('{id}', [HistoriqueOperationController::class, 'destroy']);                            // DELETE /api/historique/{id}
        Route::get('by-user/{id_user}', [HistoriqueOperationController::class, 'byUser']);                   // GET /api/historique/by-user/{id_user}
        Route::get('by-type/{type}', [HistoriqueOperationController::class, 'byType']);                      // GET /api/historique/by-type/{type}
        Route::get('by-entite/{entite}', [HistoriqueOperationController::class, 'byEntite']);                // GET /api/historique/by-entite/{entite}
        Route::get('recent/{jours?}', [HistoriqueOperationController::class, 'recent']);                    // GET /api/historique/recent/{jours?}
        Route::get('statistiques', [HistoriqueOperationController::class, 'statistiques']);                  // GET /api/historique/statistiques
        Route::delete('cleanup/{jours?}', [HistoriqueOperationController::class, 'cleanup']);                // DELETE /api/historique/cleanup/{jours?}
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
