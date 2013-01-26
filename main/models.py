from django.db import models
from django.contrib.auth import models as auth
from django.utils import timezone


class Follows(models.Model):
    """User and fallowed user relations models"""
    user = models.ForeignKey(auth.User, related_name='fallows_user')
    followee = models.ForeignKey(auth.User, related_name='fallows_fallowee')
    class Meta:
        db_table = u'Follows'

    def __unicode__(self):
        return "%s -> %s" % (self.user, self.followee)


class Ribbits(models.Model):
    """Sort messages by user"""
    user = models.ForeignKey(auth.User)
    ribbit = models.CharField(max_length=420, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = u'Ribbits'

    @property
    def published_hours_ago(self):
        """Calculate how many hours posted current message"""
        delta = timezone.now() - self.created_at
        return (delta.days * 24) + (delta.seconds / (60*60))

    def __unicode__(self):
        return self.ribbit


class UserProfile(models.Model):
    """django User model extension"""
    user = models.OneToOneField(auth.User)
    self_description = models.CharField(max_length=512, blank=True)
    gravatar_hash = models.CharField(max_length=96, blank=True)
