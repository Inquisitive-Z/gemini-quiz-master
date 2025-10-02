
import React, { useState, useEffect } from 'react';

interface TimerProps {
  initialSeconds: number;
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialSeconds, onTimeUp }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [secondsLeft, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const timerColor = secondsLeft < 30 ? 'text-red-500' : 'text-gray-300';

  return (
    <div className={`text-lg font-mono font-semibold ml-4 px-3 py-1 rounded-md bg-gray-900 ${timerColor}`}>
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
};

export default Timer;
