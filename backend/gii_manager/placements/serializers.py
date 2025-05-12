from rest_framework import serializers
from api.models import ApiPlacement   

class PlacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApiPlacement
        fields = '__all__'