from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .utils import PasswordReset

from django.contrib.auth.views import (
    LogoutView,
    PasswordResetDoneView, PasswordResetConfirmView,
    PasswordResetCompleteView
)

urlpatterns = [
    path('', views.home, name='home'),
    path('profile/', views.profile, name='profile'),
    path('transaction_history/', views.history, name='history'),
    path('getbalance/', views.getbalance, name='balance'),
    path('my_rewards/', views.rewards, name="rewards"),
    path("terms&condition/", views.terms, name="terms"),
    path('more_games', views.moregames, name='moregames'),



    # authentication urls

    path('login/', views.loginview, name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', views.register, name='register'),
    path('register/<str:referal>', views.referalRegister, name='referal'),


    # Forgetting password urls
    # path('verification/<uidb64>/<token>/', views.EmailVerification, name='verification'),
    path('password_reset/', PasswordReset.as_view(template_name='auths/reset_password.html'), name='reset_password'),
    path('password_reset_done/', PasswordResetDoneView.as_view(template_name='auths/password_reset_done.html'), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', PasswordResetConfirmView.as_view(template_name='auths/password_reset_confirm.html'), name='password_reset_confirm'),
    path('password_reset_complete/', PasswordResetCompleteView.as_view(template_name='auths/password_reset_complete.html'), name='password_reset_complete'),






]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)