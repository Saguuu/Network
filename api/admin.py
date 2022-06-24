from django.contrib import admin
from .models import siteUser, Post, Follow, Like, Comment

# Register your models here.
admin.site.register(siteUser)
admin.site.register(Post)
admin.site.register(Follow)
admin.site.register(Like)
admin.site.register(Comment)