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
    
def create_test_data():
    company, created = Company.objects.get_or_create(name="test")
    gap_data={
        "1":[5,4,3,2,1],"2":[10,8,3,16,6],
        "3":[20,16,6,2,1], "4":[10,12,9,2,1], "5":[10,16,9,8,3],
        "6":[5,12,12,8,4], "7":[10,8,12,14,1], "8":[20,16,12,4,2],
        "9":[10,24,3,2,1],"10":[15,12,18,2,1], 
        "11":[25,4,3,2,1], "12":[20,16,9,4,1]
    }

    gap_analysis, created = GapAnalysis.objects.get_or_create(
        company=company,
        date="2025-01-01",  
        consultant="Tester",
    )

    gap_analysis.gap_data = json.dumps(gap_data)
    gap_analysis.save()
    
def populate():
    create_test_data()
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
    g.title = f"Gap Analysis{i} : {date}"
    g.gap_data = json.dumps(question_answer_set.copy())
    g.improvement_plan = json.dumps(improvment_plan.copy())
    g.save()
    
if __name__ == '__main__':
    print("Starting Gap Analysis population")
    populate()
    
            
    