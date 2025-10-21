from rest_framework.views import APIView
from rest_framework.response import Response
from .models import (Level,University,Year,Subject,Concours)
from .serializers import (LevelSerializer,UniversitySerializer,YearSerializer,
                        SubjectSerializer,ConcourSerializer)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status

class LevelAPIView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        levels = Level.objects.all()
        serializer = LevelSerializer(levels, many=True)
        return Response(serializer.data)

class UniverstyAPIView(APIView):
    permission_classes=[AllowAny]

    def get(self,request,niveau_slug):
        universities = University.objects.filter(level__slug=niveau_slug).select_related('level')
        serializer = UniversitySerializer(universities, many=True)
        return Response(serializer.data)

class YearAPIView(APIView):
    permission_classes=[AllowAny]

    def get(self, request, niveau_slug, universite_slug):
        years = Year.objects.filter(
            university__slug=universite_slug,
            university__level__slug=niveau_slug
        ).select_related('university', 'university__level')
        serializer = YearSerializer(years, many=True)
        return Response(serializer.data)

class SubjectAPIView(APIView):
    permission_classes=[AllowAny]

    def get(self, request, niveau_slug, universite_slug, year_slug):

        subjects = Subject.objects.filter(
            year__slug=year_slug,
            year__university__slug=universite_slug,
            year__university__level__slug=niveau_slug,
            ).select_related('year', 'year__university',
                            'year__university__level')
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)

class ConcoursAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, niveau_slug, universite_slug, year_slug, subject_slug):
        concours = Concours.objects.filter(
            subject__slug=subject_slug,
            subject__year__slug=year_slug,
            subject__year__university__slug=universite_slug,
            subject__year__university__level__slug=niveau_slug,
        ).select_related(
            'subject',
            'subject__year',
            'subject__year__university',
            'subject__year__university__level'
        ).prefetch_related(
            'questions',
            'questions__choices',
            'questions__exercice_context'  # ensure context is prefetched with questions
        )
        serializer = ConcourSerializer(concours, many=True)
        return Response(serializer.data)

