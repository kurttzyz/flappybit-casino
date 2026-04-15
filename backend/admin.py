from django.contrib import admin
from . models import *
from django.contrib.auth.admin import UserAdmin

admin.site.site_header = 'SecureOdd Administrator'
admin.site.site_title = 'SecureOdd Administrator'

class AccountAdmin(UserAdmin):
    list_display = ('first_name', 'last_name','email','last_login', 'date_joined', 'is_active')
    list_display_links = ('email', 'first_name', 'last_name',)
    readonly_fields = ('last_login', 'date_joined')
    ordering = ('-date_joined',)

    filter_horizontal = ()
    list_filter = ('email',)
    fieldsets = ()
admin.site.register( User, AccountAdmin)
admin.site.register(Banner)
