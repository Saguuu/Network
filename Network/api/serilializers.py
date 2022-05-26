from rest_framework import serializers
from .models import Post, siteUser, Follow, Like, Comment
from django.contrib.auth.models import User

class FollowSerializer(serializers.ModelSerializer):
    image = serializers.CharField(source="followee.image")
    follower = serializers.CharField(source="follower.user.username")
    followee = serializers.CharField(source="followee.user.username")

    class Meta:
        model = Follow
        fields = "__all__"

class LikeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Like
        fields = "__all__"

class CommentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Comment
        fields = "__all__"

class PostSerializer(serializers.ModelSerializer):
    poster = serializers.CharField(source="poster.user.username")
    poster_id = serializers.IntegerField(source="poster.user.id")
    poster_image = serializers.CharField(source="poster.image")
    post_likes = LikeSerializer(many=True)
    post_comments = CommentSerializer(many=True)
    
    class Meta:
        model = Post
        fields = "__all__"

class siteUserSerializer(serializers.ModelSerializer):
    user_posts = PostSerializer(many=True)
    user_follows = FollowSerializer(many=True)
    user_followed = FollowSerializer(many=True)
    user_likes = LikeSerializer(many=True)
    user_comments = CommentSerializer(many=True)
    username = serializers.CharField(source="user.username")

    class Meta:
        model = siteUser
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):
    site_user = siteUserSerializer(many=True)
    
    class Meta:
        model = User
        fields = "__all__"