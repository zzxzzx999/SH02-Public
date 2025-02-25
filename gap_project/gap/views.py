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
from .pdfGeneration import *
from .jsonReadWrite import *
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import action
from django.http import FileResponse

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):

    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username = username, password = password)

    if user:
        token, created = Token.objects.get_or_create(user=user)
        is_admin = username == 'GAPAdmin'
        role = "admin" if is_admin else "consultant"
        return Response({'token' : token.key, 'username': user.username, 'is_admin' : is_admin, 'role': role })
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
    url = request.data.get('url')

    try:
        company_instance = Company.objects.get(name=company_name)
        gap = GapAnalysis.objects.create(
            company=company_instance, 
            consultant=consultant, 
            companyRep=company_rep,
            companyEmail=company_email, 
            additionalNotes=additional_notes,
            url=url
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


pdf_filename = ""
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
                filename = pdf_filename  # Sets the downloaded file name
            )
        except FileNotFoundError:
            return Response({'error': 'File not found'}, status=404)        
    def post(self, request):
        #return download(request)
        gapId = request.data.get('id')
        #gap = GapAnalysis.objects.get(id=gapId) #This will be the actual line, but need specific test data that works
        gap = GapAnalysis.objects.get(company = Company.objects.get(name ="Resolution Today"), date = "2018-06-11")
        generatePdfPlan(gap)
        pdf_filename = f"{gap.title}.pdf"
        return Response({'pdf' : pdf_filename}, status=200)
        
@api_view(['GET'])
@permission_classes([AllowAny])
def get_incomplete_answers(request):
    gap_id = request.query_params.get("gap_id")

    try:
        gap = GapAnalysis.objects.get(id=gap_id)
    except GapAnalysis.DoesNotExist:
        return Response({"error": "GapAnalysis not found"}, status=404)

    serializer = AnswersSerializer(gap)
    return Response(serializer.data, status=200)


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
        finished = data.get("finished")
        company = Company.objects.get(name = data.get("company_name"))
        print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" , company)
        print(data.get("id"))
        try:
            gap = GapAnalysis.objects.get(id=data.get("id"))
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'GapAnalysis record not found for the given gapID'}, status=404)
        gap.gap_data = data.get("answers")
        gap.improvement_plan = data.get("improvementPlan")
        print("finished: ", finished)
        if finished:
            print(company.name)
            company.current_gap = False
            print(company.current_gap)
            company.save()
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


    gap_data = analysis.gap_data
    element_names = [
        "Policy", "Management", "Documented System", "Meetings", "Performance Measurement",
        "Committee & Representatives", "Investigation Process", "Incident Reporting", "Training Plan",
        "Risk Management Process", "Audit & Inspection Process", "Improvement Planning"
    ]
    element_index = str(element_names.index(element_name) + 1)  # index start from 1
    element_scores = gap_data.get((element_index), [])

    scores = {
        "exceptionalCompliance": sum(int(score) for score in element_scores if int(score) == 5),
        "goodCompliance": sum(int(score) for score in element_scores if int(score) == 4),
        "basicCompliance": sum(int(score) for score in element_scores if int(score) == 3),
        "needsImprovement": sum(int(score) for score in element_scores if int(score) == 2),
        "unsatisfactory": sum(int(score) for score in element_scores if int(score) == 1)
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
            "title":analysis.title,
            "url" : analysis.url
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
    

    gap_data=analysis.gap_data
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
        total_score += sum(int(score) for score in scores if isinstance(score, (int, float)) or score.isdigit())


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
        gap_data = (latest_analysis.gap_data)
        total_score = sum(sum(scores) for scores in gap_data.values() if isinstance(scores, list))
    except (json.JSONDecodeError, TypeError, ValueError) as e:
        print(f"Error processing gap_data for company {company.name}: {e}")
        total_score = 0 
    
    return Response({
        "name": company.name,
        "gap_id": latest_analysis.id,
        "score": total_score
    })


#API for bar charts
@api_view(['GET'])
def get_bar_chart_data(request, gap_id):
    try:
        analysis = GapAnalysis.objects.get(id=gap_id)
    except GapAnalysis.DoesNotExist:
        return JsonResponse({"error": f"GapAnalysis with id {gap_id} not found."}, status=404)

    gap_data = analysis.gap_data
    element_names = [
        "Policy", "Management", "Documented System", "Meetings", "Performance Measurement",
        "Committee & Representatives", "Investigation Process", "Incident Reporting", "Training Plan",
        "Risk Management Process", "Audit & Inspection Process", "Improvement Planning"
    ]

    categories = element_names
    values = []

    for element_name in element_names:
        element_index = str(element_names.index(element_name) + 1)  # index starts from 1
        element_scores = gap_data.get(element_index, [])
        total_score = sum(int(score) for score in element_scores if isinstance(score, (int, float)) or str(score).isdigit()) if element_scores else 0 # Sum of all scores for the element, default to 0 if no scores
        values.append(total_score)

    return JsonResponse({
        "categories": categories,
        "values": values
    })

# API for line chart
@api_view(['GET'])
def get_total_score_over_time(request, company_name):
    try:
        # Fetch all GAP analyses for the company
        analyses = GapAnalysis.objects.filter(company__name=company_name).order_by('date')
    except GapAnalysis.DoesNotExist:
        return JsonResponse({"error": f"No GAP analyses found for company {company_name}."}, status=404)

    gap_dates = []
    total_scores = []

    for analysis in analyses:
        gap_dates.append(analysis.date.strftime("%Y-%m-%d"))  # Format date as string
        gap_data = analysis.gap_data
        
        # get the total scores for each of the gap analyses in the company
        if gap_data:
            total_score = 0
            for scores in gap_data.values(): 
                for score in scores: 
                    total_score += int(score) 
        else:
            total_score = 0 

        total_scores.append(total_score)

    return JsonResponse({
        "gap_date": gap_dates,
        "total_score": total_scores
    })

# API for bar chart 
@api_view(['GET'])
def get_pie_chart_data(request, gap_id,element_name):
    try:
        analysis = GapAnalysis.objects.get(id=gap_id)
    except GapAnalysis.DoesNotExist:
        return Response({"error": f"GapAnalysis with id {gap_id} not found."}, status=404)
    gap_data = analysis.gap_data
    element_names = [
        "Policy", "Management", "Documented System", "Meetings", "Performance Measurement",
        "Committee & Representatives", "Investigation Process", "Incident Reporting", "Training Plan",
        "Risk Management Process", "Audit & Inspection Process", "Improvement Planning"
    ]
    element_index = str(element_names.index(element_name) + 1) # change to the key of gap_data which is string
    element_scores = gap_data.get(element_index, []) # get all data of this element
    print(element_scores)
    
    score_counts = {
        "exceptional": sum(1 for score in element_scores if int(score) == 5),
        "good": sum(1 for score in element_scores if int(score) == 4),
        "basic": sum(1 for score in element_scores if int(score) == 3),
        "needsImprovement": sum(1 for score in element_scores if int(score) == 2),
        "unsatisfactory": sum(1 for score in element_scores if int(score) == 1)
    }
    pie_data = [{"name": category, "value": count} for category, count in score_counts.items()]

    return Response(pie_data)


