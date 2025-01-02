from rest_framework.decorators import api_view
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Company
from rest_framework.authtoken.models import Token
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework.decorators import permission_classes
from django.contrib.auth.models import User
from .serializers import *
from .models import Company, GapAnalysis
from .pdfGeneration import generateImprovementPlan
import jsonReadWrite
import os

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def index(request):
    queryset = Company.objects.all()
    serializer = IndexSerializer(queryset, many=True)

    return Response(serializer.data, status=201)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):

    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username = username, password = password)

    if user:
        token, created = Token.objects.get_or_create(user=user)
        is_admin = username == 'GAPAdmin'
        return Response({'token' : token.key, 'username': user.username, 'is_admin' : is_admin})
    else:
        return Response({'error': "Invalid credentials"}, status= 404)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def company_list(request):
    if request.method == 'GET':
        companies = Company.objects.all()
        serializer = IndexSerializer(companies, many=True)
        return Response(serializer.data)
    
    if request.method == 'POST':
        print("Incoming request data:", request.data)
        serializer = IndexSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = 201)
        return Response(serializer.errors, status=400)
    

class PdfView(APIView):
    
    serializer_class = GapAnalysisSerializer
    
    def get(self, request):
        gapAnalysis = GapAnalysis.objects.all()[0]
        response = {"name" : pdf_filename}
        c, pdf_filename = generateImprovementPlan(gapAnalysis)
        return Response(response)
    
    def post(self, request):
        serializer = GapAnalysisSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            print(serializer.data)
            return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def getQuestionOrWriteAnswer(self, request):
    data = request.data
    if (data.get("GetOrWrite") == "GET"):
        question_info = jsonReadWrite.getQuestion(data.get("Set"), data.get("Number"))
        return Response(question_info)

    else:
        print("Incoming request data:", data)
        gapAnalysis = GapAnalysis.objects.get(title = data.get("title"))
        jsonReadWrite.writeAnswer(data.get("answer"), data.get("set"), data.get("question"), gapAnalysis)
        serializer = QuestionsSerializer(data=gapAnalysis)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = 201)
        return Response(serializer.errors, status=400)

@permission_classes([AllowAny])
class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    #override predefined method
    def get_queryset(self):
        query_set = Company.objects.all()
        name = self.request.query_params.get('name')

        if name is not None:
            query_set = query_set.filter(name__iexact=name)
        return query_set