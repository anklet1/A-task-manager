import json
import zipfile
import io
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse

from core.models import Lesson, School
from core.api.serializers import LessonSerializer, GenerateLessonRequestSerializer
from core.services.ai_engine import EduBuilderAIEngine

class LessonViewSet(viewsets.ModelViewSet):
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Lesson.objects.filter(created_by=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['post'], url_path='generate')
    def generate_lesson(self, request):
        serializer = GenerateLessonRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        # Determine school
        school = None
        if data.get('school_id'):
            school = School.objects.filter(id=data['school_id']).first()

        # Initialize AI Engine and Generate Content
        ai_engine = EduBuilderAIEngine()
        generated_json = ai_engine.generate_lesson(
            topic=data['topic'],
            grade_level=data['grade_level'],
            deployment_format=data['deployment_format'],
            outline=data['outline']
        )

        # Save the lesson
        lesson = Lesson.objects.create(
            topic=data['topic'],
            grade_level=data['grade_level'],
            deployment_format=data['deployment_format'],
            outline=data['outline'],
            generated_content=generated_json,
            school=school,
            created_by=request.user
        )

        response_serializer = LessonSerializer(lesson)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], url_path='export')
    def export_lesson(self, request, pk=None):
        lesson = self.get_object()

        if not lesson.generated_content:
            return Response({"error": "No generated content available for export."}, status=status.HTTP_400_BAD_REQUEST)

        format = lesson.deployment_format

        if format == 'whatsapp-bot' or format == 'ussd-tree':
            # Export as JSON
            response = HttpResponse(
                json.dumps(lesson.generated_content, indent=2),
                content_type='application/json'
            )
            response['Content-Disposition'] = f'attachment; filename="{lesson.topic.replace(" ", "_").lower()}_{format}.json"'
            return response

        elif format == 'offline-pwa':
            # Export as a Zip containing a basic HTML shell and the JSON data
            buffer = io.BytesIO()
            with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as zf:

                # The raw json data
                zf.writestr('data.json', json.dumps(lesson.generated_content, indent=2))

                # Basic PWA Shell (simplified for prototype)
                html_content = f"""
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>{lesson.topic} - PWA</title>
                    <style>
                        body {{ font-family: sans-serif; padding: 20px; background: #0f172a; color: white; }}
                        .container {{ max-width: 600px; margin: 0 auto; background: #1e293b; padding: 20px; border-radius: 8px; }}
                        h1 {{ color: #fbbf24; }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>{lesson.topic}</h1>
                        <p>Grade: {lesson.grade_level}</p>
                        <hr/>
                        <div id="content">Loading lesson data...</div>
                    </div>
                    <script>
                        fetch('data.json')
                            .then(response => response.json())
                            .then(data => {{
                                document.getElementById('content').innerHTML = `
                                    <h2>Lesson Content</h2>
                                    <p>${{data.intro}}</p>
                                    <ul>${{data.keyPoints.map(kp => `<li>${{kp}}</li>`).join('')}}</ul>
                                `;
                            }});
                    </script>
                </body>
                </html>
                """
                zf.writestr('index.html', html_content)

            buffer.seek(0)
            response = HttpResponse(buffer, content_type='application/zip')
            response['Content-Disposition'] = f'attachment; filename="{lesson.topic.replace(" ", "_").lower()}_pwa.zip"'
            return response

        return Response({"error": "Unknown deployment format."}, status=status.HTTP_400_BAD_REQUEST)
