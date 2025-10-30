from django.contrib import admin
from .models import (Level, University, Year, Subject, Concours, 
                        Question, Choice, UserAnswer, Score,ExerciceContext,ExerciceContextImage)

admin.site.register([
    Level,
    University,
    Year,
    Subject,
    Concours,
    Question,
    Choice,
    UserAnswer,
    Score,
    ExerciceContext,
    ExerciceContextImage,
])
