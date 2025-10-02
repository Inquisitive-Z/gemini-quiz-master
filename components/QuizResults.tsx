
import React, { useMemo } from 'react';
import { Quiz, UserAnswer, Question } from '../types';
import { GRADING_SCALE, Grade } from '../constants';

interface QuizResultsProps {
  quiz: Quiz;
  userAnswers: UserAnswer[];
  onRestart: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ quiz, userAnswers, onRestart }) => {
  const { score, percentage, grade } = useMemo(() => {
    let correct = 0;
    userAnswers.forEach((userAnswer) => {
      if (quiz[userAnswer.questionIndex].correctAnswer === userAnswer.answer) {
        correct++;
      }
    });
    const percentage = Math.round((correct / quiz.length) * 100);
    
    let calculatedGrade: Grade = GRADING_SCALE[0];
    for (const threshold in GRADING_SCALE) {
        if (percentage >= parseInt(threshold)) {
            calculatedGrade = GRADING_SCALE[parseInt(threshold)];
        }
    }

    return {
      score: correct,
      percentage,
      grade: calculatedGrade
    };
  }, [quiz, userAnswers]);

  const incorrectQuestions = useMemo(() => {
    return userAnswers
      .filter(ua => quiz[ua.questionIndex].correctAnswer !== ua.answer)
      .map(ua => ({
        question: quiz[ua.questionIndex],
        userAnswer: ua.answer,
      }));
  }, [quiz, userAnswers]);

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-center mb-2">Quiz Complete!</h1>
        <p className="text-gray-400 text-center">Here's how you did.</p>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-around bg-gray-900 p-6 rounded-xl space-y-4 md:space-y-0">
        <div className="text-center">
          <p className="text-gray-400 text-sm font-medium">Your Score</p>
          <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
            {score}/{quiz.length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm font-medium">Percentage</p>
          <p className="text-4xl font-extrabold text-indigo-400">{percentage}%</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm font-medium">Grade</p>
          <p className={`text-4xl font-extrabold ${grade.color}`}>{grade.letter}</p>
        </div>
      </div>

      <div className="text-center bg-gray-700/50 p-4 rounded-lg">
        <p className="font-semibold">{grade.feedback}</p>
      </div>

      {incorrectQuestions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-center">Review Your Mistakes</h2>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {incorrectQuestions.map(({ question, userAnswer }, index) => (
              <div key={index} className="bg-gray-900 p-4 rounded-lg">
                <p className="font-semibold text-gray-300 mb-2">{question.questionText}</p>
                <p className="text-sm text-red-400">Your answer: {userAnswer}</p>
                <p className="text-sm text-green-400">Correct answer: {question.correctAnswer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onRestart}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
      >
        Take Another Quiz
      </button>
    </div>
  );
};

export default QuizResults;