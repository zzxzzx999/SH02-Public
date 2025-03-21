import os
import django
from gap.models import Company, GapAnalysis
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gap_project.settings')
django.setup()

# Set up answer set template
question_answer_set = {}
improvment_plan = {'improvement' : {},
                    'evidence' : {}}
def create_answer_sets():
    base_set_answers = [0] * 10
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
    for i in range(1, 13):
        question_answer_set[i] = base_set_answers.copy()
        improvment_plan['improvement'][i] = improvment_plan_set_answers.copy()
        improvment_plan['evidence'][i] = improvment_plan_set_answers.copy()

def get_rand_single_score():
    return [random.randint(1, 5) for _ in range(10)]

def get_full_rand_score():
    answer_set = {}
    for i in range(1, 13):
        answer_set[i] = get_rand_single_score()
    return answer_set
    
def populate():
    joes_gap_analyses = [
        "2016-11-02", "2015-11-03", "2017-06-11", "2018-06-11"
    ]
    
    res_gap_analyses = [
        "2016-11-02", "2015-11-03", "2017-06-11", "2018-06-11"
    ]
    
    companies = [
        {"Name": "Joe's Plumming Ltd", "Date Registered": "2014-11-02", "Gap Analyses": joes_gap_analyses,},
        {"Name": "Resolution Today", "Date Registered": "2014-03-08", "Gap Analyses": res_gap_analyses},
        {"Name": "Resolve Merge", "Date Registered": "2016-05-23", "Gap Analyses": res_gap_analyses},
        
    ]
    
    for company in companies:
        c = add_comp(company)
        for i, date in enumerate(company["Gap Analyses"]):
            if i != len(company["Gap Analyses"]):
                add_gap(date, c)
            else:
                add_gap(date, c, True)
            
    for c in Company.objects.all():
        for g in GapAnalysis.objects.filter(company=c):
            print(f'- {c}: {g}')
            

def add_comp(company):
    c = Company.objects.get_or_create(name=company["Name"])[0]
    c.date_registered = company["Date Registered"]
    c.save()
    return c

def add_gap(date, c, base_set_bool = False):
    g = GapAnalysis.objects.get_or_create(date=date, company=c)[0]
    g.title = f"Gap Analysis {date}"
    if base_set_bool:
        g.gap_data = question_answer_set.copy()
    else:
        g.gap_data = get_full_rand_score()
    g.improvement_plan = improvment_plan.copy()
    g.url = "https://gordon-foley.com/"
    g.save()
    
if __name__ == '__main__':
    print("Starting Gap Analysis population")
    create_answer_sets()
    print(improvment_plan)
    populate()
