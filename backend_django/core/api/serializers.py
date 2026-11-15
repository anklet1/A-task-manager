from rest_framework import serializers
from core.models import User, School, Lesson

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['id', 'name', 'created_at']

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'topic', 'grade_level', 'deployment_format', 'outline', 'generated_content', 'school', 'created_at']
        read_only_fields = ['generated_content', 'created_by']

class GenerateLessonRequestSerializer(serializers.Serializer):
    topic = serializers.CharField(max_length=255)
    grade_level = serializers.CharField(max_length=50)
    deployment_format = serializers.ChoiceField(choices=['offline-pwa', 'whatsapp-bot', 'ussd-tree'])
    outline = serializers.CharField()
    school_id = serializers.IntegerField(required=False, allow_null=True)
