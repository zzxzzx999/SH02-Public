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
    path('gap/GapAnalysis', views.get_question_or_write_answer, name="GapAnalysis"),
    path("api/pdfplan/", views.PdfView.as_view(), name="PdfPlan"),
    path("api/login/", login_user, name="login"),
    path("api/", include(router.urls)),
    path('api/companies/', views.CompanyListView.as_view(), name='company_list'),
    path('api/scores/<int:gap_id>/<str:element_name>/', views.get_scores, name='get_scores'),
    path('api/overall-scores/<int:gap_id>/', views.overall_scores, name='overall_scores'),
    path('api/getQuestionOrWriteAnswer/', views.get_question_or_write_answer, name='getQuestionOrWriteAnswer'),
    path('api/get_incomplete_answers/', views.get_incomplete_answers, name='get_incomplete_answers'),
    path('api/companies/<str:company_name>/delete/', views.CompanyDeleteView.as_view(), name='delete_company'),
    path('api/companies/<str:company_name>/', views.company_detail, name='company_detail'),
    path('api/past_analyses/<str:company_name>/', views.get_past_analysis, name='get_past_analysis'),
    path('api/company-latest-total-score/<str:company_name>/', views.company_latest_total_score, name='company_latest_total_score'),
    path('api/create-gap/', views.create_gap, name='create_gap'),
    path('api/get-latest-gap/', views.get_latest_gap, name='get_latest_gap'),
    path('api/analysis/<int:gap_id>/bar-chart-data/', views.get_bar_chart_data, name='bar-chart-data'),
    path('api/analysis/<str:company_name>/total-score-over-time/', views.get_total_score_over_time, name='total-score-over-time'),
    path('api/element-scores/<int:gap_id>/<str:element_name>/', views.get_pie_chart_data, name='get_pie_chart_data'),
]
