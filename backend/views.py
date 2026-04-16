from django.shortcuts import render, redirect
from  django.http import HttpResponse, JsonResponse
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_str
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from . models import *
from . forms import *
from . utils import *
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.core.mail import EmailMessage
from django.contrib.auth.decorators import login_required
from payments.models import TransactionHistory
from django.db.models import Count, Sum
import json
from django.db import transaction


def home(request):
    
   

    return render(request, 'backend/index.html')


# def EmailVerification(request, uidb64, token):
#     try:
#         uid =  force_str(urlsafe_base64_decode(uidb64))
#         user = User.objects.get(pk=uid)
#     except(TypeError,ValueError, OverflowError, User.DoesNotExist):
#         user = None
#     if user is not None and TokenGenerator.check_token(user, token):
#         user.is_active=  True
#         user.save()
#         messages.add_message(request, messages.SUCCESS, 'Email verification complete. You can now enter your email and password.' )
#     return redirect('/login')

def register(request):
    if request.method == 'POST':
        form = RegisterationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = True
            user.save()
            # sending mail
            # website = get_current_site(request).domain
            # email_subject = 'Email Verification'
            # email_body =  render_to_string('email/activation.html',{
            #     'user':user.first_name,
            #     'domain':website,
            #     'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            #     'token': TokenGenerator.make_token(user)
            # })
            # email = EmailMessage(subject=email_subject, body=email_body,
            #     from_email='TestMail <info.testmail@zohomail.com>', to=[user.email]
            #     )
            # email.content_subtype = 'html'
            # email.send()
            messages.success(request, 'Registeration Successful')
            return redirect('/login')
    else:
        form = RegisterationForm()

    args = {'forms': form}
    return render(request, 'auths/register.html', args)



def referalRegister(request, code):
    if request.method == 'POST':
        form = RegisterationForm(request.POST)
        referer =  User.objects.get(referal=code)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = True
            user.refered_by = referer.email
            user.save()
            # # sending mail
            # website = get_current_site(request).domain
            # email_subject = 'Email Verification'
            # email_body =  render_to_string('email/activation.html',{
            #     'user':user.first_name,
            #     'domain':website,
            #     'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            #     'token': TokenGenerator.make_token(user)
            # })
            # email = EmailMessage(subject=email_subject, body=email_body,
            #     from_email='TestMail <info.testmail@zohomail.com>', to=[user.email]
            #     )
            # email.content_subtype = 'html'
            # email.send()
            messages.success(request, 'Registeration Successful')
            return redirect('/login')
    else:
        form = RegisterationForm()
    args = {'forms':form}
    return render(request, 'auths/register.html', args)



def loginview(request):
    if not request.user.is_authenticated:
        if request.method == 'POST':
            email =  request.POST.get('email')
            password = request.POST.get('password')

            try:
                active =  User.objects.get(email=email)
                if active.is_active == True:
                    user = authenticate(request, email=email, password=password)

                    if user is not None:
                        login(request, user)
                        next_url = request.POST.get('next', request.GET.get('next'))
                
                        if next_url:
                            return redirect(next_url)
                        else:
                            return redirect('/')           
                    else:
                        messages.error(request, 'Invalid email or password.')
                else:
                    messages.error(request, 'Verify your account. To verify your account check your gmail or spam folder, contact support for assistance.')
                    return redirect('/login')
            except:
                messages.error(request, 'Invalid email or password.')
        return render(request, 'auths/login.html')
    else:
        return redirect('/')
    

def profile(request):
        
        valid_referrals_count = User.objects.filter(referred_by=request.user, has_received_referral_reward=True).count()
        leaderboard = (
            User.objects.annotate(
            total_referrals=Count('referrals'),
            total_income=Sum('referral_income')
        )
        .order_by('-total_income', '-total_referrals')  # Order by income, then referrals
        )
        
   

        context = {
            'valid_referrals_count' : valid_referrals_count,
            'leaderboard' : leaderboard
        }
        return render(request, 'backend/profile.html', context)
    


def history(request):
    total_history = TransactionHistory.objects.all().filter(user=request.user)
    args = {'history': total_history}
    return render(request, 'backend/history.html', args)


@login_required
def getbalance(request):
    try:
        user = User.objects.get(email = request.user.email)
        bal = user.balance
        return JsonResponse({'bal': bal})
    except:
        return JsonResponse({'bal': 0})
    

def rewards(request):
    valid_referrals_count = User.objects.filter(referred_by=request.user, has_received_referral_reward=True).count()

    context = {
        'valid_referrals_count' : valid_referrals_count,
    }
    return render(request, 'backend/rewards.html', context)

def terms(request):
    return render(request, 'backend/terms.html')


def moregames(request):

    return render(request, 'backend/games.html')

@login_required
def claim_reward_api(request):
    if request.method == 'POST':
    
            data = json.loads(request.body)
            tier = data.get('tier')
            reward = data.get('reward', 0)
            required_referrals = data.get('required_referrals', 0)
            valid_referrals_count = User.objects.filter(referred_by=request.user, has_received_referral_reward=True).count()

            # Ensure the user has enough referrals
            if valid_referrals_count >= required_referrals:
                # Update the user's referral income
                reward_amount = int(reward.replace('₱', '').replace(',', ''))
                request.user.referral_income += reward_amount
                request.user.save()

                return JsonResponse({'success': True, 'message': f'{reward} from {tier} claimed successfully!'})
            else:
                return JsonResponse({'success': False, 'message': 'Not enough referrals to claim this reward.'})
        
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method.'})


@login_required
def claim_referral_income(request):
    user = request.user  # Get the currently logged-in user
    
    # Call the model method
    user.claim_referral_income()
   
    
    return redirect('/profile')  # Redirect to a relevant page