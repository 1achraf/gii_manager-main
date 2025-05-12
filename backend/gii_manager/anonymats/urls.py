from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnonymatViewSet

router = DefaultRouter()
router.register(r'', AnonymatViewSet, basename='anonymats')  # <== vide ici pour /anonymats/

urlpatterns = [
    path('', include(router.urls)),
]
