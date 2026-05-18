<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;

    protected $table = 'paiements';
    protected $primaryKey = 'id_paiement';
    public $timestamps = false;
    const CREATED_AT = 'date_enregistrement';
    const UPDATED_AT = 'date_modification';

    protected $fillable = [
        'reference',
        'date_paiement',
        'montant',
        'mode_paiement',
        'statut',
        'id_contrat',
        'id_user_enregistrement',
        'notes',
    ];

    protected $casts = [
        'date_paiement' => 'date',
        'montant' => 'decimal:2',
    ];

    // Relations
    public function contrat()
    {
        return $this->belongsTo(Contrat::class, 'id_contrat', 'id_contrat');
    }

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_user_enregistrement', 'id_user');
    }

    // Scopes
    public function scopePaye($query)
    {
        return $query->where('statut', 'PAYE');
    }

    public function scopePartiel($query)
    {
        return $query->where('statut', 'PARTIEL');
    }

    public function scopeEnAttente($query)
    {
        return $query->where('statut', 'EN_ATTENTE');
    }

    public function scopeByMode($query, $mode)
    {
        return $query->where('mode_paiement', $mode);
    }

    public function scopeByMois($query, $mois)
    {
        return $query->whereMonth('date_paiement', $mois);
    }

    public function scopeByAnnee($query, $annee)
    {
        return $query->whereYear('date_paiement', $annee);
    }
}
