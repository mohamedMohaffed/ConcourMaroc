from django.urls import path
from .views import (LevelAPIView, UniverstyAPIView,
                    YearAPIView,SubjectAPIView,ConcoursAPIView)
from .views_score import (UserAnswerScoreAPIView, 
LastUserScoreAPIView,DeleteLastScoreAPIView,
AllScoresForConcourAPIView, AllUserScoresAPIView)
from .views_ai import AIResponderAPIView
from .views_pratice import IncorrectAnswersListAPIView,QuestionIncorrectAnswersUserAPIView, DeleteCorrectAnswersAPIView

urlpatterns = [
    #get data
    path('niveaux/', LevelAPIView.as_view(), name='levels'),
    path('<slug:niveau_slug>/universites', UniverstyAPIView.as_view(), name='universities-by-level'),
    path('<slug:niveau_slug>/<slug:universite_slug>/year/', YearAPIView.as_view(), name='year-by-universty'),
    path('<slug:niveau_slug>/<slug:universite_slug>/<slug:year_slug>/subject/', SubjectAPIView.as_view(), name='subject-by-year'),
    path('<slug:niveau_slug>/<slug:universite_slug>/<slug:year_slug>/<slug:subject_slug>/concour/', ConcoursAPIView.as_view(), name='concours-by-subject'),
    #end get data

    #-----score and anser
    path('utilisateur-score-et-reponses/', UserAnswerScoreAPIView.as_view(), name='user-score'),
    #-----END--score and anser

    ### ----Practice--- ###
    path('list-mauvaises-reponses/',IncorrectAnswersListAPIView.as_view()),
    path('mauvaises-reponses/<slug:concour_slug>/', QuestionIncorrectAnswersUserAPIView.as_view(), name='user-bad'),
    path('delete-correct-answers/<int:concour_id>/', DeleteCorrectAnswersAPIView.as_view(), name='delete-correct-answers'),
    ##
    
    path('last-score/<int:concour_id>/', LastUserScoreAPIView.as_view(), name='last-score-by-concour'),
    path('delete-last-score/<int:concour_id>/', DeleteLastScoreAPIView.as_view(), name='delete-last-score-by-concour'),

    path('all-scores/<int:concour_id>/', AllScoresForConcourAPIView.as_view(), name='all-scores-for-concour'),
    path('all-user-scores/', AllUserScoresAPIView.as_view(), name='all-user-scores'),

    #AI chat
    
    path('ai/',AIResponderAPIView.as_view())

]



