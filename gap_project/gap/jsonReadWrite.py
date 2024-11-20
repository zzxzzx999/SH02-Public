import json

def getAnswer(set, question, gapAnalysis):
    return json.loads(gapAnalysis.gap_data)[str(set)][question-1]
    
def writeAnswer(answer, set, question, gapAnalysis):
    data = json.loads(gapAnalysis.gap_data)
    data[str(set)][question-1] = answer
    gapAnalysis.gap_data = json.dumps(data)
    gapAnalysis.save()