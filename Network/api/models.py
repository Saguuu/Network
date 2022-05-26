from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class siteUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="site_user")
    image = models.URLField(default="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg")
    bio = models.TextField(default="")

    def __str__(self):
        return f"{self.user}"

class Post(models.Model):
    poster = models.ForeignKey(siteUser, on_delete=models.CASCADE, related_name="user_posts")
    content = models.CharField(max_length=100, default="")
    date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.poster.user.username}'s post {self.id}"

class Follow(models.Model):
    follower = models.ForeignKey(siteUser, on_delete=models.CASCADE, related_name="user_follows")
    followee = models.ForeignKey(siteUser, on_delete=models.CASCADE, related_name="user_followed")
    date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.follower} follows {self.followee}"

class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_likes")
    liker = models.ForeignKey(siteUser, on_delete=models.CASCADE, related_name="user_likes")
    date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.liker} liked {self.post}"

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_comments")
    poster = models.ForeignKey(siteUser, on_delete=models.CASCADE, related_name="user_comments")
    content = models.CharField(max_length=100, default="")
    date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.poster} commented on {self.post}"