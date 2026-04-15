from django import forms
from .models import *
from django.contrib.auth.forms import UserCreationForm


class RegisterationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'mobile_number')
        widgets = {
            'first_name': forms.TextInput(attrs={'placeholder': 'Enter your firstname'}),
            'last_name': forms.TextInput(attrs={'placeholder': 'Enter your lastname'}),
            'email': forms.EmailInput(attrs={'placeholder': 'Enter your email'}),
            'mobile_number': forms.TextInput(attrs={'placeholder': 'Mobile number(+63)'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['password1'].widget.attrs.update({'placeholder': 'Enter your password'})
        self.fields['password2'].widget.attrs.update({'placeholder': 'Confirm your password'})