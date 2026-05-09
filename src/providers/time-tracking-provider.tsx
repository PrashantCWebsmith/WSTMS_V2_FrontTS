import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './auth-provider';
import { TaskTimeLogService } from '@/features/tasks/services/task-time-log.service';
import type { TaskViewModel } from '@/features/tasks/types/task.types';
import Swal from 'sweetalert2';

interface TimeTrackingContextType {
  activeTask: TaskViewModel | null;
  quickActionType: string | null;
  isRunning: boolean;
  elapsedTime: number;
  formatTime: (totalSeconds: number) => string;
  startTimer: (task: TaskViewModel) => Promise<void>;
  startQuickAction: (type: string) => Promise<void>;
  stopTimer: () => Promise<void>;
  stopAllTimers: () => Promise<void>;
}

const TimeTrackingContext = createContext<TimeTrackingContextType | undefined>(undefined);

export const useTimeTracking = () => {
  const context = useContext(TimeTrackingContext);
  if (!context) throw new Error('useTimeTracking must be used within a TimeTrackingProvider');
  return context;
};

export const TimeTrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activeTask, setActiveTask] = useState<TaskViewModel | null>(null);
  const [quickActionType, setQuickActionType] = useState<string | null>(null);
  const [activeLogId, setActiveLogId] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const storedTask = localStorage.getItem('timer_activeTask');
    const storedQuickType = localStorage.getItem('timer_quickActionType');
    const storedLogId = localStorage.getItem('timer_activeLogId');
    const storedStartTime = localStorage.getItem('timer_startTime');

    if ((storedTask || storedQuickType) && storedStartTime) {
      if (storedTask) setActiveTask(JSON.parse(storedTask));
      if (storedQuickType) setQuickActionType(storedQuickType);
      if (storedLogId) setActiveLogId(parseInt(storedLogId));

      const start = new Date(storedStartTime);
      setStartTime(start);

      const now = new Date();
      const diffSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);
      setElapsedTime(diffSeconds > 0 ? diffSeconds : 0);
      setIsRunning(true);
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const startTimer = async (task: TaskViewModel) => {
    if (user?.roleName?.toLowerCase().includes('admin')) {
      // Option to allow admins if desired, but V1 restricted it
    }

    if (activeLogId) {
      await stopTimer();
    }

    const now = new Date();
    const payload = {
      taskTimeLogIDP: 0,
      taskIDF: task.taskIDP,
      workDescription: "Started via V2 Timer",
      startTime: now.toISOString(),
      isManual: false
    };

    try {
      const result = await TaskTimeLogService.save(payload);
      const newLogId = result?.code || result?.id || 0;

      setActiveTask(task);
      setQuickActionType(null);
      setActiveLogId(newLogId);
      setStartTime(now);
      setElapsedTime(0);
      setIsRunning(true);

      localStorage.setItem('timer_activeTask', JSON.stringify(task));
      localStorage.removeItem('timer_quickActionType');
      localStorage.setItem('timer_activeLogId', newLogId.toString());
      localStorage.setItem('timer_startTime', now.toISOString());
    } catch (error) {
      console.error("Failed to start timer", error);
      Swal.fire("Error", "Failed to start timer", "error");
    }
  };

  const startQuickAction = async (type: string) => {
    if (isRunning) {
      await stopTimer();
    }

    const now = new Date();
    setIsRunning(true);
    setQuickActionType(type);
    setActiveTask(null);
    setActiveLogId(0);
    setStartTime(now);
    setElapsedTime(0);

    localStorage.removeItem('timer_activeTask');
    localStorage.setItem('timer_quickActionType', type);
    localStorage.removeItem('timer_activeLogId');
    localStorage.setItem('timer_startTime', now.toISOString());
  };

  const stopTimer = async () => {
    const now = new Date();
    const payload = {
      taskTimeLogIDP: activeLogId,
      taskIDF: activeTask?.taskIDP,
      startTime: startTime?.toISOString(),
      endTime: now.toISOString(),
      workDescription: "Stopped via V2 Timer",
      isManual: false
    };

    try {
      await TaskTimeLogService.save(payload);
      resetTimer();
    } catch (error) {
      console.error("Failed to stop timer", error);
      Swal.fire("Warning", "Timer stopped locally but failed to save to server.", "warning");
      resetTimer();
    }
  };

  const stopAllTimers = async () => {
    try {
      await TaskTimeLogService.stopAll();
      resetTimer();
    } catch (error) {
      console.error("Failed to stop all timers", error);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setActiveTask(null);
    setQuickActionType(null);
    setActiveLogId(0);
    setStartTime(null);
    setElapsedTime(0);
    localStorage.removeItem('timer_activeTask');
    localStorage.removeItem('timer_quickActionType');
    localStorage.removeItem('timer_activeLogId');
    localStorage.removeItem('timer_startTime');
  };

  return (
    <TimeTrackingContext.Provider value={{
      activeTask,
      quickActionType,
      isRunning,
      elapsedTime,
      formatTime,
      startTimer,
      startQuickAction,
      stopTimer,
      stopAllTimers
    }}>
      {children}
    </TimeTrackingContext.Provider>
  );
};
