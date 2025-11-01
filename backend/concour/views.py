from rest_framework.views import APIView
from rest_framework.response import Response
from .models import (University,Year,Subject,Concours)
from .serializers import (UniversitySerializer,YearSerializer,SubjectSerializer,ConcourSerializer)
from rest_framework.permissions import AllowAny



class UniverstyAPIView(APIView):
    permission_classes=[AllowAny]

    def get(self,request,):
        universities = University.objects.all()
        serializer = UniversitySerializer(universities, many=True)
        return Response(serializer.data)

class YearAPIView(APIView):
    permission_classes=[AllowAny]

    def get(self, request,universite_slug):
        years = Year.objects.filter(
            university__slug=universite_slug,
        ).select_related('university')
        serializer = YearSerializer(years, many=True)
        return Response(serializer.data)

class SubjectAPIView(APIView):
    permission_classes=[AllowAny]

    def get(self, request,universite_slug, year_slug):

        subjects = Subject.objects.filter(
            year__slug=year_slug,
            year__university__slug=universite_slug,
            ).select_related('year', 'year__university')
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)

class ConcoursAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request,universite_slug, year_slug, subject_slug):
        concours = Concours.objects.filter(
            subject__slug=subject_slug,
            subject__year__slug=year_slug,
            subject__year__university__slug=universite_slug,
        ).select_related(
            'subject',
            'subject__year',
            'subject__year__university',
        ).prefetch_related(
            'questions',
            'questions__choices',
            'questions__exercice_context',
            'questions__exercice_context__images'  
        )
        serializer = ConcourSerializer(concours, many=True)
        return Response(serializer.data)

