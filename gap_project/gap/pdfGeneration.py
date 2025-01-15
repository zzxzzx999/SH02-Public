#from reportlab.pdfgen import canvas
#from reportlab.lib.pagesizes import letter
from .models import GapAnalysis, Company
from .jsonReadWrite import getImprovementAnswer
import os

def generateImprovementPlan(gapAnalysis):
    company_name = gapAnalysis.company.name
    const_filename = "./improvementPlan.pdf"
    pdf_filename = f"{company_name}_{gapAnalysis.date}_improv_plan.pdf"

    height_page = 720 # Change this to your template size
    width_page = 1270

    c = canvas.Canvas(const_filename, pagesize=(width_page,height_page))

    add_text(f"Gordon & Foley is awesome!", 100, 100, c, 67)
    
    for i in range(1, 13):
        for j in range(1,10):
            text = getImprovementAnswer(i, j, gapAnalysis)
            add_text(text, 10*j, 100*i + 100, c)

    # Maybe insert a Gordon and Foley Logo or something?
    #c.drawImage(image, 0, 0, width=width_page,height=height_page,mask=None)

    c.showPage() # Call this to create a new page

    c.save() # In order to save
    
    return c, pdf_filename

def add_text(text, x, y, c, size=12): # Creating this function makes it easier to insert text
    c.setFillColorRGB(255, 255, 255)
    c.setFont("Helvetica", size)
    c.drawString(x, y, text)

    