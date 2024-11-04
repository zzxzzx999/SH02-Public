"""Gap App Urls"""

from django.urls import path
from gap import views

app_name = 'gap'

urlpatterns = [
path('', views.index, name='index'),
]
