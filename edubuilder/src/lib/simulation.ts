export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface RemediationRule {
  triggerOptionIndex: number;
  explanation: string;
  simplifiedAnalogy: string;
}

export interface GeneratedLesson {
  topic: string;
  gradeLevel: string;
  intro: string;
  keyPoints: string[];
  questions: Question[];
  remediationRules: Record<string, RemediationRule[]>; // Keyed by question ID
}

// Lightweight keyword extraction logic to simulate AI processing
export const generateSimulation = (topic: string, outline: string, gradeLevel: string): GeneratedLesson => {
  // Extract keywords
  const keywords = topic.split(' ').filter(word => word.length > 3)
    .concat(outline.split(/[\s,.\n]+/).filter(word => word.length > 5))
    .map(word => word.toLowerCase());

  // Deduplicate and get top terms
  const uniqueKeywords = [...new Set(keywords)].slice(0, 5);

  const mainSubject = uniqueKeywords[0] || topic || 'the subject';
  const secondarySubject = uniqueKeywords[1] || 'important concepts';

  return {
    topic: topic || 'Untitled Topic',
    gradeLevel,
    intro: `Welcome to this lesson on ${topic || 'our new topic'}. Today we are going to explore the fundamental principles of ${mainSubject} and how it relates to our everyday lives.`,
    keyPoints: [
      `The core concept of ${mainSubject} is essential for understanding the broader topic.`,
      `Many experts believe that ${secondarySubject} plays a crucial role.`,
      `When analyzing the outline provided, we can see clear patterns emerging.`
    ],
    questions: [
      {
        id: 'q1',
        text: `What is the primary focus of ${mainSubject}?`,
        options: [
          `Understanding its basic mechanics`,
          `Ignoring its effects completely`,
          `Replacing it with older methods`,
          `None of the above`
        ],
        correctAnswerIndex: 0
      },
      {
        id: 'q2',
        text: `How does ${secondarySubject} affect the overall outcome?`,
        options: [
          `It decreases efficiency`,
          `It acts as a catalyst for growth`,
          `It has no measurable impact`,
          `It reverses the process`
        ],
        correctAnswerIndex: 1
      },
      {
        id: 'q3',
        text: `Based on the lesson, which statement is true?`,
        options: [
          `The principles of ${mainSubject} are rarely applicable.`,
          `${secondarySubject} is the only factor that matters.`,
          `Both ${mainSubject} and ${secondarySubject} are important to consider.`,
          `This topic is generally misunderstood.`
        ],
        correctAnswerIndex: 2
      }
    ],
    remediationRules: {
      'q1': [
        { triggerOptionIndex: 1, explanation: 'Ignoring effects is contrary to studying them.', simplifiedAnalogy: `Think of ${mainSubject} like a car engine; ignoring it means the car won't run.` },
        { triggerOptionIndex: 2, explanation: 'Older methods do not replace this core concept.', simplifiedAnalogy: `Replacing ${mainSubject} is like using a horse instead of a tractor.` }
      ],
      'q2': [
        { triggerOptionIndex: 0, explanation: 'It typically improves, not decreases, efficiency.', simplifiedAnalogy: `Imagine ${secondarySubject} as fuel; it speeds things up, not slows them down.` },
        { triggerOptionIndex: 2, explanation: 'There is a definite measurable impact.', simplifiedAnalogy: `Saying ${secondarySubject} has no impact is like saying rain doesn't make things wet.` }
      ],
      'q3': [
        { triggerOptionIndex: 0, explanation: 'These principles are highly applicable.', simplifiedAnalogy: `We use ${mainSubject} every day, just like we use math to count change.` },
        { triggerOptionIndex: 1, explanation: 'There are multiple factors, not just one.', simplifiedAnalogy: `A recipe needs more than just one ingredient; ${secondarySubject} is just one part.` }
      ]
    }
  };
};
