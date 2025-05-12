from rest_framework import serializers
from api.models import Etudiant

class EtudiantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etudiant
        fields = ['id_etudiant', 'nom', 'prenom', 'email', 'specialite', 
                 'annee_promotion', 'provenance', 'photo_path', 'numero_anonymat'] 