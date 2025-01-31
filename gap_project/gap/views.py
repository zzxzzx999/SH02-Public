from rest_framework.decorators import api_view
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Company
from rest_framework.authtoken.models import Token
from rest_framework import generics, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework.decorators import permission_classes
from django.contrib.auth.models import User
from .serializers import *
from .models import Company, GapAnalysis
from .pdfGeneration import *
from .jsonReadWrite import *
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import action
from django.http import FileResponse


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
    @action(detail=True, methods=['get'], renderer_classes=(BinaryFileRenderer,))
    def get(self, request):
        # Open the PDF in binary mode
        try:
            pdf_path = 'gap/src/improvementPlan.pdf'
            return FileResponse(
                open(pdf_path, 'rb'),
                as_attachment=True,  # Forces download
                filename='file.pdf'  # Sets the downloaded file name
            )
        except FileNotFoundError:
            return Response({'error': 'File not found'}, status=404)        
    def post(self, request):
        #return download(request)
        gapId = request.data.get('id')
        gap = GapAnalysis.objects.get(id = gapId)
        pdf, pdf_filename = examplePdfCreation(gap)
        print(pdf_filename)
        return Response({'pdf' : pdf_filename}, status=200)

def create_gap(self, request):
    data = request.data
    serializer = QuestionsSerializer(data=gapAnalysis)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status = 201)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def getQuestionOrWriteAnswer(request):
    serializer = QuestionsSerializer(data=request.data)
    data = request.data
    if (data.get("GetOrWrite") == "GET"):
        question_info = getQuestion(data.get("Set"), data.get("Number"))
        return Response(question_info)

    else:
        print("Incoming request data:", data)
        gapAnalysis = GapAnalysis.objects.get(id = data.get("id"))
        writeAnswer(data.get("answer"), data.get("set"), data.get("question"), gapAnalysis)
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

@api_view(['POST'])
@permission_classes([AllowAny])
def getElementOverview(self, request):
    data = request.data
    gapAnalysis = GapAnalysis.objects.get(id = data.get("id"))
    element_data = getElementAnswers(data.get("set"), gapAnalysis)
    return Response(element_data)


@csrf_exempt
def get_scores(request, company_name, element_name):
    company = Company.objects.get(name=company_name)
    analysis= GapAnalysis.objects.filter(company=company).first()
    if not analysis:
            return JsonResponse({"error": "No analysis found for this company"}, status=404)
    gap_data = json.loads(analysis.gap_data)
    element_names = [
        "Policy", "Management", "Documented System", "Meetings", "Performance Measurement",
        "Committee & Representatives", "Investigation Process", "Incident Reporting", "Training Plan",
        "Risk Management Process", "Audit & Inspection Process", "Improvement Planning"
    ]
    element_index = str(element_names.index(element_name) + 1)  # index start from 1
    element_scores = gap_data.get((element_index), [])

    scores = {
        "exceptionalCompliance": sum(score for score in element_scores if score == 5),
        "goodCompliance": sum(score for score in element_scores if score == 4),
        "basicCompliance": sum(score for score in element_scores if score == 3),
        "needsImprovement": sum(score for score in element_scores if score == 2),
        "unsatisfactory": sum(score for score in element_scores if score == 1)
        }

    return JsonResponse({
        "company_name": company_name,
        "element_name": element_name,
        "scores": scores
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def overall_scores(request, company_name):
    # Get all scores for a specified company from the database
    analysis = GapAnalysis.objects.filter(company__name=company_name).first()
    gap_data=json.loads(analysis.gap_data)

    total_score = 0
    totals = {"exceptional":0,"good":0, "basic":0,"needsImprovement":0, "unsatisfactory":0 }
    total=600

    #Summarize the scores by category
    for scores in gap_data.values():
        totals["exceptional"] += sum(score for score in scores if score == 5)
        totals["good"] += sum(score for score in scores if score == 4)
        totals["basic"] += sum(score for score in scores if score == 3)
        totals["needsImprovement"] += sum(score for score in scores if score == 2)
        totals["unsatisfactory"] += sum(score for score in scores if score == 1)
        total_score += sum(scores) 

    unsatisfactory_percentage = (totals["unsatisfactory"] / total) * 100
    needs_improvement_percentage = (totals["needsImprovement"] / total) * 100
    basic_percentage = (totals["basic"] / total) * 100

    return JsonResponse({
        "company_name": company_name,
        "totals": totals,  # the total score of each category
        "percentages": {
            "unsatisfactory": round(unsatisfactory_percentage, 2),
            "needsImprovement": round(needs_improvement_percentage, 2),
            "basic": round(basic_percentage, 2),
        },
        "total_score": total_score,  # the total of marks
    })


#Answer set template
singular_set_answers = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
question_answer_set = {}
for i in range(1, 13):
    question_answer_set[i] = singular_set_answers.copy()

#Improvment plan template
improvement_plan_template = question_answer_set.copy()
singular_set_strings = ["","","","","","","","","",""]
for i in range(1,13):
    improvement_plan_template[i] = singular_set_strings.copy()
    
@api_view(['POST'])
@permission_classes([AllowAny])
def createGapInstance(request):
    data = request.data
    data["gap_data"] = question_answer_set.copy()
    data["improvement_plan"] = improvement_plan_template.copy()
    data["evidence_plan"] = improvement_plan_template.copy()
    
    serializer = GapAnalysisFullSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, staus = 201)
    return Response(serializer.errors, status=400)

#For actual questions- when wanting to get a question the request dictionary 
#should be of the format
"""
{
    "GetOrWrite" : "GET"
    "Element"    : (The element number)
    "Question"   : (The question number)
    "id"         : (The id of the gapAnalysis)
}
""" 
#For writing the answers to questions to the database the request dictionary
#should be of the format
"""
{
    "GetOrWrite" : "WRITE"
    "Element"    : (The element number)
    "Question"   : (The question number)
    "Answer"     : (A list formatted like to the right) [number, improvment string, evidence string] 
    "id"         : (The id of the gapAnalysis)
}
"""
@api_view(['POST'])
@permission_classes([AllowAny])
def getQuestionOrWriteAnswer(self, request):
    data = request.data
    if (data.get("GetOrWrite") == "GET"):
        question_info = getQuestion(data.get("Element"), data.get("Question")) #returns a dictionary with one key "Question"
        return Response(question_info)

    else:
        print("Incoming request data:", data)
        gapAnalysis = GapAnalysis.objects.get(id = data.get("id"))
        writeAnswer(data.get("answer"), data.get("Element"), data.get("Question"), gapAnalysis)
        serializer = QuestionsSerializer(data=gapAnalysis)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = 201)
        return Response(serializer.errors, status=400)
    
    
#This is for the individual element overview
#The dictionary format:
"""
{
    "Element" : (The element number)
    "id"      : (The id of the gapAnalysis)
}
"""
@api_view(['POST'])
@permission_classes([AllowAny])
def getElementOverview(self, request):
    data = request.data
    gapAnalysis = GapAnalysis.objects.get(id = data.get("id"))
    element_data = {
                    "data" : getElementAnswers(data.get("Element"), gapAnalysis)
                   }
    return Response(element_data)


@api_view(['POST'])
@permission_classes([AllowAny])
def specificFullGapOverview(self, request):
    data = request.data
    gapAnalysis = GapAnalysis.objects.get(id = data.get("id"))