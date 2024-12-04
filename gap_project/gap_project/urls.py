from django.contrib import admin
from django.urls import path, include
from gap import views
from gap.views import login_user, company_list

urlpatterns = [
    path("admin/", admin.site.urls),
    # path('', views.index, name='index'),
    # add another path to the url patterns
    # when you visit the localhost:8000/api
    # you should be routed to the django Rest framework
    path('gap/', include('gap.urls')), # Maps any URLs starting with gap/ to be handled by gap.
    path("gap/companies/", views.index, name="index"),  # Add a direct path for the function-based vie
    path("api/login/", login_user, name="login"),
    path("api/companies/", company_list, name="company_list"),


]
