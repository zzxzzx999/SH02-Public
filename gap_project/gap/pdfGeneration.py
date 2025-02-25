from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from .jsonReadWrite import *
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
import os
from rest_framework.renderers import BaseRenderer

class BinaryFileRenderer(BaseRenderer):
    media_type = 'application/octet-stream'
    format = None
    charset = None
    render_style = 'binary'

    def render(self, data, media_type=None, renderer_context=None):
        return data


def createElementTable(issues, improvements, element, scores):
    # Generate table data with numbering
    table_data = [["#", "Issue", "Improvement", "Score"]]  # Table headers
    for i, (issue, improvement, score) in enumerate(zip(issues, improvements, scores), start=1):
        # use Paragraph() to allow wrapping of text
        issue_paragraph = Paragraph(issue)
        improvement_paragraph = Paragraph(improvement)

        table_data.append([i, issue_paragraph, improvement_paragraph, score])

    # Add table title
    styles = getSampleStyleSheet()
    title = Paragraph(getElementHeading(element), styles["Title"])

    # Create table
    return Table(table_data, colWidths=[30, 250, 250, 50]), title


def generatePdfPlan(gap):
    # Create PDF
    const_filename = "gap/src/improvementPlan.pdf"
    title = f"{gap.company.name}: {gap.date}"
    pdf = SimpleDocTemplate(const_filename, pagesize=letter, title=title)
    elements = []
    
    score_colors = {
        0: "FF0000",
        1: "#FF0B0B",
        2: "#FFC546",  
        3: "#7CCC8B",  
        4: "#42C259",
        5: "#006613",
    }

    heading_style = ParagraphStyle(
        f"{gap.company.name}: {gap.date}",
        fontSize=25,             
        spaceAfter=30,             
        alignment=1,               
    )

    link_style = ParagraphStyle(
        f"Evidence link: {gap.url}",
        fontSize=15,             
        spaceAfter=40,             
        alignment=1,               
    )

    main_heading = Paragraph(f"<b><u>{gap.company.name}: {gap.date}</u></b>", heading_style)
    link = Paragraph(f"Evidence link: {gap.url}", link_style)
    elements.append(main_heading)
    elements.append(link)


    for i in range(1, 13):
        scores = getElementAnswers(i, gap)
        table, title = createElementTable(gap.improvement_plan[str(i)], pdfFormatElement(gap, i), i, scores)

        # Style the table
        style = TableStyle([
            ('WORDWRAP', (0, 0), (-1, -1), True),
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),  # Header row
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 20),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),  # Data rows
            ('GRID', (0, 0), (-1, -1), 1, colors.black)  # Borders
        ])

        # Add color styling for the "Score" column
        for row_num, score in enumerate(scores, start=1):
            hex_color = score_colors.get(score, "#FFFFFF")  # Default to white if no color found
            style.add('BACKGROUND', (3, row_num), (3, row_num), HexColor(hex_color))

        table.setStyle(style)

        # Add title, table, and spacing
        elements.append(title)  # Add table title
        elements.append(Spacer(1, 12))  # Add spacing before table
        elements.append(table)
        elements.append(Spacer(1, 24))  # Add spacing after table

    # Build PDF
    pdf.build(elements)
    print(f"PDF generated: {gap.title}")

