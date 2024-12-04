# import serializers from the REST framework
from rest_framework import serializers

# import the todo data model
from .models import Company

# create a serializer class
class IndexSerializer(serializers.ModelSerializer):

    # create a meta class
    class Meta:
        model = Company
        fields = ('name','numOfAnalysis','dateRegistered', 'notes')