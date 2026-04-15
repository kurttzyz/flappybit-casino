from django.db import models
from backend.models import User
<<<<<<< HEAD
from django.utils import timezone
=======
from django.utils import timezone
<<<<<<< HEAD
from django.core.exceptions import ValidationError
from django.db import transaction
import random
=======

>>>>>>> 6b2e3bd1e212ea7a3d823cbdd13bc045dadcc523

class Minislot(models.Model):

    status = (
        ('WON', 'WON'),
        ('LOSS', 'LOSS'),
        ('PENDING', 'PENDING')
    )

<<<<<<< HEAD
    MULTIPLIERS = {
    'FULL_MATCH': 8.0,  # All three results are the same
    'TWO_MATCH': 4.0,   # Two results match
    'NO_MATCH': 0.0     # No results match
    }

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    result1 = models.CharField(max_length=244)
    result2 = models.CharField(max_length=244)
    result3 = models.CharField(max_length=244)
=======
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    result1 = models.CharField(max_length=20)
    result2 = models.CharField(max_length=20)
    result3 = models.CharField(max_length=20)
>>>>>>> 6b2e3bd1e212ea7a3d823cbdd13bc045dadcc523
    stake = models.IntegerField(default=0)
    amount = models.IntegerField(default=0)
    status =  models.CharField(max_length=30, choices=status, default='PENDING')
    date_created = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"User: {self.user.email} ------ Result Sequence: {self.result1}-{self.result2}-{self.result3} ----- Amount: {self.amount}"
<<<<<<< HEAD
     

    def save(self, *args, **kwargs):
        # Ensure stake is an integer
        try:
            self.stake = int(self.stake)
        except ValueError:
            raise ValidationError("Stake must be an integer.")

        # Ensure user's balance is an integer
        try:
            self.user.balance = int(self.user.balance)  # Assuming balance is stored as an integer
        except ValueError:
            raise ValidationError("User's balance must be an integer.")

        # Check if the user's balance is sufficient for the stake
        if self.user.balance < self.stake:
            raise ValidationError("Insufficient balance to place the stake.")

        # Deduct the stake amount from the user's balance at the start of the game
        self.user.balance -= self.stake



        # Game logic
        if self.result1 == self.result2 == self.result3:
            self.amount = self.stake * self.__class__.MULTIPLIERS['FULL_MATCH']
            self.status = 'WON'
        elif self.result1 == self.result2 or self.result2 == self.result3 or self.result1 == self.result3:
            self.amount = self.stake * self.__class__.MULTIPLIERS['TWO_MATCH']
            self.status = 'WON'
        else:
            self.amount = 0
            self.status = 'LOSS'
            self.user.total_turnover += self.stake

        # Update user balance only if the game is WON
        if self.status == 'WON':
            self.user.total_turnover += self.stake
            self.user.balance += int(self.amount)
            self.user.save()

        # Call the parent class's save method
        super().save(*args, **kwargs)

     

