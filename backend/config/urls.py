from django.contrib import admin
from django.urls import path,include,re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static
from config.views import logout_view

schema_view = get_schema_view(
    openapi.Info(
        title="API Documentation",
        default_version="v1",
        description="Documentation des endpoints de l'API",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="support@example.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path("tableau-de-bord/se-deconnecter/", logout_view, name="admin-logout"),
    path('api/',include('apps.user.urls')),
    path('api/',include('apps.quizz.urls')),
    path('api/',include('apps.chat.urls')),
    path('api/',include('apps.endpage.urls')),
    
    re_path(r"^api/docs/$", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    re_path(r"^api/redoc/$", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    re_path(r"^api/swagger.json$", schema_view.without_ui(cache_timeout=0), name="schema-json"),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)