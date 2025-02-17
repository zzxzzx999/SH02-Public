from pylatex import (
    Alignat,
    Axis,
    Document,
    Figure,
    Math,
    Matrix,
    Plot,
    Section,
    Subsection,
    Tabular,
    TikZ,
)
from .jsonReadWrite import *

def generateImprovementPDF(gapAnalysis):
    pdfTitle = f"{gapAnalysis.company.name} Gap {gapAnalysis.date} Improvement Notes"
    geometry_options = {"tmargin": "1cm", "lmargin": "10cm"}
    doc = Document(geometry_options=geometry_options)
    
    with doc.create(Section(pdfTitle)):
        doc.append("Some this is where the improvement plan would be")
    
        #for i in range(1,13):
        #    with doc.create(Subsection(jsonReadWrite.getElementHeading(i))):
        #        questions = jsonReadWrite.getAllElementQuestions(i)
        #        with doc.create(Tabular("rc|cl")) as table:
        #            for question in questions:
        #                table.add_hline()
        #                table.add_row((question["Question_Number"], question["Question_Name"]))
        
        return doc.generate_pdf(pdfTitle, clean_tex=False), pdfTitle