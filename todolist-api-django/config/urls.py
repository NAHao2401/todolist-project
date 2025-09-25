"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
#Trang quản trị mặc định của Django
from django.contrib import admin
#Định nghĩa các URL patterns
from django.urls import path, include
#Giúp tự động tạo các URL cho ViewSet
from rest_framework.routers import DefaultRouter
from todos.views import  TodoViewSet
#Sinh OpenAPI schema và giao diện Swagger UI
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
#views của JWT authentication (lấy token và refresh token)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from todos.views import RegisterView, MyTokenObtainPairView

router = DefaultRouter()
router.register(r"todos", TodoViewSet, basename="todo")
urlpatterns = [
    path('admin/', admin.site.urls),

    #OpenAPI schema + Swagger UI
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),
    #JWT auth
    path("api/token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    #Register
    path("api/register/", RegisterView.as_view(), name="register"),
    #API
    path("api/", include(router.urls)),
]
