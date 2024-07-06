import React, { useState, useEffect } from "react";
import "./task.css";

interface TaskProps {
  name: string;
  reward: number;
  show: string;
  link: string;
  balanceRef: React.MutableRefObject<{ value: number }>;
  onRewardClaimed: () => void;
}

const Task: React.FC<TaskProps> = ({
  name,
  reward,
  show,
  link,
  balanceRef,
  onRewardClaimed,
}) => {
  const [taskState, setTaskState] = useState<
    "go" | "check" | "countdown" | "claim" | "done"
  >("go");
  const [countdown, setCountdown] = useState(20);
  const [initialLoad, setInitialLoad] = useState(true); // Flag for initial load

  useEffect(() => {
    // Load the saved state from localStorage
    const savedState = localStorage.getItem(`taskState-${name}`);
    console.log(`Loaded task state for ${name}:`, savedState); // Debugging log
    if (savedState === "done") {
      setTaskState("done");
    } else {
      setTaskState("go");
    }
    setInitialLoad(false); // Set initial load flag to false after loading
  }, [name]);

  useEffect(() => {
    if (!initialLoad) {
      // Save the state to localStorage whenever it changes, only if it is 'done'
      if (taskState === "done") {
        console.log(`Saving task state for ${name}:`, taskState); // Debugging log
        localStorage.setItem(`taskState-${name}`, taskState);
      } else {
        // If the state is not 'done', remove it from localStorage
        localStorage.removeItem(`taskState-${name}`);
      }
    }
  }, [taskState, name, initialLoad]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (taskState === "countdown" && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (taskState === "countdown" && countdown === 0) {
      setTaskState("claim");
    }
    return () => clearTimeout(timer);
  }, [taskState, countdown]);

  const handleGoClick = () => {
    window.open(link, "_blank"); // Updated to use 'link' prop
    setTaskState("go");
    setTimeout(() => {
      setTaskState("check");
    }, 4000); // 4 seconds delay before changing to 'check' state
  };

  const handleCheckClick = () => {
    setTaskState("countdown");
  };

  const handleClaimClick = () => {
    balanceRef.current.value += reward;
    onRewardClaimed();
    setTaskState("done");
  };

  const renderButton = () => {
    switch (taskState) {
      case "go":
        return (
          <button className="taskgo" onClick={handleGoClick}>
            Go
          </button>
        );
      case "check":
        return (
          <button className="taskcheck" onClick={handleCheckClick}>
            Check
          </button>
        );
      case "countdown":
        return (
          <button className="taskcount" disabled>
            {countdown}s
          </button>
        );
      case "claim":
        return (
          <button className="taskclaim" onClick={handleClaimClick}>
            Claim
          </button>
        );
      case "done":
        return (
          <button className="taskdone" disabled>
            ✔️
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="task-box">
      <span className="taskspan">
        <p className="taskp">
          <span>
            {name} ({show}Coin)
          </span>
          <span>{renderButton()}</span>
        </p>
      </span>
    </div>
  );
};

export default Task;
