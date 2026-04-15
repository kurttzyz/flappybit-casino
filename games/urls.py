from django.urls import path
from . import views

<<<<<<< HEAD
app_name = 'games'


urlpatterns = [
    # urls for mines
    path("minesweeper/", views.minesweeper, name="minesweeper"),
    path('flappybet.mines/reveal/', views.reveal_card, name='flappybet.reveal'),
    path("flappybet.claim-reward/", views.claim_reward, name="claim_reward"),  # Add this if required
    path('submit_minesweeper_result', views.submit_minesweeper_result, name='minesweeper_result'),


    # urls for minislot
    path('minislot/', views.minislot, name='minislot'),
    path('submit_minislot_result/', views.minislotresult, name='minislotresult'),


    # urls for head & tail 
    path('head_tail/', views.flipcoin, name='flipcoin'),
    path('submit_head_or_tail_result/', views.submit_head_or_tail_result, name='head_or_tail_result'),



    #urls for rock paper scissor
    path('rock_paper_sissors/', views.rockpaper, name='rockpaper'),
    path('submit_rock_paper_sissors_result/', views.submit_rock_paper_scissors_result, name='rockpaper_result'),


    #urls for bottle_spin
    path('bottle_spin/', views.bottlespin, name='bottlespin'),
    path('submit_bottlespin_result/', views.submit_bottle_spin_result, name='bottlespin_result'),

]
=======
app_name ='games'

urlpatterns = [
<<<<<<< HEAD
    
    # 5*3 slot games urls
    path('wrath_of_olympus', views.wrath_of_olympus, name='wrath_of_olympus'),
    path('candy_soda', views.candy_slot_machine, name="candy_slot_machine")
]
=======
    path('minislot/', views.minislot, name='minislot'),
    path('submit_minislot_result/', views.minislotresult, name='minislotresult'),

    path('head_tail/', views.flipcoin, name='flipcoin'),
    path('submit_head_or_tail_result/', views.flipcoinresult, name='minislotresult'),


    path('rock_paper_sissors/', views.rockpaper, name='rockpaper'),
    path('submit_rock_paper_sissors_result/', views.rockpaperresult, name='minislotresult'),


    path('bottle_spin', views.bottlespin, name='bottlespin'),
    path('submit_bottlespin_result/', views.bottlespinresult, name='minislotresult'),
]
>>>>>>> 6b2e3bd1e212ea7a3d823cbdd13bc045dadcc523
>>>>>>> 8fd357047b463a75560c6f6c577a5981f80b24cf
