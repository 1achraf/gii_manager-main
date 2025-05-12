from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EtudiantViewSet
from gii_manager.UploadData.views import UploadDataSet
from gii_manager.semestres import views
from gii_manager.placements.views import PlacementViewSet
from gii_manager.salles.views import SalleViewSet,AssignationSalleView

router = DefaultRouter()
router.register(r'etudiants', EtudiantViewSet)
router.register(r'upload', UploadDataSet,basename='upload')
router.register(r'salles', SalleViewSet) 
router.register(r'placements',PlacementViewSet)
urlpatterns = [
    path('', include(router.urls)),
    path('jury/', include('gii_manager.jury.urls')),
    path('anonymats/', include('gii_manager.anonymats.urls')),  # ✅ un seul point d’entrée propre
    path('assigner_salle/', AssignationSalleView.as_view(), name='assigner_salle'),
    path('semestre_options/', views.get_semestre_options, name='semestre_options')
]