class HeadorTail(models.Model):
    VALUE_CHOICES = (
        ('HEAD', 'HEAD'),
        ('TAIL', 'TAIL'),
    )

    STATUS_CHOICES = (
=======
    
    def save(self, *args, **kwargs):
        if self.result1 == self.result2 and self.result3:
            self.amount = self.stake * 5
            self.user.balance += int(self.amount)
            self.user.save()
            self.status = 'WON'
        elif self.result1 == self.result2 or self.result2 == self.result3:
            self.amount = self.stake * 2
            self.user.balance += int(self.amount)
            self.user.save()
            self.status = 'WON'
        else:
            self.status = 'LOSS'

        super().save(*args, **kwargs)


class HeadorTail(models.Model):
    value = (
        ('HEAD', 'HEAD'),
        ('TAIL', 'TAIL')
    )

    opt = (
>>>>>>> 6b2e3bd1e212ea7a3d823cbdd13bc045dadcc523
        ('PENDING', 'PENDING'),
        ('LOSS', 'LOSS'),
        ('WON', 'WON'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stake = models.IntegerField(default=0)
<<<<<<< HEAD
    winnings = models.IntegerField(default=0)
    option = models.CharField(max_length=50, choices=VALUE_CHOICES, blank=True, null=True)
    outcome = models.CharField(max_length=50, choices=VALUE_CHOICES, blank=True, null=True)
    amount = models.IntegerField(default=0)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='PENDING')
    date_created = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"User: {self.user.email} | Outcome: {self.outcome} | Winnings: {self.winnings}"
    
   

    def save(self, *args, **kwargs):
    
        super().save(*args, **kwargs)  # Save the game instance with outcome and amount

        user = self.user
        user.total_turnover += self.stake  # Add the stake amount to the user's turnover
        user.save()
=======
    amount = models.IntegerField(default=0)
    option = models.CharField(max_length=50, choices=value, blank=True, null=True)
    outcome = models.CharField(max_length=50, choices=value, blank=True, null=True)
    status = models.CharField(max_length=50, choices=opt, default='PENDING')
    date_created = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"User: {self.user.email}------ Outcome: {self.outcome}-------- Winnings: {self.amount}"
    
    def save(self, *args, **kwargs):

        if self.option == self.outcome:
            self.amount = self.stake * 2
            self.user.balance += int(self.amount)
            self.user.save()
            self.status = 'WON'
        else:
            self.status = 'LOSS'
        super().save(*args, **kwargs)


>>>>>>> 6b2e3bd1e212ea7a3d823cbdd13bc045dadcc523

class BottleSpin(models.Model):
    value = (
        ('UP', 'UP'),
        ('DOWN', 'DOWN')
    )

    opt = (
        ('PENDING', 'PENDING'),
        ('LOSS', 'LOSS'),
        ('WON', 'WON'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stake = models.IntegerField(default=0)
    amount = models.IntegerField(default=0)
    option = models.CharField(max_length=50, choices=value, blank=True, null=True)
    outcome = models.CharField(max_length=50, choices=value, blank=True, null=True)
    status = models.CharField(max_length=50, choices=opt, default='PENDING')
    date_created = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"User: {self.user.email}------ Outcome: {self.outcome}-------- Winnings: {self.amount}"
    
<<<<<<< HEAD
    

    def save(self, *args, **kwargs):
        # If the option matches the outcome, the user wins
        if self.option == self.outcome:
            self.amount = self.stake * 2  # Winnings = 2x stake
            self.user.balance += self.amount  # Add winnings to user balance
            self.status = 'WON'
        else:
            self.amount = 0  # No winnings in case of a loss
            self.user.balance -= self.stake  # Deduct the stake from user balance
            self.status = 'LOSS'

        # Save the updated user balance
        self.user.save()
        super().save(*args, **kwargs)

        user = self.user
        user.total_turnover += self.stake  # Add the stake amount to the user's turnover
        user.save()

=======
    def save(self, *args, **kwargs):

        if self.option == self.outcome:
            self.amount = self.stake * 2
            self.user.balance += int(self.amount)
            self.user.save()
            self.status = 'WON'
        else:
            self.status = 'LOSS'
        super().save(*args, **kwargs)

>>>>>>> 6b2e3bd1e212ea7a3d823cbdd13bc045dadcc523


class RockPapperSissors(models.Model):
    value = (
        ('ROCK', 'ROCK'),
        ('PAPER', 'PAPER'),
        ('SISSORS', 'SISSORS')
    )

    opt = (
        ('PENDING', 'PENDING'),
        ('LOSS', 'LOSS'),
        ('WON', 'WON'),
        ('DRAW', 'DRAW'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stake = models.IntegerField(default=0)
    amount = models.IntegerField(default=0)
    option = models.CharField(max_length=50, choices=value, blank=True, null=True)
    outcome = models.CharField(max_length=50, choices=value, blank=True, null=True)
    status = models.CharField(max_length=50, choices=opt, default='PENDING')
    date_created = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"User: {self.user.email}------ Outcome: {self.outcome}-------- Winnings: {self.amount}"
    
<<<<<<< HEAD

    
    def save(self, *args, **kwargs):
        # Determine the outcome
        if (self.option == 'ROCK' and self.outcome == 'SCISSORS') or \
        (self.option == 'SCISSORS' and self.outcome == 'PAPER') or \
        (self.option == 'PAPER' and self.outcome == 'ROCK'):
            self.amount = self.stake * 2  # Calculate winnings
            self.user.balance += int(self.amount)  # Add winnings to user balance
            self.status = 'WON'
        elif self.option == self.outcome:  # Check for a draw
            self.status = 'DRAW'
            self.amount = self.stake  # Return stake for a draw (optional)
            # No change to user balance for a draw
        else:  # Loss condition
            self.amount = 0  # No winnings
            self.user.balance -= self.stake  # Deduct stake
            self.status = 'LOSS'

        # Save the updated user balance and turnover
        self.user.total_turnover += self.stake  # Add the stake to user's turnover
        self.user.save()

        # Save the game instance
        super().save(*args, **kwargs)


class Game(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bet = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    claimed = models.BooleanField(default=False)
    multiplier = models.FloatField(default=1.0)
    claimed = models.BooleanField(default=False) 
    bomb_card = models.JSONField()
    active = models.BooleanField(default=True)
    completed_at = models.DateTimeField(null=True, blank=True)
=======
        

    
    def save(self, *args, **kwargs):

        if self.option == 'ROCK' and self.outcome == 'SISSORS' or self.option == 'SISSORS' and self.outcome == 'PAPER' or self.option == 'PAPER' and self.outcome == 'ROCK':
            self.amount = self.stake * 2
            self.user.balance += int(self.amount)
            self.user.save()
            self.status = 'WON'
        elif self.option == self.outcome:
            self.status = 'Draw'
            self.user.balance += self.stake
            self.user.save()
        else:
            self.status = 'LOSS'
        super().save(*args, **kwargs)

    
>>>>>>> 6b2e3bd1e212ea7a3d823cbdd13bc045dadcc523


>>>>>>> 8fd357047b463a75560c6f6c577a5981f80b24cf
