# import serializers from the REST framework
from rest_framework import serializers
from .models import Company

# import the todo data model
from .models import *

# create a serializer class
class IndexSerializer(serializers.ModelSerializer):

    # create a meta class
    class Meta:
        model = Company
        fields = ('name','numOfAnalysis','dateRegistered', 'notes')

class CompanySerializer(serializers.ModelSerializer):

    class Meta:
            model = Company
            fields = ('name',)
        
class GapAnalysisSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = GapAnalysis
        fields = ['title', 'improvement_plan']

class QuestionsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = GapAnalysis
        fields = '__all__'
    