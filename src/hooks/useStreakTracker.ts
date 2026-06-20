import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

export interface StreakStatus {
  currentStreak: number;
  lastCheckedIn: string | null; // ISO YYYY-MM-DD
  history: Record<string, boolean>;
}

export interface UseStreakTrackerReturn {
  dateOffset: number;
  streakStatus: StreakStatus;
  getSimulatedDate: () => Date;
  getLocalDateString: (d: Date) => string;
  formatFriendlyDate: (d: Date) => string;
  handleCheckIn: (activeCommitmentCount: number) => string | null; // returns error text if check-in fails, otherwise null
  handleSimulateNextDay: () => void;
  handleResetStreak: () => void;
}

export function useStreakTracker(uid: string | null): UseStreakTrackerReturn {
  const [dateOffset, setDateOffset] = useState<number>(0);
  const [streakStatus, setStreakStatus] = useState<StreakStatus>({
    currentStreak: 0,
    lastCheckedIn: null,
    history: {}
  });

  const getSimulatedDate = (): Date => {
    const d = new Date();
    d.setDate(d.getDate() + dateOffset);
    return d;
  };

  const getLocalDateString = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatFriendlyDate = (d: Date): string => {
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const triggerConfettiCelebration = (): void => {
    try {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 }
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 }
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      setTimeout(() => {
        frame();
      }, 150);
    } catch (err) {
      console.error("Confetti execution failed:", err);
    }
  };

  // Synchronize streak on mount and user identity changes
  useEffect(() => {
    if (uid) {
      const stored = localStorage.getItem(`streak_data_${uid}`);
      if (stored) {
        try {
          setStreakStatus(JSON.parse(stored) as StreakStatus);
        } catch (e) {
          console.warn("Could not load streak data:", e);
        }
      } else {
        setStreakStatus({
          currentStreak: 0,
          lastCheckedIn: null,
          history: {}
        });
      }
    }
  }, [uid]);

  const handleCheckIn = (activeCommitmentCount: number): string | null => {
    if (!uid) return "Session not initialized.";

    if (activeCommitmentCount === 0) {
      return "You must commit to at least one sustainable action in the Simulator below first to track habit maintenance.";
    }

    const simDate = getSimulatedDate();
    const todayStr = getLocalDateString(simDate);

    const prevDate = new Date(simDate);
    prevDate.setDate(prevDate.getDate() - 1);
    const yesterdayStr = getLocalDateString(prevDate);

    let newStreak = streakStatus.currentStreak;

    if (streakStatus.lastCheckedIn === todayStr) {
      return null; // Already checked in today
    } else if (streakStatus.lastCheckedIn === yesterdayStr) {
      newStreak = streakStatus.currentStreak + 1;
    } else {
      newStreak = 1;
    }

    const updated: StreakStatus = {
      currentStreak: newStreak,
      lastCheckedIn: todayStr,
      history: {
        ...streakStatus.history,
        [todayStr]: true
      }
    };

    setStreakStatus(updated);
    localStorage.setItem(`streak_data_${uid}`, JSON.stringify(updated));

    if (newStreak > 0 && newStreak % 7 === 0) {
      triggerConfettiCelebration();
    }

    return null;
  };

  const handleSimulateNextDay = (): void => {
    setDateOffset((prev) => prev + 1);
  };

  const handleResetStreak = (): void => {
    const freshStatus: StreakStatus = {
      currentStreak: 0,
      lastCheckedIn: null,
      history: {}
    };
    setStreakStatus(freshStatus);
    setDateOffset(0);
    if (uid) {
      localStorage.setItem(`streak_data_${uid}`, JSON.stringify(freshStatus));
    }
  };

  return {
    dateOffset,
    streakStatus,
    getSimulatedDate,
    getLocalDateString,
    formatFriendlyDate,
    handleCheckIn,
    handleSimulateNextDay,
    handleResetStreak,
  };
}
