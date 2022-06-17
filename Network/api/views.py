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
        token['id'] = user.site_user.id
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
        "Register User": "/user-register/",
        "Single User": "/user-single/",
        "User Likes": "/user-likes/<str:pk>/",
        "User posts": "/user-posts/<str:pk>/",
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
        "Uncomment On Post": "/comment-uncomment/<str:pk>/",
        "Get Last User Comment": "/comment-last/<str:pk>/",
        "Edit Profile": "/edit-profile/"
    }

    return Response(api_urls)  

@api_view(["POST"])
def userRegister(request):
    
    username = request.data["username"]
    pass1 = request.data["password1"]
    pass2 = request.data["password2"]

    exists = User.objects.filter(username__icontains=username).exists()

    if exists or (pass1 != pass2):
        return Response("User with that name already exists or passwords do not match", status=202)
    
    new_user = User.objects.create_user(username=username, password=pass1)
    new_site_user = siteUser(user=new_user)
    new_site_user.save()
    serializer = siteUserSerializer(new_site_user)

    return Response(serializer.data)

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
def userPosts(request, pk):

    posts = Post.objects.all().filter(poster=pk).order_by("-id")
    serializer = PostSerializer(posts, many=True)

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
@permission_classes([IsAuthenticated])
def postUpdate(request, pk):
    
    if request.user.is_anonymous:
        return Response("Rejected")
    else:
        post = Post.objects.get(id=pk)
        if post:
            if request.user.site_user.id == post.poster.id:
                post.content = request.data["content"].strip()
                post.save()
        else:
            return("Post does not exist")

    return Response("Post Updated")

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def postDelete(request, pk):
    
    if request.user.is_anonymous:
        return Response("Rejected")
    else:
        post = Post.objects.get(id=pk)
        if post:
            if request.user.site_user.id == post.poster.id:
                post.delete()
        else:
            return("Post does not exist")

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

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def commentUncomment(request, pk):
    
    if request.user.is_anonymous:
        return Response("Rejected")
    else:
        comment = Comment.objects.get(id=pk)
        if comment:
            if request.user.site_user.id == comment.poster.id:
                comment.delete()
        else:
            return Response("Comment does not exist")

    return Response("Comment Deleted")

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def commentUpdate(request, pk):
    
    if request.user.is_anonymous:
        return Response("Rejected")
    else:
        comment = Comment.objects.get(id=pk)
        if comment:
            if request.user.site_user.id == comment.poster.id:
                comment.content = request.data["content"].strip()
                comment.save()
        else:
            return Response("Comment does not exist")

    return Response("Comment Updated")

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
