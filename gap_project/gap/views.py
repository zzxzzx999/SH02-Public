from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Company, Score
from rest_framework.authtoken.models import Token
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework.decorators import permission_classes
from django.contrib.auth.models import User
from .serializers import IndexSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


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

@csrf_exempt
def get_scores(request, company_name, element_name):
    if company_name is None or element_name is None:
        return JsonResponse({"error": "Invalid parameters"}, status=400)

    scores = {
        "exceptionalCompliance": 10,
        "goodCompliance": 8,
        "basicCompliance": 3,
        "needsImprovement": 4,
        "unsatisfactory": 2,
    }
    return JsonResponse({"scores": scores})

@api_view(['GET'])
@permission_classes([AllowAny])
def overall_scores(request, company_name):
    # Get all scores for a specified company from the database
    scores = Score.objects.filter(company_name=company_name)

    element_names = [
        "policy", "management", "documented", "meetings", "performance measurement",
        "committee&representatives", "investiagtion process", "incident reporting", "training plan",
        "risk management process", "audit&inspection process", "improvement planning"
    ]

    total_score = 0
    totals = {"unsatisfactory":0, "needsImprovement":0, "basic":0}
    total=600

    #Summarize the scores by category
    for score in scores:
        if score.score == 1:  # unsatisfactory
            totals["unsatisfactory"] += score.score
        elif score.score == 2:  # needsImprovement
            totals["needsImprovement"] += score.score
        elif score.score == 3:  # basic
            totals["basic"] += score.score

        total_score += score.score

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