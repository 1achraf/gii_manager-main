from rest_framework import viewsets
from rest_framework.response import Response
from api.models import ApiPlacement
from .serializers import PlacementSerializer

class PlacementViewSet(viewsets.ModelViewSet):
    queryset = ApiPlacement.objects.all()
    serializer_class = PlacementSerializer 