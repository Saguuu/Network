from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serilializers import PostSerializer, FollowSerializer, UserSerializer, siteUserSerializer
from .models import Post, Follow, siteUser
from django.contrib.auth.models import User

# Create your views here.

@api_view(["GET"])
def apiOverview(request):

    api_urls = {
        "Post": "/post-list/",
        "User": "/user-list/",
        "Followed": "/followed-list/<str:pk>/",
        "Following": "/following-list/<str:pk>/",
        "Single Post": "/post-single/<str:pk>/",
        "Create Post": "/post-create/",
        "Update Post": "/post-update/<str:pk>/",
        "Delete Post": "/post-delete/<str:pk>/",
        "Follow User": "/follow-user/",
        "Unfollow User": "/unfollow-user/"
    }

    return Response(api_urls)

@api_view(["GET"])
def userList(request):

    users = siteUser.objects.all()
    serializer = siteUserSerializer(users, many=True)

    return Response(serializer.data)

@api_view(["GET"])
def postList(request):

    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)

    return Response(serializer.data)

@api_view(["GET"])
def postSingle(request, pk):

    post = Post.objects.get(id=pk)
    serializer = PostSerializer(post, many=False)

    return Response(serializer.data)

@api_view(["POST"])
def postCreate(request):

    serializer = PostSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(["POST"])
def postUpdate(request, pk):
    
    post = Post.objects.get(id=pk)
    serializer = PostSerializer(instance=post, data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(["DELETE"])
def postDelete(request, pk):
    
    post = Post.objects.get(id=pk)
    post.delete()

    return Response("Post Deleted")

@api_view(["GET"])
def followFollowedBy(request, pk):

    following = Follow.objects.all().filter(followee=pk)
    serializer = FollowSerializer(following, many=True)

    return Response(serializer.data)

@api_view(["GET"])
def followFollowing(request, pk):

    following = Follow.objects.all().filter(follower=pk)
    serializer = FollowSerializer(following, many=True)

    return Response(serializer.data)

@api_view(["POST"])
def followFollow(request):

    serializer = FollowSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(["POST"])
def followUnfollow(request):
    
    unfollow = Follow.objects.all().filter(follower=request.data.get("follower"), followee=request.data.get("followee"))
    unfollow.delete()

    return Response("User Unfollowed")