from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db import transaction
import csv
import os
import random
from api.models import Etudiant
from rest_framework.decorators import action

class AnonymatViewSet(viewsets.ViewSet):
    def create(self, request):
        annee_scolaire = request.data.get('annee_scolaire')
        if not annee_scolaire:
            return Response({'error': 'Année scolaire requise'}, status=400)

        suffix = annee_scolaire[-1]
        existing = set()
        promotion_map = {}

        try:
            with transaction.atomic():
                for e in Etudiant.objects.all():
                    if not e.promotion or not e.promotion[0].isdigit():
                        continue

                    prefix = e.promotion[0]
                    for _ in range(1000):  # max essais
                        random_digits = f"{random.randint(0, 999):03d}"  # uniquement chiffres
                        numero = f"{suffix}{prefix}{random_digits}"
                        if numero not in existing:
                            existing.add(numero)
                            break

                    promotion_map.setdefault(e.promotion, []).append({
                        'nom': e.nom,
                        'prenom': e.prenom,
                        'anonymat': numero
                    })

            # Création des CSV par promotion
            output_folder = os.path.join("media", "anonymats", annee_scolaire.replace('/', '-'))
            os.makedirs(output_folder, exist_ok=True)

            for promo, data in promotion_map.items():
                csv_path = os.path.join(output_folder, f"{promo}.csv")
                with open(csv_path, 'w', newline='', encoding='utf-8') as f:
                    writer = csv.writer(f)
                    writer.writerow(['Nom', 'Prénom', 'Numéro Anonymat'])
                    for row in data:
                        writer.writerow([row['nom'], row['prenom'], f"'{row['anonymat']}"])  # apostrophe pour éviter notation scientifique

            return Response({'message': 'Fichiers CSV générés avec succès'}, status=200)

        except Exception as e:
            return Response({'error': str(e)}, status=500)
