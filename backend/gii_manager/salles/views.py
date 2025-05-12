from rest_framework import viewsets
from rest_framework.response import Response
from api.models import Semestre, Specialite, EtudiantSemestre, Etudiant, Salle, ApiPlacement
from .serializers import SalleSerializer
from rest_framework.views import APIView
from rest_framework import status
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from django.db.models import Q
from typing import List, Dict, Any
from datetime import datetime
import random
from rest_framework.decorators import action
from datetime import datetime
from .utils import placer_etudiants_dans_salle

class SalleViewSet(viewsets.ModelViewSet):
    queryset = Salle.objects.all()
    serializer_class = SalleSerializer 

    @action(detail=False, methods=['post'])
    def disponibles(self, request):
        try:
            date_debut = request.data.get('date_debut')
            date_fin = request.data.get('date_fin')
            capacite_min = request.data.get('capacite_min', 0)

            if not date_debut or not date_fin:
                return Response({
                    'error': 'Les dates sont requises'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Récupérer les salles occupées
            salles_occupees = ApiPlacement.objects.filter(
                Q(date_debut__lt=date_fin) & Q(date_fin__gt=date_debut)
            ).values_list('id_salle', flat=True).distinct()

            # Récupérer les salles disponibles
            salles_disponibles = Salle.objects.exclude(
                id_salle__in=salles_occupees
            )

            # Filtrer par capacité si nécessaire
            if capacite_min > 0:
                salles_disponibles = salles_disponibles.filter(
                    capacite__gte=capacite_min
                )

            serializer = self.serializer_class(salles_disponibles, many=True)

            return Response({
                'count': salles_disponibles.count(),
                'salles': serializer.data
            })

        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AssignationSalleSerializer(serializers.Serializer):
    salle_id = serializers.IntegerField()
    date_debut = serializers.DateTimeField()
    date_fin = serializers.DateTimeField()
    groupes = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField(allow_null=True)
        )
    )

    def validate(self, data):
        if data['date_debut'] >= data['date_fin']:
            raise serializers.ValidationError("La date de début doit être antérieure à la date de fin")
        if data['date_debut'] < timezone.now():
            raise serializers.ValidationError("La date de début ne peut pas être dans le passé")
        return data

