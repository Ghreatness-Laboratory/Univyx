# Backend Endpoints Needed for User Stats Integration

## Required Django Views/Endpoints:

### 1. User Stats Endpoint
**URL:** `GET /auth/stats/`
**Purpose:** Return user activity statistics

```python
# In your Django views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request):
    user = request.user
    
    # Count user's bookmarks
    bookmarks_count = Bookmark.objects.filter(user=user).count()
    
    # Count user's likes
    likes_count = Like.objects.filter(user=user).count()
    
    # Count user's comments
    comments_count = Comment.objects.filter(author=user).count()
    
    # You can add more stats as needed
    stats = {
        'bookmarks_count': bookmarks_count,
        'likes_count': likes_count,
        'comments_posted': comments_count,
        'articles_read': 0,  # Implement if you track article views
        'events_attended': 0,  # Implement if you track event attendance
    }
    
    return Response(stats)
```

### 2. User Bookmarks Endpoint
**URL:** `GET /auth/bookmarks/`

```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_bookmarks(request):
    bookmarks = Bookmark.objects.filter(user=request.user)
    # Serialize and return bookmarks
    return Response([{'id': b.id, 'content_type': str(b.content_type)} for b in bookmarks])
```

### 3. User Comments Endpoint
**URL:** `GET /auth/comments/`

```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_comments(request):
    comments = Comment.objects.filter(author=request.user)
    # Serialize and return comments
    return Response([{'id': c.id, 'content': c.content} for c in comments])
```

### 4. User Likes Endpoint
**URL:** `GET /auth/likes/`

```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_likes(request):
    likes = Like.objects.filter(user=request.user)
    # Serialize and return likes
    return Response([{'id': l.id, 'content_type': str(l.content_type)} for l in likes])
```

## URL Configuration:
Add to your `urls.py`:

```python
from django.urls import path
from . import views

urlpatterns = [
    # ... existing URLs
    path('auth/stats/', views.user_stats, name='user_stats'),
    path('auth/bookmarks/', views.user_bookmarks, name='user_bookmarks'),
    path('auth/comments/', views.user_comments, name='user_comments'),
    path('auth/likes/', views.user_likes, name='user_likes'),
]
```

## Profile Endpoint Fix:
Make sure your profile endpoint returns the correct user data structure:

```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    return Response({
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'full_name': f"{user.first_name} {user.last_name}".strip(),
        'date_joined': user.date_joined,
        'last_login': user.last_login,
    })
```

## Models Required:
Make sure you have these models in your Django app:

```python
# models.py
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    created_at = models.DateTimeField(auto_now_add=True)

class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    created_at = models.DateTimeField(auto_now_add=True)

class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    created_at = models.DateTimeField(auto_now_add=True)
```