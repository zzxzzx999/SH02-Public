import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE',
'gap_project.settings')
import django
django.setup()
from django.db import models
from gap.models import Company, GapAnalysis
import json

#Set up answer set template
singular_set_answers = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
improvment_plan_set_answers = [
    "Hello, this should be question one of a set",
    "Me again, this is question 2",
    "sOrry for inconsistiency in numbering- 3 three",
    "that last one was just question 3, not thirty three. This is qFour",
    "Five. I am bored",
    "6666666666",
    "SEvvvennnnn",
    "eigh",
    "t. Nine",
    "fjkdlsjfdklfjk10101010101001",
]
question_answer_set = {}
improvment_plan = {}
for i in range(1, 13):
    question_answer_set[i] = singular_set_answers.copy()
    improvment_plan[i] = improvment_plan_set_answers.copy()
    

def populate():
    joes_gap_analyses = [
        "2016-11-02", "2015-11-03", "2017-06-11", "2018-06-11"
    ]
    
    res_gap_analyses = [
        "2016-11-02", "2015-11-03", "2017-06-11", "2018-06-11"
    ]
    
    companies = [
        {"Name" : "Joe's Plumming Ltd",
         "Date Registered" : "2014-11-02",
         "Gap Analyses" : joes_gap_analyses},
        {"Name" : "Resolution Today",
         "Date Registered" : "2014-03-08",
         "Gap Analyses" : res_gap_analyses}
    ]
    
        
    for company in companies:
        c = add_comp(company)
        for i, date in enumerate(company["Gap Analyses"]):
            add_gap(date, c, i)
            
    for c in Company.objects.all():
        for g in GapAnalysis.objects.filter(company = c):
            print(f'- {c}: {g}')
            
            

def add_comp(company):
    c = Company.objects.get_or_create(name = company["Name"])[0]
    c.dateRegistered = company["Date Registered"]
    c.save()
    return c

def add_gap(date, c, i):
    g = GapAnalysis.objects.get_or_create(date = date, company = c, )[0]
    print(date)
    g.title = f"Gap Analysis{date}"
    g.gap_data = json.dumps(question_answer_set.copy())
    g.improvement_plan = json.dumps(improvment_plan.copy())
    g.save()
    
if __name__ == '__main__':
    print("Starting Gap Analysis population")
    populate()
    
            
    
    