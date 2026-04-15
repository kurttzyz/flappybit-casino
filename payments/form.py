from django import forms
from .models import Deposit, Withdrawal

class PaymentForm(forms.ModelForm):
    class Meta:
        model = Deposit
        fields = ['amount', 'payment_method', 'promo']
        widgets = {
            'amount': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Enter amount'}),
            'payment_method': forms.Select(attrs={'class': 'form-control', 'placeholder' : 'Choose your payment method'}),
            'promo': forms.Select(attrs={'class': 'form-control', 'placeholder': 'Choose your type of deposit method'}),
        }
        labels = {
            'amount': 'Payment Amount',
            'payment_method': 'Payment Method',
            'promo' : 'Promo'
        }

    def clean_amount(self):
        amount = self.cleaned_data.get('amount')
        if amount <= 0:
            raise forms.ValidationError("Amount must be greater than zero.")
        return amount
    

class WithdrawalForm(forms.ModelForm):
    class Meta:
        model = Withdrawal
        fields = ['amount', 'payment_method', 'phone_number']
        widgets = {
            'amount': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Enter amount'}),
            'phone_number': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter Phone number'}),
            'payment_method': forms.Select(attrs={'class': 'form-control'}),
        }
        labels = {
            'amount': 'Payment Amount',
            'payment_method': 'Payment Method',
            'phone_number': 'Phone Number',
        }

    def clean_amount(self):
        amount = self.cleaned_data.get('amount')
        if amount <= 0:
            raise forms.ValidationError("Amount must be greater than zero.")
        return amount
    
