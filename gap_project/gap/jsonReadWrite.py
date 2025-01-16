import json
import os
from django.conf import settings

def getAnswer(set, question, gapAnalysis):
    return json.loads(gapAnalysis.gap_data)[str(set)][question-1]

def getElementAnswers(set, gapAnalysis):
    return json.loads(gapAnalysis.gap_data)[str(set)]
    
def writeAnswer(answer, set, question, gapAnalysis):
    data = json.loads(gapAnalysis.gap_data)
    data[str(set)][question-1] = answer
    gapAnalysis.gap_data = json.dumps(data)
    gapAnalysis.save()
    

def getImprovementAnswer(set, question, gapAnalysis):
    return json.loads(str(gapAnalysis.improvement_plan))[str(set)][question-1]

def getQuestion(set, question):
    file_path = os.path.join(settings.BASE_DIR, 'gap/src/elements-questions.json')
    with open(file_path, 'r', encoding='UTF-8') as file:
        data = json.load(file)[set-1]
    
    data["Questions"] = data["Questions"][question-1]
    return data