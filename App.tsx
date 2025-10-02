
import React, { useState, useCallback } from 'react';
import { Quiz, QuizSettings, QuizState, UserAnswer } from './types';
import { generateQuiz } from './services/geminiService';
import QuizSetup from './components/QuizSetup';
import QuizInProgress from './components/QuizInProgress';
import QuizResults from './components/QuizResults';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleStartQuiz = useCallback(async (settings: QuizSettings) => {
    setQuizState('loading');
    setError(null);
    setUserAnswers([]);
    setQuiz(null);
    try {
      if (!process.env.API_KEY) {
        throw new Error("API key is missing. Please set the API_KEY environment variable.");
      }
      const newQuiz = await generateQuiz(settings);
      setQuiz(newQuiz);
      setQuizState('active');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while generating the quiz.');
      setQuizState('error');
    }
  }, []);

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setUserAnswers(prev => [...prev, { questionIndex, answer }]);
  };

  const handleQuizComplete = () => {
    setQuizState('results');
  };

  const handleRestart = () => {
    setQuizState('setup');
    setQuiz(null);
    setUserAnswers([]);
    setError(null);
  };

  const renderContent = () => {
    switch (quizState) {
      case 'loading':
        return <Loader message="Generating your custom quiz... This might take a moment." />;
      case 'active':
        return quiz && (
          <QuizInProgress
            quiz={quiz}
            userAnswers={userAnswers}
            onAnswerSelect={handleAnswerSelect}
            onComplete={handleQuizComplete}
          />
        );
      case 'results':
        return quiz && <QuizResults quiz={quiz} userAnswers={userAnswers} onRestart={handleRestart} />;
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Oops! Something went wrong.</h2>
            <p className="text-gray-300 mb-6 max-w-md">{error}</p>
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      case 'setup':
      default:
        return <QuizSetup onStartQuiz={handleStartQuiz} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-3xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
