export interface Question {
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export type Quiz = Question[];

export interface QuizSettings {
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  numQuestions: number;
}

export interface UserAnswer {
  questionIndex: number;
  answer: string;
}

export type QuizState = 'setup' | 'loading' | 'active' | 'results' | 'error';