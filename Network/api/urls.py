from django.urls import path
from . import views
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("", views.apiOverview, name="api-overview"),
    path("user-list/", views.userList, name="user-list"),
    path("user-register/", views.userRegister, name="user-register"),
    path("user-single/<str:pk>/", views.userSingle, name="user-single"),
    path("user-likes/<str:pk>/", views.userLikes, name="user-likes"),
    path("post-list/", views.postList, name="post-list"),
    path("post-single/<str:pk>/", views.postSingle, name="post-single"),
    path("post-following/<str:pk>/", views.postFollowing, name="post-following"),
    path("post-create/", views.postCreate, name="post-create"),
    path("post-update/<str:pk>/", views.postUpdate, name="post-update"),
    path("post-delete/<str:pk>/", views.postDelete, name="post-delete"),
    path("followed-list/<str:pk>/", views.followFollowedBy, name="followed-list"),
    path("following-list/<str:pk>/", views.followFollowing, name="following-list"),
    path("follow-follow/", views.followFollow, name="follow-follow"),
    path("follow-unfollow/", views.followUnfollow, name="follow-unfollow"),
    path("like-like/", views.likeLike, name="like-like"),
    path("like-unlike/", views.likeUnlike, name="like-unlike"),
    path("comment-comment/", views.commentComment, name="comment-comment"),
    path("comment-uncomment/<str:pk>/", views.commentUncomment, name="comment-uncomment"),
    path("comment-last/<str:pk>/", views.commentGetLastComment, name="comment-last"),
    path("edit-profile/", views.editProfile, name="edit-profile"),
]