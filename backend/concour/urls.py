from django.urls import path
from .views import (LevelAPIView, UniverstyAPIView,
                    YearAPIView,SubjectAPIView,ConcoursAPIView)

from .views_score import UserAnswerScoreAPIView,ALLQuestionUncorrectAnserUser
urlpatterns = [
    #get data
    path('niveaux/', LevelAPIView.as_view(), name='levels'),
    path('<slug:niveau_slug>/universites', UniverstyAPIView.as_view(), name='universities-by-level'),
    path('<slug:niveau_slug>/<slug:universite_slug>/year/', YearAPIView.as_view(), name='year-by-universty'),
    path('<slug:niveau_slug>/<slug:universite_slug>/<slug:year_slug>/subject/', SubjectAPIView.as_view(), name='subject-by-year'),
    path('<slug:niveau_slug>/<slug:universite_slug>/<slug:year_slug>/<slug:subject_slug>/concours/', ConcoursAPIView.as_view(), name='concours-by-subject'),
    #end get data

    #-----score and anser
    path('utilisateur-score-et-reponses/', UserAnswerScoreAPIView.as_view(), name='user-score'),
    #-----END--score and anser

    path('utilisateur-bad_quetion/', ALLQuestionUncorrectAnserUser.as_view(), name='user-bad'),






]



