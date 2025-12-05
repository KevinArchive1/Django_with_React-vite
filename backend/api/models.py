from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    title = models.CharField(max_length=100)
    content = models.TextField(max_length=1000)
    genre = models.CharField(max_length=100, blank=True)

    create_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.title
# Create your models here.

class Chapter(models.Model):
    story = models.ForeignKey(Note, on_delete=models.CASCADE, related_name="chapters")
    chapter_number = models.PositiveIntegerField()  
    title = models.CharField(max_length=200)
    content = models.TextField()  

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['chapter_number']  
    def __str__(self):
        return f"{self.story.title} — Chapter {self.chapter_number}: {self.title}"
