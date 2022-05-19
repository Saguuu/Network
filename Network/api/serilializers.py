from rest_framework import serializers
from .models import Post, siteUser, Follow
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = "__all__"

class PostSerializer(serializers.ModelSerializer):
    poster = serializers.CharField(source="poster.user.username")
    poster_image = serializers.CharField(source="poster.image")
    
    class Meta:
        model = Post
        fields = "__all__"

class FollowSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="followee.user.username")
    image = serializers.CharField(source="followee.image")
    follower = serializers.CharField(source="follower.user.username")
    followee = serializers.CharField(source="followee.user.username")

    class Meta:
        model = Follow
        fields = "__all__"

class siteUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")
    authenticated = serializers.BooleanField(source="user.is_authenticated")

    class Meta:
        model = siteUser
        fields = "__all__"