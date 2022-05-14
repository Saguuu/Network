from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class siteUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

class Post(models.Model):
    poster = models.ForeignKey(siteUser, on_delete=models.CASCADE, related_name="user_posts")
    content = models.CharField(max_length=100, default="")
    likes = models.IntegerField()
    date = models.DateTimeField(auto_now=True)

class Follow(models.Model):
    follower = models.ForeignKey(siteUser, on_delete=models.CASCADE, related_name="user_follows")
    followee = models.ForeignKey(siteUser, on_delete=models.CASCADE, related_name="user_followed")
    date = models.DateTimeField(auto_now=True)
