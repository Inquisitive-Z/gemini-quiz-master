
import React, { useState, useEffect, useMemo } from 'react';
import { Question, Quiz, UserAnswer } from '../types';
import ProgressBar from './ProgressBar';
import Timer from './Timer';
import { QUIZ_TIMER_SECONDS } from '../constants';

interface QuizInProgressProps {
  quiz: Quiz;
  userAnswers: UserAnswer[];
  onAnswerSelect: (questionIndex: number, answer: string) => void;
  onComplete: () => void;
}

const QuestionCard: React.FC<{
    question: Question;
    onAnswer: (answer: string) => void;
    isAnswered: boolean;
    userAnswer?: string;
}> = ({ question, onAnswer, isAnswered, userAnswer }) => {

    const getButtonClass = (option: string) => {
        if (!isAnswered) {
            return "bg-gray-700 hover:bg-indigo-600";
        }
        if (option === question.correctAnswer) {
            return "bg-green-600";
        }
        if (option === userAnswer) {
            return "bg-red-600";
        }
        return "bg-gray-700 opacity-50";
    };

    return (
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full animate-fade-in-fast">
            <h2 className="text-2xl font-semibold mb-6 text-gray-200">{question.questionText}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => onAnswer(option)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 rounded-lg font-medium transition-all duration-300 ${getButtonClass(option)} ${!isAnswered ? 'transform hover:scale-105' : ''}`}
                    >
                        {option}
                    </button>
                ))}
            </div>
            {isAnswered && (
                 <div className="mt-6 p-4 bg-gray-900 rounded-lg animate-fade-in-fast">
                    <p className="font-bold text-lg">{userAnswer === question.correctAnswer ? "Correct!" : "Incorrect."}</p>
                    <p className="text-gray-400">{question.explanation}</p>
                 </div>
            )}
        </div>
    );
};


const QuizInProgress: React.FC<QuizInProgressProps> = ({ quiz, userAnswers, onAnswerSelect, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = quiz[currentQuestionIndex];
  const progress = (currentQuestionIndex / quiz.length) * 100;

  useEffect(() => {
    if (userAnswers.length === quiz.length) {
      setTimeout(onComplete, 1500);
    }
  }, [userAnswers, quiz.length, onComplete]);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;

    setIsAnswered(true);
    onAnswerSelect(currentQuestionIndex, answer);

    setTimeout(() => {
      if (currentQuestionIndex < quiz.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsAnswered(false);
      } else {
        onComplete();
      }
    }, 2000); // Wait 2 seconds before moving to the next question
  };
  
  const currentUserAnswer = useMemo(() => {
    return userAnswers.find(ua => ua.questionIndex === currentQuestionIndex)?.answer;
  }, [userAnswers, currentQuestionIndex]);

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl">
        <div className="w-full">
            <ProgressBar progress={progress} />
            <p className="text-sm text-gray-400 mt-1 text-center">{`Question ${currentQuestionIndex + 1} of ${quiz.length}`}</p>
        </div>
        <Timer initialSeconds={QUIZ_TIMER_SECONDS} onTimeUp={onComplete} />
      </div>
      
      <QuestionCard 
        question={currentQuestion}
        onAnswer={handleAnswer}
        isAnswered={isAnswered}
        userAnswer={currentUserAnswer}
      />
    </div>
  );
};

export default QuizInProgress;
