"""Gap App Urls"""

from django.urls import path
from . import views

app_name = 'gap'

urlpatterns = [
path('', views.index, name='index'),
path('api/scores/<str:company_name>/<str:element_name>/', views.get_scores, name='get_scores'),
path('api/overall-scores/<str:company_name>/', views.overall_scores, name='overall_scores'),
]
