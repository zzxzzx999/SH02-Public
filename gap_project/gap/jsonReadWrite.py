import json
import os
from django.conf import settings

def getAnswer(element, question, gapAnalysis):
    return json.loads(gapAnalysis.gap_data)[str(element)][question-1]

def getElementAnswers(element, gapAnalysis):
    return json.loads(gapAnalysis.gap_data)[str(element)]
    
def writeAnswer(answer, element, question, gapAnalysis):
    data = json.loads(gapAnalysis.gap_data)
    data[str(element)][question-1] = answer
    gapAnalysis.gap_data = json.dumps(data)
    gapAnalysis.save()
    

def getImprovementAnswer(element, question, gapAnalysis):
    return json.loads(str(gapAnalysis.improvement_plan))[str(element)][question-1]

def getAllElement(element):
    with open('src/elements-questions.json', 'r') as file:
        data = json.loads(file)[element-1]
    return data

def getAllElementQuestions(element):
    return getAllElement(element)["Questions"]

def getQuestion(element, question):
    question = {}
    question["Question"] = getAllElementQuestions(element)[question-1]
    return question

def getElementHeading(element):
    return getAllElement(element)["Section_Name"]

def getAllAnswersSingleGap(element, question, gapAnalysis):
    return json.loads(gapAnalysis.gap_data)