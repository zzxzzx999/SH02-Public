from django import forms
from gap.models import Company, GapAnalysis
from django.utils import timezone

        
#Answer set template
singular_set_answers = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
question_answer_set = {}
for i in range(1, 13):
    question_answer_set[i] = singular_set_answers.copy()

class CompanyForm(forms.ModelForm):
    name = forms.CharField(max_length=128, help_text="Please enter the company name.",)
    numOfAnalysis = forms.IntegerField(forms.HiddenInput(), initial=0)
    
    class Meta:
        model = Company
        fields = ('name',)
        

class GapAnalysisForm(forms.ModelForm):
    consultant = forms.CharField(max_length=128, help_text="Please enter your name.")
    today = timezone.now
    date = forms.DateField(initial=today)
    title = forms.CharField( forms.HiddenInput(), max_length=50, initial=f"Gap Analysis : {date}")
    gap_data = forms.JSONField(forms.HiddenInput(), initial = question_answer_set.copy())
    
    class Meta:
        model = GapAnalysis
        fields = ('consultant','date',)