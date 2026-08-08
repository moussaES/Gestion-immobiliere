<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prestataire extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $primaryKey = 'id_prestataire';

    protected $fillable = [
        'nom',
        'prenom',
        'specialite',
        'telephone',
        'adresse'
    ];

    public function travaux()
    {
        return $this->hasMany(Travail::class, 'id_prestataire');
    }

    public function depenses()
    {
        return $this->hasMany(Depense::class, 'id_prestataire');
    }
}
