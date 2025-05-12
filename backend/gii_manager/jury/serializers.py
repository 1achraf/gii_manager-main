from rest_framework import serializers
from api.models import Ue
from api.models import (
    Absence, Ecue, Etudiant, EtudiantEcue, EtudiantGroupe, 
    EtudiantSemestre, Semestre, Ue
)

class AbsenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Absence
        fields = '__all__'

class EcueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ecue
        fields = '__all__'

class EtudiantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etudiant
        fields = '__all__'

class EtudiantEcueSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtudiantEcue
        fields = '__all__'

class EtudiantGroupeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtudiantGroupe
        fields = '__all__'

class EtudiantSemestreSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtudiantSemestre
        fields = '__all__'


class SemestreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semestre
        fields = '__all__'


class UeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ue
        fields = '__all__'

