from rest_framework.decorators import api_view
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Company
from rest_framework.authtoken.models import Token
from rest_framework import generics
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework.decorators import permission_classes
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .serializers import *
from .models import Company, GapAnalysis
from .pdfGeneration import generateImprovementPlan
from .jsonReadWrite import *
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

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
        serializer = CompanyListSerializer(companies, many=True)
        return Response(serializer.data)
    
    if request.method == 'POST':
        print("Incoming request data:", request.data)
        serializer = CompanyListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = 201)
        return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_gap(request):
    company_name = request.data.get('company_name')
    consultant = request.data.get('consultant')
    company_rep = request.data.get('company_rep')
    company_email = request.data.get('company_email')
    additional_notes = request.data.get('additional_notes')

    try:
        company_instance = Company.objects.get(name=company_name)
        gap = GapAnalysis.objects.create(
            company=company_instance, 
            consultant=consultant, 
            companyRep=company_rep,
            companyEmail=company_email, 
            additionalNotes=additional_notes
        )
        company_instance.current_gap = True
        serializer = GapAnalysisSerializer(gap)
        company_instance.save()

        return Response(serializer.data, status=201)

    except Company.DoesNotExist:
        return Response({"error": "Company not found"}, status=404)

@api_view(['GET'])
def get_latest_gap(request):
    company_name = request.GET.get('company_name')
    
    if not company_name:
        return Response({"error": "Company name is required."}, status=400)

    try:
        company_instance = Company.objects.get(name=company_name)
        
        latest_gap = GapAnalysis.objects.filter(company=company_instance).order_by('-id').first()

        if latest_gap:
            return Response({"gap_id": latest_gap.id})
        else:
            return Response({"error": "No gap analysis found for this company."}, status=404)

    except Company.DoesNotExist:
        return Response({"error": "Company not found."}, status=404)


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
def getQuestionOrWriteAnswer(request):
    serializer = QuestionsSerializer(data=request.data)
    data = request.data

    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    if (data.get("GetOrWrite") == "GET"):
        question_info = getQuestion(data.get("Set"), data.get("Number"))
        if question_info:
            return Response(question_info, status=200)
        else:
            return Response({"error": "Question not found"}, status=404)

    else:
        print("Incoming request data:", data)
        gap = GapAnalysis.objects.get(id = data.get("id"))
        gap.gap_data = data.get("answers")
        gap.improvement_plan = data.get("improvementPlan")
        gap.save()
        serializer = GapAnalysisSerializer(gap, data={"gap_data": gap.gap_data}, partial=True)

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


def get_scores(request, gap_id, element_name):
    #company = Company.objects.get(name=company_name)
    try:
        # use gap_id to query GapAnalysis 
        analysis = GapAnalysis.objects.get(id=gap_id)
    except GapAnalysis.DoesNotExist:
        return JsonResponse({"error": f"GapAnalysis with id {gap_id} not found."}, status=404)


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
        #"company_name": company_name,
        "gap_id":gap_id,
        "element_name": element_name,
        "scores": scores
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def get_past_analysis(request, company_name):
    company = get_object_or_404(Company, name=company_name)
    analyses=GapAnalysis.objects.filter(company=company).order_by("-date") 
    # Get the most recent analysis
    most_recent_analysis = analyses.first()
    recent_title = f"Overview ({most_recent_analysis.date.strftime('%Y-%m-%d')})" if most_recent_analysis else "Overview"

    data=[
        {
            "gap_id": analysis.id,
            "date": analysis.date.strftime("%Y-%m-%d"),
            "title":analysis.title
        }
        for analysis in analyses
    ]
    return Response({"company_name": company_name, "past_analyses": data, "recent_title": recent_title}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def overall_scores(request, gap_id):
    # Get all scores for a specified company from the database
    #analysis = GapAnalysis.objects.filter(company__name=company_name).first()
    try:
        analysis = GapAnalysis.objects.get(id=gap_id)
    except GapAnalysis.DoesNotExist:
        return JsonResponse({"error": "Analysis not found for given gap_id"}, status=404)
    

    gap_data=json.loads(analysis.gap_data)
    #company_name=analysis.company.name

    total_score = 0
    totals = {"exceptional":0,"good":0, "basic":0,"needsImprovement":0, "unsatisfactory":0 }
    total_number=120

    #Summarize the number of scores by category
    for scores in gap_data.values():
        totals["exceptional"] += sum(1 for score in scores if score == 5)
        totals["good"] += sum(1 for score in scores if score == 4)
        totals["basic"] += sum(1 for score in scores if score == 3)
        totals["needsImprovement"] += sum(1 for score in scores if score == 2)
        totals["unsatisfactory"] += sum(1 for score in scores if score == 1)
        total_score += sum(scores) 

    unsatisfactory_percentage = (totals["unsatisfactory"] / total_number) * 100
    needs_improvement_percentage = (totals["needsImprovement"] / total_number) * 100
    basic_percentage = (totals["basic"] / total_number) * 100

    return Response({
        "totals": totals,  # the total score of each category
        "percentages": {
            "unsatisfactory": round(unsatisfactory_percentage, 2),
            "needsImprovement": round(needs_improvement_percentage, 2),
            "basic": round(basic_percentage, 2),
        },
        "total_score": total_score,  # the total of marks
    })

class CompanyListView(APIView):
    def get(self, request):
        companies = Company.objects.all()
        serializer = CompanySerializer(companies, many=True)
        return Response(serializer.data)

class CompanyDeleteView(APIView):
    def delete(self, request, company_name):
        try:
            company = Company.objects.get(name=company_name)
            company.delete()  
            return Response({"message": "Company deleted successfully!"}, status=status.HTTP_200_OK)
        except Company.DoesNotExist:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def delete_company(request, company_name):
    try:
        company = Company.objects.get(name=company_name)
        company.delete()
        return Response({"message": f"Company {company_name} deleted successfully."}, status=200)
    except Company.DoesNotExist:
        return Response({"error": "Company not found."}, status=404)
    

@api_view(['GET'])
@permission_classes([AllowAny])
def company_detail(request, company_name):
    print(f"Looking for company with name: '{company_name}'")  
    try:
        company = Company.objects.get(name__iexact=company_name.strip())  # ignore front and back space of string
        print(f"Found company: {company.name}")  
        serializer = CompanySerializer(company)
        return Response(serializer.data)
    except Company.DoesNotExist:
        print("Company not found")
        return Response({"error": "Company not found."}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
def company_latest_total_score(request, company_name):
     # find the company
    company = Company.objects.filter(name__iexact=company_name.strip()).first()
    if not company:
        return Response({"error": "Company not found."}, status=404)
    
    # get the most recent GapAnalysis record
    latest_analysis = GapAnalysis.objects.filter(company=company).order_by('-date').first()
    if not latest_analysis:
        return Response({"name": company.name, "score": 0})  # if no analysisi data return 0
    try:
        gap_data = json.loads(latest_analysis.gap_data)
        total_score = sum(sum(scores) for scores in gap_data.values() if isinstance(scores, list))
    except (json.JSONDecodeError, TypeError, ValueError) as e:
        print(f"Error processing gap_data for company {company.name}: {e}")
        total_score = 0 
    
    return Response({
        "name": company.name,
        "gap_id": latest_analysis.id,
        "score": total_score
    })