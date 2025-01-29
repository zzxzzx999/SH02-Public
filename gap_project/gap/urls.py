"""Gap App Urls"""

from django.contrib import admin
from django.urls import path, include
from . import views

app_name = 'gap'

urlpatterns = [
path('', views.index, name='index'),
path('pdfplan/', views.PdfView.as_view(), name='PdfPlan'),
path('api/create-gap/', views.create_gap, name='create_gap'),
path('api/scores/<str:company_name>/<str:element_name>/', views.get_scores, name='get_scores'),
path('api/overall-scores/<str:company_name>/', views.overall_scores, name='overall_scores'),
]