class AssignationSalleView(APIView):
    serializer_class = AssignationSalleSerializer

    def validate_dates(self, date_debut: datetime, date_fin: datetime, salle_id: int) -> tuple[bool, str]:
        """
        Vérifie la disponibilité de la salle pour les dates données.
        Retourne un tuple (disponible: bool, message: str)
        """
        placement_existant = ApiPlacement.objects.filter(
            id_salle_id=salle_id
        ).filter(
            Q(date_debut__lte=date_debut, date_fin__gte=date_debut) |
            Q(date_debut__lte=date_fin, date_fin__gte=date_fin) |
            Q(date_debut__gte=date_debut, date_fin__lte=date_fin)
        ).first()

        if placement_existant:
            return False, f"La salle est déjà réservée du {placement_existant.date_debut} au {placement_existant.date_fin}"
        
        return True, "Salle disponible"

    def get_etudiants_by_groupe(self, groupe: Dict[str, str]) -> List[Etudiant]:
        """Récupère les étudiants pour un groupe donné"""
        try:
            semestre = Semestre.objects.get(nom_semestre__iexact=groupe['semestre'])
            
            query = Q(id_semestre=semestre.id_semestre)
            
            if groupe.get('specialite'):
                specialite = Specialite.objects.get(
                    nom_specialite__iexact=groupe['specialite']
                )
                query &= Q(id_specialite=specialite.id_specialite)
            
            # Modifié cette partie pour éviter l'erreur de select_related
            etudiant_semestre = EtudiantSemestre.objects.filter(query)
            return list(Etudiant.objects.filter(
                id_etudiant__in=etudiant_semestre.values_list('id_etudiant', flat=True)
            ))
            
        except (Semestre.DoesNotExist, Specialite.DoesNotExist) as e:
            raise serializers.ValidationError(str(e))

    # Et modifiez la partie de préparation de la réponse comme suit :
                # Préparation de la réponse
            placement_data = []
            for p in placements:
                    etudiant_semestre = EtudiantSemestre.objects.filter(
                        id_etudiant=p.id_etudiant
                    ).select_related('id_specialite', 'id_semestre').first()
                    
                    placement_data.append({
                        'etudiant': f"{p.id_etudiant.nom} {p.id_etudiant.prenom}",
                        'specialite': (etudiant_semestre.id_specialite.nom_specialite 
                                    if etudiant_semestre and etudiant_semestre.id_specialite 
                                    else None),
                        'semestre': (etudiant_semestre.id_semestre.nom_semestre 
                                if etudiant_semestre 
                                else None),
                        'rangee': p.rangee,
                        'place': p.place
                    })
    @transaction.atomic
    def post(self, request) -> Response:
        try:
            # Validation des données
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data

            # Récupération et validation de la salle
            try:
                salle = Salle.objects.get(id_salle=data['salle_id'])
            except Salle.DoesNotExist:
                return Response({'error': 'Salle non trouvée'}, status=404)

            # Vérification des dates
            disponible, message = self.validate_dates(
                data['date_debut'], 
                data['date_fin'], 
                salle.id_salle
            )
            if not disponible:
                return Response({'error': message}, status=400)

            # Récupération des étudiants
            all_etudiants = []
            for groupe in data['groupes']:
                try:
                    groupe_etudiants = self.get_etudiants_by_groupe(groupe)
                    all_etudiants.extend(groupe_etudiants)
                except serializers.ValidationError as e:
                    return Response({'error': str(e)}, status=400)
            # Suppression des doublons et mélange
            # Suppression des doublons
            # Suppression des doublons
            etudiants = list(set(all_etudiants))

            # Séparer les étudiants par tag
            eleves = [e for e in etudiants if e.tag and e.tag.lower() == 'élevé']
            faibles = [e for e in etudiants if e.tag and e.tag.lower() == 'faible']
            autres = [e for e in etudiants if not e.tag or e.tag.lower() not in ['élevé', 'faible']]
            random.shuffle(autres)

            # Créer toutes les places possibles
            all_places = [
                (rang, place) 
                for rang in range(1, salle.nb_rang + 1) 
                for place in range(1, salle.nb_place + 1)
            ]

            # Vérifier capacité
            if len(all_places) < len(etudiants):
                return Response({
                    'error': f"Pas assez de places. Places disponibles : {len(all_places)}, Étudiants : {len(etudiants)}"
                }, status=400)

            placements = []
            places_utilisees = set()

            # Utiliser une copie de la liste des places
            places_avance = all_places.copy()
            places_retard = all_places[::-1].copy()  # à l’envers pour aller du fond vers le début

            # 1. Placer les "élevés"
            for etudiant in eleves:
                while places_avance:
                    place = places_avance.pop(0)
                    if place not in places_utilisees:
                        break
                placements.append(ApiPlacement(
                    id_etudiant=etudiant,
                    id_salle=salle,
                    rangee=place[0],
                    place=place[1],
                    date_debut=data['date_debut'],
                    date_fin=data['date_fin']
                ))
                places_utilisees.add(place)

            # 2. Placer les "faibles"
            for etudiant in faibles:
                while places_retard:
                    place = places_retard.pop(0)
                    if place not in places_utilisees:
                        break
                placements.append(ApiPlacement(
                    id_etudiant=etudiant,
                    id_salle=salle,
                    rangee=place[0],
                    place=place[1],
                    date_debut=data['date_debut'],
                    date_fin=data['date_fin']
                ))
                places_utilisees.add(place)

            # 3. Placer les "autres"
            places_restantes = [p for p in all_places if p not in places_utilisees]
            random.shuffle(places_restantes)

            for i, etudiant in enumerate(autres):
                place = places_restantes[i]
                placements.append(ApiPlacement(
                    id_etudiant=etudiant,
                    id_salle=salle,
                    rangee=place[0],
                    place=place[1],
                    date_debut=data['date_debut'],
                    date_fin=data['date_fin']
                ))
                places_utilisees.add(place)

           
            # Sauvegarde en base de données
            ApiPlacement.objects.bulk_create(placements)

            # Préparation de la réponse
            placement_data = []
            for p in placements:
                etudiant_semestre = p.id_etudiant.etudiantsemestre_set.first()
                placement_data.append({
                    'etudiant': f"{p.id_etudiant.nom} {p.id_etudiant.prenom}",
                    'specialite': (etudiant_semestre.id_specialite.nom_specialite 
                                 if etudiant_semestre and etudiant_semestre.id_specialite 
                                 else None),
                    'semestre': (etudiant_semestre.id_semestre.nom_semestre 
                               if etudiant_semestre 
                               else None),
                    'rangee': p.rangee,
                    'place': p.place
                })

            return Response({
                'message': 'Placement effectué avec succès',
                'nb_rang': salle.nb_rang,
                'nb_place': salle.nb_place,
                'placements': placement_data
            }, status=201)

        except Exception as e:
            # En cas d'erreur, on annule la transaction
            transaction.set_rollback(True)
            return Response({
                'error': f"Une erreur est survenue lors de l'attribution : {str(e)}"
            }, status=400)
