from django.urls import path
from apps.user.views import ProfileView, LoginView,LogoutView,RegisterView

urlpatterns = [
    path('profile/',ProfileView.as_view(),name="profile"),#GET
    path('login/',LoginView.as_view(),name="login"),#POST
    path('register/',RegisterView.as_view(),name="register"),#POST
    path('logout/',LogoutView.as_view(),name='logout'),#PUT
] 
