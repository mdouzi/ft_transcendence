from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser

from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(max_length=254, unique=True)
    photo = models.CharField(
        blank=True,
        null=True,
        default="https://cdn-images-3.listennotes.com/podcasts/two-dead-pines/lsd-trip-report-Qe0E3pjyGlg-USIahZq6KYe.1400x1400.jpg"
    , max_length=2000)
    is_2fa_enabled = models.BooleanField(default=False) 
    otp_code = models.CharField(max_length=6, blank=True, null=True) 
    otp_created_at = models.DateTimeField(blank=True, null=True)
    


