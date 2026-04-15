from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
import uuid 
from datetime import datetime
from decimal import Decimal
from .form import PaymentForm, WithdrawalForm
from .models import *
from games.models import Minislot, RockPapperSissors
from django.http import JsonResponse, HttpResponse
from .utils import DepositConfirmationMail


def make_withdrawal(request):
    if request.method == 'POST':
        form = WithdrawalForm(request.POST)
        if form.is_valid():
            data = form.save(commit=False)
            data.user = request.user
            user = User.objects.get(email=request.user.email)

            # Calculate turnover requirement: Total deposits + 50% bonus
            deposit_transactions = Deposit.objects.filter(user=request.user, status='Approved')
            total_deposit = sum(tx.amount for tx in deposit_transactions)
            turnover_requirement = total_deposit * Decimal('5')  # Total deposit + 50% bonus

            # Update user's required turnover field
            user.required_turnover = turnover_requirement
            user.save()  # Save the changes to the user instance

            # Check if user meets the turnover requirement
            if user.total_turnover < user.required_turnover:
                messages.error(
                    request,
                    f'You must bet an amount of ₱{turnover_requirement:.2f} before withdrawing. '
                    f'Your current turnover is ₱{user.total_turnover:.2f}.'
                )
                return redirect('/withdrawal')

            # Check if amount meets the minimum withdrawal amount
            if data.amount < 500:
                messages.error(request, 'The minimum withdrawal amount is ₱500.')
                return redirect('/withdrawal')
    

            # Check if user has sufficient balance
            if data.amount <= user.balance:
                # Deduct balance and save user
                user.balance -= data.amount
                

                user.required_turnover = turnover_requirement
                user.total_turnover = 0
                user.save()

                reference_number = f"{datetime.now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:6]}"

                # Save the withdrawal transaction
                data.action = 'Withdrawal'
                data.status = 'Pending'  # Initial status is pending
                data.reference_number = reference_number
                data.save()

                # Record the transaction history
                TransactionHistory.objects.create(
                    user=user,
                    amount=data.amount,
                    reference_number=reference_number,
                    action='Withdrawal',
                    status='Pending',
                )

                messages.success(request, 'Withdrawal request submitted successfully! It will be processed shortly.')
                return redirect('/profile')
            else:
                messages.error(request, 'Insufficient balance.')
                return redirect('/withdrawal')
    else:
        form = WithdrawalForm()

    return render(request, 'payments/withdrawal.html', {'form': form}) 


def make_deposit(request):
    if request.method == 'POST':
        form = PaymentForm(request.POST)
        if form.is_valid():
            depositform= form.save(commit=False)
            depositform.user = request.user
            if not Deposit.objects.filter(reference_number = depositform.reference_number).exists():
                depositform.save()
            else:
                pass
            return render(request, 'payments/confirmpayment.html', {'currency':depositform.payment_method, 'amount':depositform.amount, 'promo':depositform.promo, 'id':depositform.pk})
    else:
        form = PaymentForm()
    args = {'form': form}

    return render(request, 'payments/deposit.html', args)


#  GETS DEPOSIT STATUS
def deposit_confirmation(request):
    payment_status = Deposit.objects.filter(user = request.user).last()
    if payment_status.status == 'Approved':
        return JsonResponse({'status': 'Completed'})
    else:
        return JsonResponse({'status': 'Pending'})
    
# 
def deposit_confirmation_request(request):
    if request.method == 'POST':
        deposit_id = request.POST.get('id')
        if deposit_id is None or not deposit_id.isdigit():
            return JsonResponse({'message': 'Invalid deposit ID'}, status=400)
        
        try:
            data = Deposit.objects.get(user=request.user, pk=int(deposit_id))
            DepositConfirmationMail(request, data)
            return JsonResponse({'message': 'Confirmation Request Sent'})
        except Deposit.DoesNotExist:
            return JsonResponse({'message': 'Deposit not found'}, status=404)
        except Exception as e:
            return JsonResponse({'message': f'Error: {str(e)}'}, status=500)
        

def approve_deposit(request, id):
    try:
        deposit = Deposit.objects.get(pk = int(id), user=request.user)
        if deposit.status == 'Pending':
            deposit.status = 'Approved'
            deposit.user.balance += deposit.amount
            deposit.user.save()
            deposit.save()
            return HttpResponse('Approved')
    except:
        return HttpResponse('Deposit not found confirm with the reference number')


