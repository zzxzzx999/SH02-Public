import json
import os
from django.conf import settings

def getAnswer(element, question, gapAnalysis):
    return gapAnalysis.gap_data[str(element)][question-1]

def getElementAnswers(element, gapAnalysis):
    return gapAnalysis.gap_data[str(element)]
    
def writeAnswer(answer, element, question, gapAnalysis):
    data = gapAnalysis.gap_data
    data[str(element)][question-1] = answer
    gapAnalysis.gap_data = data
    gapAnalysis.save()
    

def getImprovementAnswer(element, question, gapAnalysis):
    return gapAnalysis.improvement_plan[str(element)][question-1]

def getAllElement(element):
    print("PINK PONY GIRLS")
    with open('gap/src/elements-questions.json', 'r', encoding='utf-8') as file:
        data = json.loads(file.read())[element-1]
    return data

def getAllElementQuestions(element):
    return getAllElement(element)["Questions"]

def getQuestion(element, question):
    file_path = os.path.join(settings.BASE_DIR, 'gap/src/elements-questions.json')
    with open(file_path, 'r', encoding='UTF-8') as file:
        data = json.load(file)[element-1]
        
    data["Questions"] = data["Questions"][question-1]
    return data

def getElementHeading(element):
    return getAllElement(element)["Section_Name"]

def getAllAnswersSingleGap(element, question, gapAnalysis):
    return gapAnalysis.gap_data

def getEvidence(gap, element):
    return gap.improvement_plan['evidence'][str(element)]

def getImprovement(gap, element):
    return gap.improvement_plan['improvement'][str(element)]
