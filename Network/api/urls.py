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
    path("post-list/", views.postList, name="post-list"),
    path("post-single/<str:pk>/", views.postSingle, name="post-single"),
    path("post-following/<str:pk>/", views.postFollowing, name="post-following"),
    path("post-create/", views.postCreate, name="post-create"),
    path("post-update/<str:pk>/", views.postUpdate, name="post-update"),
    path("post-delete/<str:pk>/", views.postDelete, name="post-delete"),
    path("followed-list/<str:pk>/", views.followFollowedBy, name="followed-list"),
    path("following-list/<str:pk>/", views.followFollowing, name="following-list"),
    path("follow-follow/", views.followFollow, name="follow-follow"),
    path("follow-unfollow/", views.followUnfollow, name="follow-unfollow")
]