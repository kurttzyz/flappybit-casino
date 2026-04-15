from django.db import models
from backend.models import User
from django.utils.crypto import get_random_string
from django.utils import timezone
from decimal import Decimal
from games.models import *
# Create your models here.


class PaymentMethod(models.Model):
    name = models.CharField(max_length=200)
    account = models.CharField(max_length=100)
    account_name = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.name

class Deposit(models.Model):

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Declined', 'Declined'),
    ]

    PROMO_CHOICES = [
        ('Promo', 'Promo'),
        ('Regular', 'Regular'),
    ]

    user             = models.ForeignKey(User, on_delete=models.CASCADE)
    amount           = models.DecimalField(max_digits=10, decimal_places=2)
    reference_number = models.CharField(max_length=50, default=get_random_string(length=20))
    status           = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    promo            = models.CharField(max_length=20, choices=PROMO_CHOICES)
    payment_method   = models.ForeignKey(PaymentMethod, on_delete=models.DO_NOTHING)
    date_created     = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"User: {self.user.email}  Reference: {self.reference_number}"
    

class Withdrawal(models.Model):

    PAYMENT_METHOD_CHOICES = [
        ('Maya', 'Maya'),
        ('GCash', 'GCash'),
    ]

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]
    
    user           = models.ForeignKey(User, on_delete=models.CASCADE)
    amount         = models.DecimalField(max_digits=10, decimal_places=2)
    reference_number = models.CharField(max_length=50, default=get_random_string(length=20))
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES)
    phone_number   = models.CharField(max_length=15)
    status         = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')  # Default status
    date_created    = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"User: {self.user.email} Amount: {self.amount} "

class TransactionHistory(models.Model):

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    option = (
        ("Deposit", "Deposit"),
        ("Withdrawal", "Withdrawal"),
    )

    user =  models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reference_number = models.CharField(max_length=50, blank=True, null=True, unique=False)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, blank=True, null=True)
    action = models.CharField(max_length=50, choices=option)
    date_created = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name_plural = 'Transaction Histories'

    def __str__(self):
        return f"Reference: {self.reference_number} Status: {self.status}"
    







   
