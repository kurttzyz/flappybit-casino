from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Deposit, Withdrawal, TransactionHistory, User



@receiver(post_save, sender=Deposit)
def createDepositHistory(instance, created, sender, **kwargs):
    if created:
        TransactionHistory.objects.create(user= instance.user, amount= instance.amount, status = instance.status, action='Deposit', date_created = instance.date_created, reference_number=instance.reference_number)

@receiver(post_save, sender=Withdrawal)
def createWithdrawalHistory(instance, created, sender, **kwargs):
    if created:
        TransactionHistory.objects.create(user= instance.user, amount= instance.amount, status = instance.status, action='Withdrawal', date_created = instance.date_created, reference_number=instance.reference_number)


@receiver(post_save, sender=Deposit)
def UpdateDepositHistorySave(sender, instance, created, **kwargs):
    if created == False:
        history  = TransactionHistory.objects.filter(reference_number=instance.reference_number).update(status = instance.status)

@receiver(post_save, sender=Withdrawal)
def UpdateWithdrawHistorySave(sender, instance, created, **kwargs):
    if created == False:
        history  = TransactionHistory.objects.filter(reference_number=instance.reference_number).update(status = instance.status)