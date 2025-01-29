from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from gap.views import login_user
from gap.views import CompanyViewSet
from gap.views import CompanyListView

router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='company')

from gap import views
from gap.views import login_user, company_list
urlpatterns = [
    path("admin/", admin.site.urls),
    # path('', views.index, name='index'),
    # add another path to the url patterns
    # when you visit the localhost:8000/api
    # you should be routed to the django Rest framework
    path('gap/', include('gap.urls')), # Maps any URLs starting with gap/ to be handled by gap.
    path("gap/companies/", views.index, name="index"),  # Add a direct path for the function-based view
    path('gap/GapAnalysis', views.getQuestionOrWriteAnswer, name="GapAnalysis"),
    path("api/login/", login_user, name="login"),
    path("api/", include(router.urls)),
    path('api/companies/', views.CompanyListView.as_view(), name='company_list'),
    path('api/scores/<int:gap_id>/<str:element_name>/', views.get_scores, name='get_scores'),
    path('api/overall-scores/<int:gap_id>/', views.overall_scores, name='overall_scores'),
    path('api/getQuestionOrWriteAnswer/', views.getQuestionOrWriteAnswer, name='getQuestionOrWriteAnswer'),
    path('api/companies/<str:company_name>/delete/', views.CompanyDeleteView.as_view(), name='delete_company'),
    path('api/companies/<str:company_name>/', views.company_detail, name='company_detail'),
    path('api/past_analyses/<str:company_name>/', views.get_past_analysis, name='get_past_analysis'),
]
