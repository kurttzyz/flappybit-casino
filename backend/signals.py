from django.db.models.signals import post_save
from django.dispatch import receiver
from payments.models import Deposit

# This signal verify whether to credit the 50 the referred user needs to deposit 200 before having 50
@receiver(post_save, sender=Deposit)
def handle_verified_payment(sender, instance, **kwargs):
    # Check if the deposit is approved and the amount meets the threshold
    if instance.status == 'Approved' and instance.amount >= 200:
        # Check if the user has a referring user
        referring_user = instance.user.referred_by
        
        # Ensure the referral bonus is credited only once
        if referring_user and not instance.user.has_received_referral_reward:
            # Credit the referral reward
            referral_reward = referring_user.reward_per_referral
            referring_user.referral_income += referral_reward
            referring_user.save()

            # Mark the user as having received the referral reward
            instance.user.has_received_referral_reward = True
            instance.user.save()

            # Optionally log or notify
            print(f"Referral reward of {referral_reward} credited to {referring_user.first_name}.")