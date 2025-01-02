import json

def getAnswer(set, question, gapAnalysis):
    return json.loads(gapAnalysis.gap_data)[str(set)][question-1]
    
def writeAnswer(answer, set, question, gapAnalysis):
    data = json.loads(gapAnalysis.gap_data)
    data[str(set)][question-1] = answer
    gapAnalysis.gap_data = json.dumps(data)
    gapAnalysis.save()
    

def getImprovementAnswer(set, question, gapAnalysis):
    return json.loads(str(gapAnalysis.improvement_plan))[str(set)][question-1]

def getQuestion(set, question):
    with open('src/elements-questions.json', 'r') as file:
        data = json.loads(file)[set-1]
    
    data["Questions"] = data["Questions"][question-1]
    return data