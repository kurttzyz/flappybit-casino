from dotenv import load_dotenv
from pathlib import Path
import os



# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv()
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-^*di^zou=_2!+bfne7r*!(658t2kh-pnb3jx@(93kom18cnd2p'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Added to the installed app
    'payments.apps.PaymentsConfig',
    'backend.apps.BackendConfig',
    'games.apps.GamesConfig',
    'storages',

]

AUTH_USER_MODEL = 'backend.User'

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',

    # static file whitenoise settings
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'casino.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',

                # external context_processors

                'backend.context_processors.Balance',
                'backend.context_processors.TotalDeposit',
                'backend.context_processors.TotalWithdrawal',

            ],
        },
    },
]

WSGI_APPLICATION = 'casino.wsgi.application'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}



# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'zenithpo_flappybit',
#         'USER': 'zenithpo_flappy_admin',
#         'PASSWORD': os.environ.get('DATABASE_PASSWORD'),
#         'HOST': 'server5.lytehosting.com',  # Or IP address
#         'PORT': '3306',       # Default MySQL port
#     }
# }



# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/


# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'



# For static file config





LOGIN_REDIRECT_URL = ('/')
LOGOUT_REDIRECT_URL = ('/')
SESSION_EXPIRE_AT_BROWSER_CLOSE = True

# Email settings

# EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
# EMAIL_HOST='smtp.zoho.com'
# EMAIL_PORT =587
# EMAIL_HOST_USER='Flappybit <support@flappybit.com>'
# EMAIL_HOST_PASSWORD=os.environ.get('EMAIL_PASSWORD')
# EMAIL_USE_TLS =True
# DEFAULT_FROM_EMAIL = 'TestMail <info.testmail@zohomail.com>'


# s3 bucket settings and config

# AWS_ACCESS_KEY_ID=os.environ.get('AWS_ACCESS_KEY_ID')
# AWS_SECRET_ACCESS_KEY=os.environ.get('AWS_SECRET_ACCESS_KEY')
# AWS_STORAGE_BUCKET_NAME = 'flappybet'
# DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
# STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
# AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
# AWS_S3_REGION_NAME = 'eu-west-1' 



MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = '/media/'
STATIC_ROOT = BASE_DIR / "staticfiles"  # Important: This is where collectstatic puts files

# STORAGES = {
#     "staticfiles": {
#         "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
#     },
# }
# static config for local server
STATIC_URL = '/static/'



# static config for production
# STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/'




