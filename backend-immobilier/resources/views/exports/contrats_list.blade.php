<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Liste des Contrats</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 6px;
            text-align: left;
        }
        th {
            background-color: #f4f4f4;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
    </style>
</head>
<body>

    <div class="header">
        <h2>AGENCE IMMOBILIÈRE LES ETOILES DU SINE</h2>
        <h1>Liste Globale des Contrats</h1>
        <p>Généré le {{ date('d/m/Y à H:i') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Réf.</th>
                <th>Type</th>
                <th>Propriétaire</th>
                <th>Locataire</th>
                <th>Début</th>
                <th>Fin</th>
                <th class="text-right">Montant Total</th>
                <th class="text-right">Commission (10%)</th>
                <th class="text-right">Part Propriétaire (90%)</th>
                <th class="text-center">Statut</th>
            </tr>
        </thead>
        <tbody>
            @foreach($contrats as $contrat)
            <tr>
                <td>{{ $contrat->reference }}</td>
                <td>{{ $contrat->type_contrat }}</td>
                <td>{{ $contrat->proprietaire ? $contrat->proprietaire->nom . ' ' . $contrat->proprietaire->prenom : '-' }}</td>
                <td>{{ $contrat->locataire ? $contrat->locataire->nom . ' ' . $contrat->locataire->prenom : '-' }}</td>
                <td>{{ $contrat->date_debut ? $contrat->date_debut->format('d/m/Y') : '' }}</td>
                <td>{{ $contrat->date_fin ? $contrat->date_fin->format('d/m/Y') : '' }}</td>
                <td class="text-right">{{ number_format($contrat->montant, 0, ',', ' ') }}</td>
                <td class="text-right">{{ number_format($contrat->commission_agence, 0, ',', ' ') }}</td>
                <td class="text-right">{{ number_format($contrat->montant_proprietaire, 0, ',', ' ') }}</td>
                <td class="text-center">{{ $contrat->statut }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>
