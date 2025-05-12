from rest_framework import serializers
from .models import Etudiant

class EtudiantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etudiant
        fields = '__all__'
        read_only_fields = ('date_inscription') 