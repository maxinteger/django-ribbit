from django.db import models
from django.contrib.auth import models as auth

class Follows(models.Model):
    user = models.ForeignKey(auth.User, related_name='fallows_user')
    followee = models.ForeignKey(auth.User, related_name='fallows_fallowee')
    class Meta:
        db_table = u'Follows'

class Ribbits(models.Model):
    user = models.ForeignKey(auth.User)
    ribbit = models.CharField(max_length=420, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        db_table = u'Ribbits'

class UserProfile(models.Model):
    user = models.ForeignKey(auth.User)
    gravatar_hash = models.CharField(max_length=96, blank=True)
