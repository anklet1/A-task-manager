from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from core.models import User, Lesson

class LessonAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.generate_url = reverse('lesson-generate-lesson')

    def test_generate_lesson_mock_mode(self):
        data = {
            "topic": "The Solar System",
            "grade_level": "JHS 1",
            "deployment_format": "offline-pwa",
            "outline": "Introduction to planets."
        }

        response = self.client.post(self.generate_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['topic'], "The Solar System")
        self.assertIsNotNone(response.data['generated_content'])
        self.assertIn("The Solar System", response.data['generated_content']['topic'])

        # Verify it was saved to DB
        self.assertEqual(Lesson.objects.count(), 1)
        lesson = Lesson.objects.first()
        self.assertEqual(lesson.created_by, self.user)

    def test_export_lesson_pwa(self):
        # First generate a lesson
        data = {
            "topic": "The Solar System",
            "grade_level": "JHS 1",
            "deployment_format": "offline-pwa",
            "outline": "Introduction to planets."
        }
        gen_response = self.client.post(self.generate_url, data, format='json')
        lesson_id = gen_response.data['id']

        # Now export it
        export_url = reverse('lesson-export-lesson', args=[lesson_id])
        export_response = self.client.get(export_url)

        self.assertEqual(export_response.status_code, status.HTTP_200_OK)
        self.assertEqual(export_response['Content-Type'], 'application/zip')
        self.assertIn('attachment; filename="the_solar_system_pwa.zip"', export_response['Content-Disposition'])

    def test_export_lesson_whatsapp(self):
        # Generate lesson as whatsapp
        data = {
            "topic": "Math Basics",
            "grade_level": "JHS 2",
            "deployment_format": "whatsapp-bot",
            "outline": "Algebra basics."
        }
        gen_response = self.client.post(self.generate_url, data, format='json')
        lesson_id = gen_response.data['id']

        # Now export it
        export_url = reverse('lesson-export-lesson', args=[lesson_id])
        export_response = self.client.get(export_url)

        self.assertEqual(export_response.status_code, status.HTTP_200_OK)
        self.assertEqual(export_response['Content-Type'], 'application/json')
        self.assertIn('attachment; filename="math_basics_whatsapp-bot.json"', export_response['Content-Disposition'])
