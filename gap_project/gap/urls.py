"""Gap App Urls"""

from django.contrib import admin
from django.urls import path, include
from gap import views


app_name = 'gap'

urlpatterns = [
path('', views.index, name='index'),
path('pdfplan/', views.PdfView.as_view(), name='PdfPlan'),
]
