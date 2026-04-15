from django.shortcuts import render
import json
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import JsonResponse


def wrath_of_olympus(request):
    return render(request, 'wrath_of_olympus/index.html')

def candy_slot_machine(request):
    return render(request, 'candy_soda/index.html')


@login_required
@require_POST
def slots_spin_api(request):
    """
    POST /api/slots/spin/
    Body: { "bet": 10 }
    Response: { "success": true, "balance": 990 }
 
    Deducts bet from user's balance before spin.
    The frontend handles the actual spin result (client-side RNG).
    For fully server-side RNG, also return the spin result here.
    """
    try:
        data = json.loads(request.body)
        bet  = int(data.get('bet', 0))
 
        # Example: using a Profile model with a `coins` field
        profile = request.user.profile
        if profile.coins < bet:
            return JsonResponse({'success': False, 'error': 'Insufficient balance'}, status=400)
 
        profile.coins -= bet
        profile.save()
 
        return JsonResponse({'success': True, 'balance': profile.coins})
 
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)
 
 
@login_required
@require_POST
def slots_win_api(request):
    """
    POST /api/slots/win/
    Body: { "amount": 50 }
    Response: { "success": true, "balance": 1040 }
 
    Credits winnings to user balance.
    """
    try:
        data   = json.loads(request.body)
        amount = int(data.get('amount', 0))
 
        profile = request.user.profile
        profile.coins += amount
        profile.save()
 
        return JsonResponse({'success': True, 'balance': profile.coins})
 
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)