
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('backend.urls')),
    path('', include('payments.urls', namespace='payments')),
    path('games/', include('games.urls', namespace='games'))
]
