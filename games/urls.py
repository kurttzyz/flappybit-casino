from django.urls import path
from . import views

app_name ='games'

urlpatterns = [
    # 5*3 slot games urls
    path('wrath_of_olympus', views.wrath_of_olympus, name='wrath_of_olympus'),
    path('candy_soda', views.candy_slot_machine, name="candy_slot_machine"),
    path('royal_masquerade', views.royal_masquerade, name="royal_masquerade"),
]