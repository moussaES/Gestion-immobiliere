<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Reçu de Paiement</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 14px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #0056b3; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #0056b3; margin: 0; }
        .details-section { margin-bottom: 30px; }
        .details-section table { width: 100%; }
        .details-section td { padding: 5px 0; }
        .amount-box { background-color: #f8f9fa; padding: 15px; border-left: 5px solid #28a745; margin-bottom: 30px; }
        .amount-box h2 { margin: 0; color: #28a745; }
        .footer { margin-top: 50px; text-align: right; }
        .signature { margin-top: 20px; border-top: 1px solid #ccc; display: inline-block; padding-top: 5px; width: 200px; text-align: center; }
    </style>
</head>
<body>

    <div class="header">
        <?php
            $logoPath = 'C:/xampp/htdocs/Gestion-immobiliere/frontend/src/assets/logo.jpeg';
            if (file_exists($logoPath)) {
                $logoData = base64_encode(file_get_contents($logoPath));
                $logoSrc = 'data:image/jpeg;base64,' . $logoData;
                echo '<img src="' . $logoSrc . '" alt="Logo" style="height: 60px;">';
            }
        ?>
        <h1>REÇU DE PAIEMENT</h1>
        <p>Référence du reçu : {{ $document->reference }}</p>
        <p>Date : {{ \Carbon\Carbon::parse($document->date_creation)->format('d/m/Y') }}</p>
    </div>

    <div class="amount-box">
        <h2>Montant payé : {{ number_format($paiement->montant, 0, ',', ' ') }} FCFA</h2>
        <p>Mode de paiement : {{ $paiement->mode_paiement }}</p>
        <p>Statut du paiement : {{ $paiement->statut }}</p>
    </div>

    <div class="details-section">
        <h3>Informations sur la Location</h3>
        <table>
            <tr>
                <td><strong>Locataire :</strong></td>
                <td>{{ $locataire ? $locataire->prenom . ' ' . $locataire->nom : 'N/A' }}</td>
            </tr>
            <tr>
                <td><strong>Bien :</strong></td>
                <td>{{ $bien ? $bien->type . ' - ' . $bien->adresse : 'N/A' }}</td>
            </tr>
            <tr>
                <td><strong>Propriétaire :</strong></td>
                <td>{{ $proprietaire ? $proprietaire->prenom . ' ' . $proprietaire->nom : 'N/A' }}</td>
            </tr>
            <tr>
                <td><strong>Contrat :</strong></td>
                <td>{{ $contrat ? $contrat->reference : 'N/A' }}</td>
            </tr>
            <tr>
                <td><strong>Mois concerné :</strong></td>
                <td>{{ \Carbon\Carbon::parse($paiement->mois_concerne)->format('m/Y') }}</td>
            </tr>
            <tr>
                <td><strong>Référence du paiement :</strong></td>
                <td>{{ $paiement->reference }}</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        <p>L'Administrateur / Le Propriétaire</p>
        <br><br>
        <div class="signature">Signature et Cachet</div>
    </div>

</body>
</html>
