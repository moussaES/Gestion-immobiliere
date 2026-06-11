<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contrat extends Model
{
    use HasFactory;

    protected $table = 'contrats';
    protected $primaryKey = 'id_contrat';
    public $timestamps = true;
    const CREATED_AT = 'date_creation';
    const UPDATED_AT = 'date_modification';

    protected $fillable = [
        'reference',
        'type_contrat',
        'date_debut',
        'date_fin',
        'montant',
        'statut',
        'id_bien',
        'id_proprietaire',
        'id_locataire',
        'id_user_createur',
        'notes',
        'date_annulation',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'date_annulation' => 'datetime',
        'montant' => 'decimal:2',
    ];

    protected $appends = ['commission_agence', 'montant_proprietaire'];

    public function getCommissionAgenceAttribute()
    {
        return $this->montant ? round($this->montant * 0.10, 2) : 0;
    }

    public function getMontantProprietaireAttribute()
    {
        return $this->montant ? round($this->montant * 0.90, 2) : 0;
    }

    // Relations
    public function bien()
    {
        return $this->belongsTo(Bien::class, 'id_bien', 'id_bien');
    }

    public function proprietaire()
    {
        return $this->belongsTo(Proprietaire::class, 'id_proprietaire', 'id_proprietaire');
    }

    public function locataire()
    {
        return $this->belongsTo(Locataire::class, 'id_locataire', 'id_locataire');
    }

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_user_createur', 'id_user');
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class, 'id_contrat', 'id_contrat');
    }

    // Scopes
    public function scopeActif($query)
    {
        return $query->where('statut', 'ACTIF');
    }

    public function scopeResilie($query)
    {
        return $query->where('statut', 'RESILIE');
    }

    public function scopeArchive($query)
    {
        return $query->where('statut', 'ARCHIVE');
    }

    public function scopeLocataire($query)
    {
        return $query->where('type_contrat', 'LOCATAIRE');
    }

    public function scopeProprietaire($query)
    {
        return $query->where('type_contrat', 'PROPRIETAIRE');
    }

    public function scopeEnCours($query)
    {
        return $query->where('statut', 'ACTIF')
                     ->whereDate('date_debut', '<=', now())
                     ->where(function($q) {
                         $q->whereNull('date_fin')
                           ->orWhereDate('date_fin', '>=', now());
                     });
    }
}
