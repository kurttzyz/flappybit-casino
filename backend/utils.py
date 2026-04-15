from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth.views import PasswordResetView
import six



class passwordgenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (six.text_type(user.pk) + six.text_type(timestamp) +  six.text_type(user.is_active))
TokenGenerator = passwordgenerator()


class PasswordReset(PasswordResetView):
    from_email= 'Flappybit <support@flappybit.com>'
    html_email_template_name = 'email/password_reset_email.html'
    subject_template_name = 'email/password_reset_subject.txt'
