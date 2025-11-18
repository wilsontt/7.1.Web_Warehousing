import { useEffect, useRef, useCallback } from "react";

interface UseIdleTimerOptions {
  timeout: number; // 閒置時間（毫秒）
  onIdle: () => void; // 閒置回調
  onWarning?: (remainingTime: number) => void; // 警告回調
  warningTime?: number; // 警告時間（毫秒，預設 1 分鐘）
  enabled?: boolean; // 是否啟用
}

export function useIdleTimer({
  timeout,
  onIdle,
  onWarning,
  warningTime = 60000, // 預設 1 分鐘
  enabled = true,
}: UseIdleTimerOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimer = useCallback(() => {
    if (!enabled) return;

    const now = Date.now();
    lastActivityRef.current = now;

    // 清除現有計時器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // 設定警告計時器
    if (onWarning) {
      warningTimeoutRef.current = setTimeout(() => {
        const remainingTime = timeout - (Date.now() - lastActivityRef.current);
        onWarning(Math.max(0, remainingTime));
      }, timeout - warningTime);
    }

    // 設定閒置計時器
    timeoutRef.current = setTimeout(() => {
      onIdle();
    }, timeout);
  }, [timeout, onIdle, onWarning, warningTime, enabled]);

  useEffect(() => {
    if (!enabled) return;

    // 監聽使用者活動
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"];
    
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // 初始化計時器
    resetTimer();

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [resetTimer, enabled]);

  return {
    reset: resetTimer,
  };
}

