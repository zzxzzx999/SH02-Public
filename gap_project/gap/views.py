from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import IndexSerializer
from .models import Company

@api_view(['GET'])
def index(request):
    queryset = Company.objects.all()
    serializer = IndexSerializer(queryset, many=True)
    
    return Response(serializer.data, status=201)
