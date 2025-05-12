from rest_framework import viewsets
from rest_framework.response import Response
from api.models import Etudiant
from .serializers import EtudiantSerializer

class EtudiantViewSet(viewsets.ModelViewSet):
    queryset = Etudiant.objects.all()
    serializer_class = EtudiantSerializer 