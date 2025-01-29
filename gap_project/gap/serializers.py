# import serializers from the REST framework
from rest_framework import serializers
from .models import Company

# import the todo data model
from .models import *

class CompanySerializer(serializers.ModelSerializer):

    class Meta:
            model = Company
            fields = ('name',)
        
class GapAnalysisSerializer(serializers.ModelSerializer):
    gap_data = serializers.DictField(required=False)  #validates gap_data is a dictionary

    class Meta:
        model = GapAnalysis
        fields = ('title','company', 'consultant','companyRep', 'companyEmail','additionalNotes', 'gap_data', 'improvement_plan')


class QuestionsSerializer(serializers.Serializer):
    GetOrWrite = serializers.CharField(max_length=10, required=False)
    