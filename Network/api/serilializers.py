from rest_framework import serializers
from .models import Post, siteUser, Follow
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = "__all__"

class siteUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = siteUser
        fields = "__all__"