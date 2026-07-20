<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Locataire extends Model
{
    use HasFactory, \App\Traits\LogsHistorique;

    protected $table = 'locataires';
    protected $primaryKey = 'id_locataire';
    public $timestamps = true;
    const CREATED_AT = 'date_creation';
    const UPDATED_AT = 'date_modification';

    protected $fillable = [
        'nom',
        'prenom',
        'telephone',
        'email',
        'profession',
        'adresse',
        'cni',
    ];

    // Relations
    public function contrats()
    {
        return $this->hasMany(Contrat::class, 'id_locataire', 'id_locataire');
    }

    // Accessors
    public function getNomCompletAttribute()
    {
        return $this->prenom . ' ' . $this->nom;
    }

    // Scopes
    public function scopeActif($query)
    {
        return $query->whereNotNull('email');
    }
}
