<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proprietaire extends Model
{
    use HasFactory, \App\Traits\LogsHistorique;

    protected $table = 'proprietaires';
    protected $primaryKey = 'id_proprietaire';
    public $timestamps = true;
    const CREATED_AT = 'date_creation';
    const UPDATED_AT = 'date_modification';

    protected $fillable = [
        'nom',
        'prenom',
        'telephone',
        'email',
        'adresse',
        'cni',
    ];

    // Relations
    public function biens()
    {
        return $this->hasMany(Bien::class, 'id_proprietaire', 'id_proprietaire');
    }

    public function contrats()
    {
        return $this->hasMany(Contrat::class, 'id_proprietaire', 'id_proprietaire');
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
