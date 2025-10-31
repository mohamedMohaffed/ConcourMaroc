from django.contrib import admin
from .models import (University, Year, Subject, Concours, 
                        Question, Choice, UserAnswer, Score,ExerciceContext,ExerciceContextImage)

admin.site.register([
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
