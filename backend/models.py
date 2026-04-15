from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, Permission, PermissionsMixin
from django.utils.crypto import get_random_string
import uuid
from django.conf import settings
# Create your models here.

class MyUserManager(BaseUserManager):
    def create_user(self,email, first_name, last_name, password=None):
        if not email:
            raise ValueError('User must have an email address')

        if not first_name:
            raise ValueError('User must enter first name')
        
        if not last_name:
            raise ValueError('User must enter last name')

        user = self.model(
            email = self.normalize_email(email),
            first_name = first_name,
            last_name=last_name,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, first_name, last_name, email,password):
        user = self.create_user(
            email = self.normalize_email(email),
            first_name = first_name,
            last_name=last_name,
            password=password,
        )

        permission = Permission.objects.all()

        user.is_admin = True
        user.is_active = True
        user.is_staff = True
        user.is_superadmin = True
        user.user_permissions.set(permission)
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    first_name        = models.CharField(max_length=100, blank=True, null=True)
    last_name         = models.CharField(max_length=100, blank=True, null=True)
    email             = models.EmailField(max_length=100, unique=True)
    referrals         = models.ManyToManyField('self', symmetrical=False, related_name='referred_users')
    referral_code     = models.UUIDField(default=uuid.uuid4, unique=True)
    referred_by       = models.ForeignKey( settings.AUTH_USER_MODEL,  null=True, blank=True, on_delete=models.SET_NULL, related_name='referral')
    reward_per_referral = models.DecimalField(max_digits=5, decimal_places=2, default=50.00)
    referral_income   = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    balance           = models.IntegerField(default=0)
    mobile_number     = models.CharField(max_length=20, blank=True, null=True)
    total_turnover    = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    required_turnover = models.DecimalField(max_digits=20, decimal_places=2, default=0)

       
    date_joined   = models.DateTimeField(auto_now_add=True) 
    last_login    = models.DateTimeField(auto_now_add=True)   
    is_admin      = models.BooleanField(default=False)
    is_staff      = models.BooleanField(default=False)
    is_active     = models.BooleanField(default=False)
    is_superadmin = models.BooleanField(default=False)
    has_received_referral_reward = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name','last_name']

    objects = MyUserManager()


    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    def save(self, *args, **kwargs):
        self.referal = get_random_string(length=5)
        super().save(*args, **kwargs)

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, add_label):
        return True
    
    def claim_referral_income(self):
    
        if self.referral_income > 0:
            self.balance += self.referral_income

            self.referral_income = 0
            self.save()


            return True  # Successfully claimed
        return False  # No income to claim
    

class Banner(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, help_text="Title of the banner")
    description = models.TextField(blank=True, null=True, help_text="Optional description for the banner")
    image = models.ImageField(upload_to='banners/', help_text="Upload a banner image")
    link = models.URLField(blank=True, null=True, help_text="Optional link for the banner")
    is_active = models.BooleanField(default=True, help_text="Uncheck to hide this banner")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Banner"
        verbose_name_plural = "Banners"

    def __str__(self):
        return self.title