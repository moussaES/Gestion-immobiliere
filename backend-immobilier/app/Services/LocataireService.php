<?php

namespace App\Services;

use App\Models\Locataire;

class LocataireService
{
    public function getAllPaginated(int $perPage = 15)
    {
        return Locataire::with('contrats')->paginate($perPage);
    }

    public function getById(int $id)
    {
        return Locataire::with('contrats')->findOrFail($id);
    }

    public function create(array $data)
    {
        return Locataire::create($data);
    }

    public function update(int $id, array $data)
    {
        $locataire = Locataire::findOrFail($id);
        $locataire->update($data);
        return $locataire;
    }

    public function delete(int $id)
    {
        $locataire = Locataire::findOrFail($id);
        return $locataire->delete();
    }

    public function getContrats(int $id)
    {
        $locataire = Locataire::findOrFail($id);
        return $locataire->contrats()->get();
    }

    public function getByProfession(string $profession, int $perPage = 15)
    {
        return Locataire::where('profession', $profession)->paginate($perPage);
    }
}
