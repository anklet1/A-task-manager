from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Custom fields can be added here
    pass

class School(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Lesson(models.Model):
    topic = models.CharField(max_length=255)
    grade_level = models.CharField(max_length=50)
    deployment_format = models.CharField(max_length=50)
    outline = models.TextField()
    generated_content = models.JSONField(null=True, blank=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='lessons', null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lessons')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.topic} - {self.grade_level}"
