from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Etudiant
from .serializers import EtudiantSerializer

# Create your views here.

class EtudiantViewSet(viewsets.ModelViewSet):
    queryset = Etudiant.objects.all()
    serializer_class = EtudiantSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = Etudiant.objects.all()
        matricule = self.request.query_params.get('matricule', None)
        nom = self.request.query_params.get('nom', None)
        filiere = self.request.query_params.get('filiere', None)
        
        if matricule:
            queryset = queryset.filter(matricule__icontains=matricule)
        if nom:
            queryset = queryset.filter(nom__icontains=nom)
        if filiere:
            queryset = queryset.filter(filiere__icontains=filiere)
            
        return queryset
