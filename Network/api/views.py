from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.

@api_view(["GET"])
def apiOverview(request):
    api_urls = {
        "Post": "/post/",
        "User": "/user/",
        "Single Post": "/post/<str:pk>/",
        "Create Post": "/post-create/",
        "Update Post": "/post-update/<str:pk>/",
        "Delete Post": "/post-delete/<str:pk>/",
        "Follow User": "/follow-user/<str:pk>/",
        "Unfollow User": "/unfollow-user/<str:pk>/"
    }
    return Response(api_urls)