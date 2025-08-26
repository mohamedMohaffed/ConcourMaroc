from django.urls import path
from .views import (LevelAPIView, UniverstyAPIView,YearAPIView,SubjectAPIView,ConcoursAPIView)

urlpatterns = [
    path('niveaux/', LevelAPIView.as_view(), name='levels'),
    path('<slug:niveau_slug>/universites', UniverstyAPIView.as_view(), name='universities-by-level'),
    path('<slug:niveau_slug>/<slug:universite_slug>/year/', YearAPIView.as_view(), name='year-by-universty'),
    path('<slug:niveau_slug>/<slug:universite_slug>/<slug:year_slug>/subject/', SubjectAPIView.as_view(), name='subject-by-year'),
    path('<slug:niveau_slug>/<slug:universite_slug>/<slug:year_slug>/<slug:subject_slug>/concours/', ConcoursAPIView.as_view(), name='concours-by-subject'),
]



