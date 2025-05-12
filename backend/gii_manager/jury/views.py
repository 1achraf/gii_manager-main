from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from api.models import Etudiant, EtudiantEcue, EtudiantSemestre, Semestre, Ue, Absence, EtudiantUe,Ecue
from gii_manager.jury.serializers import EtudiantSerializer, EtudiantEcueSerializer, EtudiantSemestreSerializer, SemestreSerializer, UeSerializer, AbsenceSerializer

class JuryViewSet(viewsets.ViewSet):
    def list(self, request):
        try:
            # Récupérer les objets depuis la base de données
            etudiants = Etudiant.objects.all()
            etudiant_serializer = EtudiantSerializer(etudiants, many=True)

            etudiant_ecues = EtudiantEcue.objects.all()
            etudiant_ecue_serializer = EtudiantEcueSerializer(etudiant_ecues, many=True)

        
            etudiant_semestres = EtudiantSemestre.objects.all()
            etudiant_semestre_serializer = EtudiantSemestreSerializer(etudiant_semestres, many=True)

            semestres = Semestre.objects.all()
            semestre_serializer = SemestreSerializer(semestres, many=True)

            ues = Ue.objects.all()
            ue_serializer = UeSerializer(ues, many=True)

            # Retourner toutes les données sous forme de réponse JSON
            return Response({
                "etudiants": etudiant_serializer.data,
                "etudiant_ecues": etudiant_ecue_serializer.data,
                "etudiant_semestres": etudiant_semestre_serializer.data,
                "semestres": semestre_serializer.data,    
                "ues": ue_serializer.data,
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk=None):
        try:
            etudiant = get_object_or_404(Etudiant, id_etudiant=pk)
            etudiant_serializer = EtudiantSerializer(etudiant)

            # Si la photo existe, renvoyer l'URL complète
            if etudiant.photo_path:
                etudiant_serializer.data['photo_url'] = etudiant.photo_path.url
                
            # Récupérer les absences
            absences = Absence.objects.filter(id_etudiant=etudiant)
            absences_serializer = AbsenceSerializer(absences, many=True)

            # Récupérer les UE avec les notes associées pour l'année scolaire 2024-2025
            ue_notes = EtudiantUe.objects.filter(
                id_etudiant=etudiant,
                annee_scolaire='2024-2025'
            ).select_related('id_ue')

            ue_data = [
                {
                    "id_ue": ue_note.id_ue,
                    "nom_ue": ue_note.id_ue.nom_ue,
                    "code_ue": ue_note.id_ue.code_ue,
                    "note_initiale": ue_note.note_initiale,
                    "note_rattrapage": ue_note.note_rattrapage
                }
                for ue_note in ue_notes
            ]

            return Response({
                "etudiant": etudiant_serializer.data,
                "ues": ue_data,
                "absences": absences_serializer.data,
            })

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def retrieve_ecues_by_ue(self, request, pk=None, id_ue=None):
        try:
            etudiant = get_object_or_404(Etudiant, id_etudiant=pk)
            etudiant_serializer = EtudiantSerializer(etudiant)

            absences = Absence.objects.filter(id_etudiant=etudiant)
            absences_serializer = AbsenceSerializer(absences, many=True)

            ue = get_object_or_404(Ue, pk=id_ue)  # <--- Ajouté ici

            ecues = Ecue.objects.filter(id_ue=ue)
            ecue_ids = ecues.values_list('id_ecue', flat=True)

            ecue_notes = EtudiantEcue.objects.filter(
                id_etudiant=etudiant,
                id_ecue__in=ecue_ids,
                annee_scolaire='2024-2025'
            ).select_related('id_ecue')

            ecue_data = [
                {
                    "nom_ecue": ecue_note.id_ecue.nom_ecue,
                    "code_ecue": ecue_note.id_ecue.code_ecue,
                    "note_initiale": ecue_note.note_initiale,
                    "note_rattrapage": ecue_note.note_rattrapage
                }
                for ecue_note in ecue_notes
            ]

            return Response({
                "etudiant": etudiant_serializer.data,
                "ecues": ecue_data,
                "absences": absences_serializer.data,
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)