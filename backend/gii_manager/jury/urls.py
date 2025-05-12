from django.urls import path
from .views import JuryViewSet

jury_list = JuryViewSet.as_view({'get': 'list'})
jury_detail = JuryViewSet.as_view({'get': 'retrieve'})
jury_ue_ecue_detail = JuryViewSet.as_view({'get': 'retrieve_ecues_by_ue'})

urlpatterns = [
    path('', jury_list, name='jury-list'),
    path('<int:pk>/', jury_detail, name='jury-detail'),
    path('<int:pk>/<int:id_ue>/', jury_ue_ecue_detail, name='jury-ue-ecue-detail'),
]
