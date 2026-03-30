import { useEffect } from "react";

function Timer({ seconds, setSeconds, isActive, onTimeUp }) {
  useEffect(() => {
    let interval = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      onTimeUp();
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, onTimeUp, setSeconds]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div style={{ fontSize: "20px", fontWeight: "bold", margin: "10px 0" }}>
      Tiempo: {formatTime(seconds)}
    </div>
  );
}

export default Timer;