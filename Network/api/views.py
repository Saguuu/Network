from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serilializers import PostSerializer, FollowSerializer, UserSerializer, siteUserSerializer
from .models import Post, Follow, siteUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# Create your views here.

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['image'] = user.site_user.image
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(["GET"])
def apiOverview(request):

    api_urls = {
        "Token": "/token/",
        "Token Refresh": "/token/refresh/",
        "Post": "/post-list/",
        "User": "/user-list/",
        "Followed By": "/followed-list/<str:pk>/",
        "Following": "/following-list/<str:pk>/",
        "Posts By Following": "/post-following/<str:pk>",
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

    return Response(sorted(serializer.data, key=lambda d: d["id"], reverse=True))

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
def postFollowing(request, pk):
    
    # Query database for followed users, serialize data and convert to one dimensional list, then reverse sort by time created
    response1 = []
    following = Follow.objects.all().filter(follower=pk)

    for i in following:
        response1.append(PostSerializer(Post.objects.all().filter(poster=i.followee), many=True).data)

    response2 = []

    for i in response1:
        for j in i:
            response2.append(j)
    
    response3 = sorted(response2, key=lambda d: d["id"], reverse=True)
    
    return Response(response3)

@api_view(["GET"])
def followFollowedBy(request, pk):

    following = Follow.objects.all().filter(followee=pk)
    serializer = FollowSerializer(following, many=True)

    return Response(sorted(serializer.data, key=lambda d: d["id"], reverse=True))

@api_view(["GET"])
def followFollowing(request, pk):

    following = Follow.objects.all().filter(follower=pk)
    serializer = FollowSerializer(following, many=True)

    return Response(sorted(serializer.data, key=lambda d: d["id"], reverse=True))

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