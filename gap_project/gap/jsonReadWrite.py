import json

def get_element_answers(element, gap_analysis):
    print(gap_analysis.gap_data)
    return gap_analysis.gap_data[str(element)]

def get_all_element(element):
    print("PINK PONY GIRLS")
    with open('gap/src/elements-questions.json', 'r', encoding='utf-8') as file:
        data = json.loads(file.read())[element-1]
    return data

def get_question(element, question):
    data = get_all_element(element)    
    data["Questions"] = data["Questions"][question-1]
    return data

def get_element_heading(element):
    return get_all_element(element)["Section_Name"]

def get_evidence(gap, element):
    return gap.improvement_plan['evidence'][str(element)]

def get_improvement(gap, element):
    return gap.improvement_plan['improvement'][str(element)]
