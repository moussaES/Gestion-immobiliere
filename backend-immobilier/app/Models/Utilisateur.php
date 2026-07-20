<?php
 
// app/Models/Utilisateur.php
namespace App\Models;
 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
 
class Utilisateur extends Authenticatable
{
    use HasFactory, Notifiable;
 
    protected $table = 'utilisateurs';
    protected $primaryKey = 'id_user';
    public $timestamps = true;
    const CREATED_AT = 'date_creation';
    const UPDATED_AT = 'date_modification';
 
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'role',
        'statut',
    ];
 
    protected $hidden = [
        'password',
        'remember_token',
    ];
 
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
 
    // Relations
    public function paiements()
    {
        return $this->hasMany(Paiement::class, 'id_user_enregistrement', 'id_user');
    }
 
    public function contratsCreated()
    {
        return $this->hasMany(Contrat::class, 'id_user_createur', 'id_user');
    }
 
    public function historique()
    {
        return $this->hasMany(HistoriqueOperation::class, 'id_user', 'id_user');
    }
 
    // Mutators
    public function getNomCompletAttribute()
    {
        return $this->prenom . ' ' . $this->nom;
    }
 
    // Scopes
    public function scopeActif($query)
    {
        return $query->where('statut', 'ACTIF');
    }
 
    public function scopeAdmin($query)
    {
        return $query->where('role', 'ADMIN');
    }
 
    public function scopeGestionnaire($query)
    {
        return $query->where('role', 'GESTIONNAIRE');
    }
 
}