from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from gap.views import login_user
from gap.views import CompanyViewSet

router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='company')

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/login/", login_user, name="login"),
    path("api/", include(router.urls)),
    path("gap/", include("gap.urls")),
]
