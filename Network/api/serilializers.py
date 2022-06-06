from imp import source_from_cache
from rest_framework import serializers
from .models import Post, siteUser, Follow, Like, Comment
from django.contrib.auth.models import User

class FollowSerializer(serializers.ModelSerializer):
    follower = serializers.CharField(source="follower.user.username")
    follower_image = serializers.CharField(source="follower.image")
    follower_bio = serializers.CharField(source="follower.bio")
    follower_id = serializers.IntegerField(source="follower.user.id")
    followee = serializers.CharField(source="followee.user.username")
    followee_image = serializers.CharField(source="followee.image")
    followee_bio = serializers.CharField(source="followee.bio")
    followee_id = serializers.IntegerField(source="followee.user.id")

    class Meta:
        model = Follow
        fields = "__all__"

class LikeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Like
        fields = "__all__"

class CommentSerializer(serializers.ModelSerializer):
    commenter_username = serializers.CharField(source="poster.user.username")
    commenter_image = serializers.CharField(source="poster.image")
    
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