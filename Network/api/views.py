from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serilializers import PostSerializer, FollowSerializer, UserSerializer, siteUserSerializer, LikeSerializer, CommentSerializer
from .models import Post, Follow, siteUser, Like, Comment
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
        "Single User": "/user-single/",
        "User Likes": "/user-likes/<str:pk>",
        "Followed By": "/followed-list/<str:pk>/",
        "Following": "/following-list/<str:pk>/",
        "Posts By Following": "/post-following/<str:pk>/",
        "Single Post": "/post-single/<str:pk>/",
        "Create Post": "/post-create/",
        "Update Post": "/post-update/<str:pk>/",
        "Delete Post": "/post-delete/<str:pk>/",
        "Follow User": "/follow-follow/",
        "Unfollow User": "/follow-unfollow/",
        "Like post": "/like-like/",
        "Unlike post": "/like-unlike/",
        "Comment On Post": "/comment-comment/",
        "Uncomment On Post": "/comment-uncomment/",
        "Get Last User Comment": "/comment-last/<str:pk>/",
        "Edit Profile": "/edit-profile"
    }

    return Response(api_urls)  

@api_view(["GET"])
def userList(request):

    users = siteUser.objects.all()
    serializer = siteUserSerializer(users, many=True)

    return Response(serializer.data)

@api_view(["GET"])
def userSingle(request, pk):

    user = siteUser.objects.get(id=pk)
    serializer = siteUserSerializer(user, many=False)

    return Response(serializer.data)

@api_view(["GET"])
def userLikes(request, pk):

    response = []
    likes = Like.objects.all().filter(liker=pk).order_by("-id")

    for i in likes:
        response.append(Post.objects.get(id=i.post.id))

    serializer = PostSerializer(response, many=True)

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
@permission_classes([IsAuthenticated])
def postCreate(request):

    if len(request.data["content"]) <= 100 and len(request.data["content"]) > 0:
        new_post = Post(poster=request.user.site_user, content=request.data["content"])
        new_post.save()

    return Response("Post sent!")

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
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
def followFollow(request):

    follower = siteUser.objects.get(id=request.data["follower"])
    followee = siteUser.objects.get(id=request.data["followee"])

    if (Follow.objects.filter(follower=follower, followee=followee).exists()) or (follower == followee):
        return Response("failed")

    else : 
        new_follow = Follow(follower=follower, followee=followee)
        new_follow.save()
        return Response("User followed")

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def followUnfollow(request):
    
    unfollow = Follow.objects.all().filter(follower=request.data.get("follower"), followee=request.data.get("followee"))
    unfollow.delete()

    return Response("User Unfollowed")

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def likeLike(request):
    
    liker = siteUser.objects.get(id=request.data["liker"])
    post = Post.objects.get(id=request.data["post"])

    if (Like.objects.filter(liker=liker, post=post).exists()):
        return Response("failed")

    else : 
        new_like = Like(liker=liker, post=post)
        new_like.save()
        return Response("Post liked")

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def likeUnlike(request):
    
    unlike = Like.objects.all().filter(liker=request.data.get("liker"), post=Post.objects.get(id=request.data["post"]))
    unlike.delete()

    return Response("Post unliked")

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def commentComment(request):
    
    commenter = siteUser.objects.get(id=request.data["commenter"])
    post = Post.objects.get(id=request.data["post"])
    content = request.data["content"]

    new_comment = Comment(poster=commenter, post=post, content=content)
    new_comment.save()
    return Response("Post liked")

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def commentUncomment(request):
    
    un_comment = Comment.objects.get(id=request.data["id"])
    un_comment.delete()

    return Response("Post unliked")

@api_view(["GET"])
def commentGetLastComment(request, pk):
    
    last_comment = Comment.objects.all().filter(poster=pk).last()

    serializer = CommentSerializer(last_comment, many=False)

    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def editProfile(request):
    
    user = siteUser.objects.get(id=request.data["id"])
    new_bio = request.data["bio"].strip()
    new_image = request.data["image"].strip()

    if (len(new_bio) < 255):
        user.bio = new_bio
        user.image = new_image
        user.save()

    serializer = siteUserSerializer(user, many=False)
    
    return Response(serializer.data)
