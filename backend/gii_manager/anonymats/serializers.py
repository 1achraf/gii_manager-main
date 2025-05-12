from rest_framework import serializers
from api.models import Anonymat

class AnonymatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anonymat
        fields = '__all__'
