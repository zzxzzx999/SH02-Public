from django.utils import timezone
from django.db import models

class Company(models.Model):
    name = models.CharField(max_length=128, unique=True)
    numOfAnalysis = models.IntegerField(default=0)
    dateRegistered = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        verbose_name_plural = "Companies"
    
    def __str__(self):
        return self.name
    
class GapAnalysis(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    date = models.DateField(default = timezone.now)
    title = models.CharField(max_length=50, default = f"Gap Analysis : {date}")
    consultant = models.CharField(max_length=128, unique=False)
    gap_data = models.JSONField(default=dict)
    improvement_plan = models.JSONField(default=dict)

    
    class Meta:
        verbose_name_plural = "Gap Analyses"
    
    def __str__(self):
        return self.date.strftime(format="%d/%m/%Y")

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)
    is_admin = models.BooleanField(default=False)
    
    def __str__(self):
        return self.user.username
    
    
