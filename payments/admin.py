from django.contrib import admin
from django.db import transaction
from decimal import Decimal  # Import Decimal
from django.contrib.auth.models import User  # or your custom User model
from .models import Deposit, Withdrawal, PaymentMethod, TransactionHistory


admin.site.register(PaymentMethod)

admin.site.register(TransactionHistory)



# Custom action to verify payments and update user wallets
@admin.action(description="Verify payments")
def verify_payments(modeladmin, request, queryset):
    for payment in queryset:
        if payment.status == 'Pending':
            print(f"Verifying payment with reference number: {payment.reference_number}")
            
            # Update payment status
            payment.status = 'Approved'
            payment.save()
            
            user = payment.user

            print(f"Old balance: {user.balance}")

            user.balance += payment.amount
            user.save()

            print(f"New balance: {user.balance}")


@admin.register(Deposit)
class PaymentAdmin(admin.ModelAdmin):
    # Include 'user' in the list display to show it in the admin panel
    list_display  = ('user', 'reference_number', 'promo', 'amount', 'payment_method', 'status', 'date_created')
    list_filter   = ('status', 'payment_method', 'date_created', 'user')  # Add user to the filter options
    list_editable = ('amount',)  # Make 'amount' editable from the list view
    search_fields = ('reference_number', 'payment_method', 'user__username')  # Enable search by user username
    ordering      = ('-date_created',)

    # Include 'user' in the form fields and readonly fields as needed
    fields          = ('user', 'amount', 'reference_number', 'status', 'payment_method','promo', 'date_created')
    readonly_fields = ('date_created',)

    # Define available actions
    actions         = [verify_payments]  # Add your custom actions here



@admin.register(Withdrawal)
class WithdrawalAdmin(admin.ModelAdmin):
    list_display  = ('user', 'amount', 'payment_method', 'phone_number', 'status', 'date_created')
    list_filter   = ('status', 'payment_method', 'date_created')
    search_fields = ('user__username', 'status')  # Include status for search
    actions       = ['approve_withdrawals', 'reject_withdrawals']


    def approve_withdrawals(self, request, queryset):
        # Filter pending withdrawals
        pending_withdrawals = queryset.filter(status='Pending')

        for withdrawal in pending_withdrawals:
            # Get user's balance
            try:
               user_wallet = withdrawal.user
            except AttributeError:
                self.message_user(request, f"Wallet not found for user {withdrawal.user.username}.", level='error')
                continue

            # Check if wallet balance is sufficient
            if hasattr(user_wallet, 'balance') and user_wallet.balance <= withdrawal.amount: 
                with transaction.atomic():
                    # Deduct amount from wallet
                    user_wallet.save()

                    # Update withdrawal status
                    withdrawal.status = 'Approved'
                    withdrawal.save()

                self.message_user(request, f"Withdrawal approved for user {withdrawal.user}.")
            else:
                self.message_user(request, f"Insufficient balance for user {withdrawal.user}.", level='error')

    approve_withdrawals.short_description = "Approve selected withdrawals"

    def reject_withdrawals(self, request, queryset):
        # Filter pending withdrawals
        pending_withdrawals = queryset.filter(status='Pending')

        # Update status to rejected
        updated = pending_withdrawals.update(status='Rejected')
        self.message_user(request, f"{updated} withdrawal marked as Rejected.")

    reject_withdrawals.short_description = "Reject selected withdrawals"




