"""Gap App Urls"""

from django.contrib import admin
from django.urls import path, include
from . import views

app_name = 'gap'

urlpatterns = [
path('pdfplan/', views.PdfView.as_view(), name='PdfPlan'),
path('api/scores/<int:gap_id>/<str:element_name>/', views.get_scores, name='get_scores'),
path('api/overall-scores/<int:gap_id>/', views.overall_scores, name='overall_scores'),
path('api/getQuestionOrWriteAnswer/', views.getQuestionOrWriteAnswer, name='getQuestionOrWriteAnswer'),
path('api/create-gap/', views.create_gap, name='create_gap'),
path('api/get-latest-gap/', views.get_latest_gap, name='get_latest_gap'),
path('api/companies/', views.CompanyListView.as_view(), name='company_list'),
path('api/companies/<str:company_name>/delete/', views.CompanyDeleteView.as_view(), name='delete_company'),
path('api/companies/<str:company_name>/', views.company_detail, name='company_detail'),
path('api/past_analyses/<str:company_name>/', views.get_past_analysis, name='get_past_analysis'),
path('api/company-latest-total-score/<str:company_name>/', views.company_latest_total_score, name='company_latest_total_score'),
path('api/analysis/<int:gap_id>/bar-chart-data/', views.get_bar_chart_data, name='bar-chart-data'),
path('api/analysis/<str:company_name>/total-score-over-time/', views.get_total_score_over_time, name='total-score-over-time'),
path('api/element-scores/<int:gap_id>/<str:element_name>/', views.get_pie_chart_data, name='get_pie_chart_data'),
]
 