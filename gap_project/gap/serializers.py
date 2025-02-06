# import serializers from the REST framework
from rest_framework import serializers
from .models import Company

# import the todo data model
from .models import *

class CompanyListSerializer(serializers.ModelSerializer):
 
    # create a meta class
    class Meta:
        model = Company
        fields = ('name','numOfAnalysis','dateRegistered', 'notes')

class CompanySerializer(serializers.ModelSerializer):

    class Meta:
            model = Company
            fields = ('name','dateRegistered', 'notes')
        
class GapAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = GapAnalysis
        fields = ('title', 'company', 'consultant', 'companyRep', 'companyEmail', 'additionalNotes', 'gap_data', 'improvement_plan')

    def create(self, validated_data):
        """ Handle JSON fields properly """
        gap_data = validated_data.pop('gap_data', {})
        improvement_plan = validated_data.pop('improvement_plan', {})

        # Create the GapAnalysis instance
        gap_analysis = GapAnalysis.objects.create(**validated_data, gap_data=gap_data, improvement_plan=improvement_plan)
        return gap_analysis


class QuestionsSerializer(serializers.Serializer):
    GetOrWrite = serializers.CharField(max_length=10, required=False)
    