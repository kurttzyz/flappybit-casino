<<<<<<< HEAD
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.db import transaction
from decimal import Decimal, InvalidOperation
import logging
import random
import json
from .models import *
from backend.models import User

logger = logging.getLogger(__name__)

login_required(login_url='/login')
def minesweeper(request):
    wallet = request.user

    if request.method == "POST":
        data = json.loads(request.body)
        bet = data.get("bet")

        # Validate bet input
        try:
            bet = Decimal(bet)
        except (ValueError, InvalidOperation):
            return JsonResponse({'error': 'Invalid bet value.'}, status=400)

        if bet <= 0:
            return JsonResponse({'error': 'Bet must be greater than zero.'}, status=400)
        if bet > wallet.balance:
            return JsonResponse({'error': 'Insufficient balance.'}, status=400)

        # Deduct bet and create game instance
        wallet.balance -= bet
        wallet.save()

        # Generate random game board
        rows, cols = 5, 5  # Define grid size
        bomb_positions = random.sample(range(rows * cols), 5)  # 5 random bombs

        # Save game state without revealing bomb positions
        game = Game.objects.create(
            user=request.user,
            bet=bet,
            bomb_card=bomb_positions,  # Save bomb positions securely
            multiplier=0.2,
            active=True
        )

        return JsonResponse({
            'message': 'Game started successfully!',
            'game_id': game.id,
            'balance': str(wallet.balance),
            'bet': str(bet),
            'rows': rows,
            'cols': cols,
            'multiplier': 0.2,
        })

    return render(request, 'games/mines.html', {
        'wallet_balance': wallet.balance,
        'bet': None,
    })


@login_required(login_url='/login')
def reveal_card(request):
    if request.method == "POST":
        data = json.loads(request.body)
        game_id = data.get("game_id")
        cell_id = data.get("cell_id")

        try:
            game = Game.objects.get(id=game_id, user=request.user, active=True)
        except Game.DoesNotExist:
            return JsonResponse({'error': 'Game not found or already ended.'}, status=400)

        bomb_positions = game.bomb_card  # Fetch stored bomb positions

        if cell_id in bomb_positions:
            # Player clicked a bomb, end game
            game.active = False
            game.save()
            return JsonResponse({'game_over': True, 'message': 'You hit a bomb! Game over.'})

        # Calculate potential winnings
        revealed_cells = game.revealed_cells + 1
        potential_winnings = game.bet * (1 + revealed_cells * game.multiplier)
        game.revealed_cells = revealed_cells
        game.save()

        return JsonResponse({
            'game_over': False,
            'potential_winnings': potential_winnings,
        })

