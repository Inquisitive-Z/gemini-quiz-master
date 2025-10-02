import React, { useState } from 'react';
import { QuizSettings } from '../types';
import { DIFFICULTY_LEVELS, NUM_QUESTIONS_OPTIONS } from '../constants';

interface QuizSetupProps {
  onStartQuiz: (settings: QuizSettings) => void;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ onStartQuiz }) => {
  const [difficulty, setDifficulty] = useState<QuizSettings['difficulty']>('Beginner');
  const [numQuestions, setNumQuestions] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartQuiz({ difficulty, numQuestions });
  };

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-lg mx-auto animate-fade-in">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-2">
        Gemini Quiz Master
      </h1>
      <p className="text-gray-400 mb-8">Test your knowledge on the "Development and Application of Artificial Intelligence" paper.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 text-left">
            Difficulty
          </label>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTY_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  difficulty === level
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 text-left">
            Number of Questions
          </label>
          <div className="grid grid-cols-4 gap-3">
            {NUM_QUESTIONS_OPTIONS.map((num) => (
               <button
                key={num}
                type="button"
                onClick={() => setNumQuestions(num)}
                className={`px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  numQuestions === num
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
        >
          Generate Quiz
        </button>
      </form>
    </div>
  );
};

export default QuizSetup;