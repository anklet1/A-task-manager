import os
import json
import logging
from anthropic import Anthropic

logger = logging.getLogger(__name__)

class EduBuilderAIEngine:
    def __init__(self):
        self.api_key = os.environ.get('ANTHROPIC_API_KEY')
        self.mock_mode = not bool(self.api_key)

        if not self.mock_mode:
            self.client = Anthropic(api_key=self.api_key)

    def generate_lesson(self, topic, grade_level, deployment_format, outline):
        if self.mock_mode:
            logger.info("[EduBuilder AI Engine]: Running in Mock Mode.")
            return self._generate_mock_lesson(topic, outline, grade_level)

        return self._generate_claude_lesson(topic, grade_level, deployment_format, outline)

    def _generate_claude_lesson(self, topic, grade_level, deployment_format, outline):
        prompt = f"""
        You are an expert curriculum designer. Please generate a lesson based on the following parameters:
        Topic: {topic}
        Grade Level: {grade_level}
        Format: {deployment_format}
        Outline: {outline}

        Output a valid JSON object matching this schema:
        {{
            "topic": "string",
            "gradeLevel": "string",
            "intro": "string",
            "keyPoints": ["string", "string", ...],
            "questions": [
                {{
                    "id": "q1",
                    "text": "string",
                    "options": ["string", "string", ...],
                    "correctAnswerIndex": integer
                }},
                ... (generate exactly 3 questions)
            ],
            "remediationRules": {{
                "q1": [
                    {{"triggerOptionIndex": int, "explanation": "string", "simplifiedAnalogy": "string"}}
                ]
            }}
        }}
        """

        try:
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=2000,
                temperature=0.7,
                system="You are a JSON-generating AI. You must ONLY output valid JSON. Do not include markdown formatting or extra text.",
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            content = response.content[0].text
            return json.loads(content)
        except Exception as e:
            logger.error(f"[EduBuilder AI Engine]: Claude Generation Failed - {str(e)}. Falling back to Mock Mode.")
            return self._generate_mock_lesson(topic, outline, grade_level)

    def _generate_mock_lesson(self, topic, outline, grade_level):
        keywords = [word for word in topic.split() if len(word) > 3]
        main_subject = keywords[0] if keywords else topic or 'the subject'

        return {
            "topic": topic or 'Untitled Topic',
            "gradeLevel": grade_level,
            "intro": f"Welcome to this lesson on {topic}. Today we are going to explore the fundamental principles of {main_subject} and how it relates to our everyday lives.",
            "keyPoints": [
                f"The core concept of {main_subject} is essential for understanding the broader topic.",
                "This topic has important real-world applications.",
                "When analyzing the outline provided, we can see clear patterns emerging."
            ],
            "questions": [
                {
                    "id": "q1",
                    "text": f"What is the primary focus of {main_subject}?",
                    "options": [
                        "Understanding its basic mechanics",
                        "Ignoring its effects completely",
                        "Replacing it with older methods",
                        "None of the above"
                    ],
                    "correctAnswerIndex": 0
                },
                {
                    "id": "q2",
                    "text": "How does this concept affect the overall outcome?",
                    "options": [
                        "It decreases efficiency",
                        "It acts as a catalyst for growth",
                        "It has no measurable impact",
                        "It reverses the process"
                    ],
                    "correctAnswerIndex": 1
                },
                {
                    "id": "q3",
                    "text": "Based on the lesson, which statement is true?",
                    "options": [
                        f"The principles of {main_subject} are rarely applicable.",
                        "Only one factor matters.",
                        "Multiple factors are important to consider.",
                        "This topic is generally misunderstood."
                    ],
                    "correctAnswerIndex": 2
                }
            ],
            "remediationRules": {
                "q1": [
                    {"triggerOptionIndex": 1, "explanation": "Ignoring effects is contrary to studying them.", "simplifiedAnalogy": f"Think of {main_subject} like a car engine; ignoring it means the car won't run."},
                    {"triggerOptionIndex": 2, "explanation": "Older methods do not replace this core concept.", "simplifiedAnalogy": f"Replacing {main_subject} is like using a horse instead of a tractor."}
                ],
                "q2": [
                    {"triggerOptionIndex": 0, "explanation": "It typically improves, not decreases, efficiency.", "simplifiedAnalogy": "Imagine this concept as fuel; it speeds things up, not slows them down."},
                    {"triggerOptionIndex": 2, "explanation": "There is a definite measurable impact.", "simplifiedAnalogy": "Saying it has no impact is like saying rain doesn't make things wet."}
                ],
                "q3": [
                    {"triggerOptionIndex": 0, "explanation": "These principles are highly applicable.", "simplifiedAnalogy": f"We use {main_subject} every day, just like we use math to count change."},
                    {"triggerOptionIndex": 1, "explanation": "There are multiple factors, not just one.", "simplifiedAnalogy": "A recipe needs more than just one ingredient."}
                ]
            }
        }
