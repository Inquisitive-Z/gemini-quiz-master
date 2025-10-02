
export const DIFFICULTY_LEVELS: ['Beginner', 'Intermediate', 'Advanced'] = ['Beginner', 'Intermediate', 'Advanced'];
export const NUM_QUESTIONS_OPTIONS = [5, 10, 15, 20];
export const QUIZ_TIMER_SECONDS = 300; // 5 minutes for a standard quiz

export interface Grade {
  letter: string;
  color: string;
  feedback: string;
}

export const GRADING_SCALE: { [key: number]: Grade } = {
  90: { letter: 'A', color: 'text-green-400', feedback: 'Excellent work! You have a strong grasp of the material.' },
  80: { letter: 'B', color: 'text-blue-400', feedback: 'Great job! You know this topic well.' },
  70: { letter: 'C', color: 'text-yellow-400', feedback: 'Good effort. There are some areas for improvement.' },
  60: { letter: 'D', color: 'text-orange-400', feedback: 'You passed, but a review of the material is recommended.' },
  0: { letter: 'F', color: 'text-red-400', feedback: 'It looks like you struggled. Review the incorrect answers and try again!' }
};
