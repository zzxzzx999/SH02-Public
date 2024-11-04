from django.db import models

class Company(models.Model):
    name = models.CharField(max_length=128, unique=True)
    numOfAnalysis = models.IntegerField(default=0)
    dateRegistered = models.DateField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Companies"
    
    def __str__(self):
        return self.name
    
class GapAnalysis(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    title = models.CharField(max_length=50, default = f"Gap Analysis : {date}")
    consultant = models.CharField(max_length=128, unique=False)
    url = models.URLField()
    
    class Meta:
        verbose_name_plural = "Gap Analyses"
    
    def __str__(self):
        return self.date.strftime(format="%d/%m/%Y")
    