@login_required
def claim_reward(request):
    try:
        with transaction.atomic():  # Ensure atomic operation
            # Fetch wallet and lock it for update
            wallet = User.objects.get(id=request.user.id)
            data = json.loads(request.body)
            
            # Validate and extract required fields
            game_id = data.get('game_id')
            potential_winnings = data.get('potential_winnings')
            
            if game_id is None or potential_winnings is None:
                return JsonResponse({'error': 'Game ID and potential winnings are required.'}, status=400)
            
            try:
                potential_winnings = Decimal(potential_winnings)
            except InvalidOperation:
                return JsonResponse({'error': 'Invalid potential winnings amount.'}, status=400)

            if potential_winnings <= 0:
                return JsonResponse({'error': 'No winnings to claim.'}, status=400)

            # Fetch and validate the game
            game = Game.objects.select_for_update().get(id=game_id, user=request.user, active=True)
            
            # Update wallet and game state
            wallet.balance += potential_winnings
            wallet.save()

            game.completed_at = timezone.now()
            game.active = False  # Mark game as inactive
            game.save()

            return JsonResponse({
                'message': f'You won ₱{potential_winnings:.2f}!',
                'new_balance': float(wallet.balance),
            })
    
    except Game.DoesNotExist:
        return JsonResponse({'error': 'Game not found or already completed.'}, status=404)
    except User.DoesNotExist:
        return JsonResponse({'error': 'Wallet not found.'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON input.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)   

@login_required(login_url='/login')
def submit_minesweeper_result(request):

    return JsonResponse({ 'message': 'successful'})


@login_required(login_url='/login')
=======
from django.shortcuts import render
import json
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import JsonResponse

<<<<<<< HEAD
=======
login_required(login_url='/login')
>>>>>>> 6b2e3bd1e212ea7a3d823cbdd13bc045dadcc523
def minislot(request):
>>>>>>> 8fd357047b463a75560c6f6c577a5981f80b24cf

def wrath_of_olympus(request):
    return render(request, 'wrath_of_olympus/index.html')

<<<<<<< HEAD
def candy_slot_machine(request):
    return render(request, 'candy_soda/index.html')
=======
<<<<<<< HEAD
@login_required(login_url='/login')
def minislotresult(request):
        result1 = request.POST['result1']
        result2 = request.POST['result2']
        result3 = request.POST['result3']
        amount = request.POST['amount']

        Minislot.objects.create(user=request.user, result1=result1, result2=result2, result3=result3, stake=amount)
        user = User.objects.get(email = request.user.email)
        user.balance -= int(amount)
        user.save()
        return JsonResponse({'message': 'successful'})

@login_required(login_url='/login')
=======
login_required(login_url='/login')
def minislotresult(request):
    result1 = request.POST['result1']
    result2 = request.POST['result2']
    result3 = request.POST['result3']
    amount = request.POST['amount']
>>>>>>> 8fd357047b463a75560c6f6c577a5981f80b24cf


<<<<<<< HEAD
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
=======
>>>>>>> 6b2e3bd1e212ea7a3d823cbdd13bc045dadcc523
def flipcoin(request):

    return render(request, 'games/flipcoin.html')

<<<<<<< HEAD


logger = logging.getLogger(__name__)

from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.db import transaction
import random
import logging

logger = logging.getLogger(__name__)

@login_required(login_url='/login')
def submit_head_or_tail_result(request):
    if request.method == 'POST':
        user = request.user
        option = request.POST.get('option')  # User's choice (HEAD or TAIL)
        stake = int(request.POST.get('stake', 0))

        if stake <= 0:
            return JsonResponse({'error': 'Invalid stake amount.'}, status=400)

        try:
            with transaction.atomic():
                user = User.objects.select_for_update().get(id=user.id)

                if user.balance < stake:
                    return JsonResponse({'error': 'Insufficient balance.'}, status=400)

                # Securely determine the outcome on the backend
                outcome = random.choice(['HEAD', 'TAIL'])

                if outcome == option.strip().upper():  # User wins
                    winnings = stake * 2
                    user.balance += winnings
                    status = 'WON'
                else:
                    winnings = 0
                    user.balance -= stake
                    status = 'LOSS'

                user.save()
                HeadorTail.objects.create(
                    user=user,
                    stake=stake,
                    option=option.strip().upper(),
                    outcome=outcome,
                    winnings=winnings,
                    status=status,
                )

                # Get total wins and losses for the user
                total_winnings = HeadorTail.objects.filter(user=user, status='WON').count()
                total_losses = HeadorTail.objects.filter(user=user, status='LOSS').count()

            return JsonResponse({
                'message': f"The coin landed on {outcome}.",
                'balance': user.balance,
                'winnings': winnings,
                'status': status,
                'outcome': outcome,  # Send outcome to frontend
                'total_winnings': total_winnings,  # Total wins
                'total_losses': total_losses,  # Total losses
            })

        except Exception as e:
            logger.error(f"Error in submit_head_or_tail_result: {str(e)}")
            return JsonResponse({'error': 'An error occurred. Please try again.'}, status=500)

    return JsonResponse({'error': 'Method not allowed.'}, status=405)



@login_required(login_url='/login')
=======
def flipcoinresult(request):

    return JsonResponse({'message': 'successful'})

>>>>>>> 6b2e3bd1e212ea7a3d823cbdd13bc045dadcc523
def rockpaper(request):

    return render(request, 'games/rockpaper.html')

<<<<<<< HEAD

@login_required(login_url='/login')
def submit_rock_paper_scissors_result(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            option = data.get("option")  # Player's choice
            outcome = data.get("outcome")  # CPU's choice
            stake = int(data.get("stake", 0))  # Stake value
            user = request.user  # The currently logged-in user

            if not option or not outcome or stake <= 0:
                return JsonResponse({"error": "Invalid data submitted."}, status=400)

            if stake > user.balance:
                return JsonResponse({"error": "Insufficient balance."}, status=400)

         

            # Create a new game entry
            rock = RockPapperSissors.objects.create(
                user=user,
                stake=stake,
                option=option,
                outcome=outcome,
            )

    

            return JsonResponse(
                {
                    "message": "Game result saved successfully!",
                    "status": rock.status,
                    'update_balance': user.balance,
                    'outcome':outcome,
                    "amount": rock.amount,

                },
                status=200,
            )
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)

@login_required(login_url='/login')
=======
def rockpaperresult(request):

    return JsonResponse({'message': 'successful'})

>>>>>>> 6b2e3bd1e212ea7a3d823cbdd13bc045dadcc523
def bottlespin(request):

    
    return render(request, 'games/bottlespin.html')

<<<<<<< HEAD

@login_required(login_url='/login')
def submit_bottle_spin_result(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user = request.user
            stake = data['stake']
            choice = data['choice']
            calculated_segment = data['calculatedSegment']

            # Map segments to "UP" or "DOWN"
            segment_mapping = ["UP", "UP", "UP", "DOWN", "DOWN", "DOWN"]
            backend_outcome = segment_mapping[calculated_segment]  # Backend determines outcome

            # Determine win or loss
            win = backend_outcome == choice

            # Create a new BottleSpin instance
            bottle_spin = BottleSpin.objects.create(
                user=user,
                stake=stake,
                option=choice,
                outcome=backend_outcome,
                amount=stake * 2 if win else 0,  # Example payout logic
            )

            return JsonResponse({
                'outcome': backend_outcome,
                'amount': bottle_spin.amount,
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method.'}, status=405)



=======
def bottlespinresult(request):

    return JsonResponse({'message': 'successful'})
>>>>>>> 6b2e3bd1e212ea7a3d823cbdd13bc045dadcc523
>>>>>>> 8fd357047b463a75560c6f6c577a5981f80b24cf
