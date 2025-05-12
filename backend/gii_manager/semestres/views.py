from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import F
from api.models import EtudiantSemestre, Semestre, Specialite

@api_view(['GET'])
def get_semestre_options(request):
    try:
        # Récupérer l'année scolaire actuelle ou la plus récente
        current_year = EtudiantSemestre.objects.order_by('-annee_scolaire').values_list('annee_scolaire', flat=True).first()

        # Requête pour obtenir les combinaisons uniques de semestre et spécialité
        query = """
            SELECT DISTINCT 
                s.nom_semestre,
                sp.nom_specialite
            FROM etudiant_semestre es
            JOIN semestre s ON es.id_semestre = s.id_semestre
            LEFT JOIN specialite sp ON es.id_specialite = sp.id_specialite
            WHERE es.annee_scolaire = %s
            ORDER BY s.nom_semestre, sp.nom_specialite
        """
        
        with connection.cursor() as cursor:
            cursor.execute(query, [current_year])
            results = cursor.fetchall()

        # Formater les résultats
        semestre_options = []
        for code_semestre, specialite in results:
            if specialite:
                option = f"{code_semestre}-{specialite.lower()}"
            else:
                option = code_semestre
            semestre_options.append(option)

        return Response({
            'semestre_options': semestre_options,
            'annee_scolaire': current_year
        })

    except Exception as e:
        return Response({
            'error': str(e)
        }, status=500)
