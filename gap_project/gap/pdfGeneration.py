from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from .jsonReadWrite import *

import os
from rest_framework.renderers import BaseRenderer

class BinaryFileRenderer(BaseRenderer):
    media_type = 'application/octet-stream'
    format = None
    charset = None
    render_style = 'binary'

    def render(self, data, media_type=None, renderer_context=None):
        return data

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
    

def examplePdfCreation(gap):
    const_filename = "frontend/src/components/improvementPlan.pdf"
    height_page = 720 # Change this to your template size
    width_page = 1270

    c = canvas.Canvas(const_filename, pagesize=(width_page,height_page))

    c.drawString(100, 100,f"\nThey will now do the improvements for {gap.company.name}!")
    c.drawString(400,400, "WHY WOUOLD THIS BE THE PROBLEM NOW") 
    c.drawString(600,600, "GFHDJKFHSKJGHJKLH")
    c.save() # In order to save
    
    return c, gap.title

    