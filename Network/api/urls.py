from django.urls import path
from . import views

urlpatterns = [
    path("", views.apiOverview, name="api-overview"),
    path("user-list/", views.userList, name="user-list"),
    path("post-list/", views.postList, name="post-list"),
    path("post-single/<str:pk>/", views.postSingle, name="post-single"),
    path("post-create/", views.postCreate, name="post-create"),
    path("post-update/<str:pk>/", views.postUpdate, name="post-update"),
    path("post-delete/<str:pk>/", views.postDelete, name="post-delete"),
    path("followed-list/<str:pk>/", views.followFollowedBy, name="followed-list"),
    path("following-list/<str:pk>/", views.followFollowing, name="following-list"),
    path("follow-follow/", views.followFollow, name="follow-follow"),
    path("follow-unfollow/", views.followUnfollow, name="follow-unfollow")
]