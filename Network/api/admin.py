from django.contrib import admin
from .models import siteUser, Post, Follow

# Register your models here.
admin.site.register(siteUser)
admin.site.register(Post)
admin.site.register(Follow)