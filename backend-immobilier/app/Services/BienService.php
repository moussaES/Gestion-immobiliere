<?php

namespace App\Services;

use App\Models\Bien;

class BienService
{
    public function getAllPaginated(int $perPage = 15)
    {
        return Bien::with(['proprietaire', 'contrats'])->paginate($perPage);
    }

    public function getById(int $id)
    {
        return Bien::with(['proprietaire', 'contrats.paiements', 'contrats.locataire'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return Bien::create($data);
    }

    public function update(int $id, array $data)
    {
        $bien = Bien::findOrFail($id);
        $bien->update($data);
        return $bien;
    }

    public function delete(int $id)
    {
        $bien = Bien::findOrFail($id);
        return $bien->delete();
    }

    public function getByStatut(string $statut, int $perPage = 15)
    {
        return Bien::where('statut', $statut)->paginate($perPage);
    }

    public function getByType(string $type, int $perPage = 15)
    {
        return Bien::where('type', $type)->paginate($perPage);
    }

    public function getByVille(string $ville, int $perPage = 15)
    {
        return Bien::where('ville', $ville)->paginate($perPage);
    }

    public function getContrats(int $id)
    {
        $bien = Bien::findOrFail($id);
        return $bien->contrats()->get();
    }
}
