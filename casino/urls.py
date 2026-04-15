
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('backend.urls')),
    path('', include('payments.urls', namespace='payments')),
<<<<<<< HEAD
    path('games/', include('games.urls', namespace='games'))
=======
    path('games/', include('games.urls', namespace='games')),
>>>>>>> 6b2e3bd1e212ea7a3d823cbdd13bc045dadcc523
]
