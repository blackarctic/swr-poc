import { useEffect, useState, useRef } from "react";
import { useThrottleFn } from "ahooks";

const INITIAL_RENDER_TIMEOUT = 1000;
const HIGHLIGHT_TIME_MS = 1000;

export const useHighlightOnChange = (valuesToWatch: any[]) => {
  const isInitialRenderRef = useRef(true);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const { run: onUpdate } = useThrottleFn(
    () => {
      setIsHighlighted(true);
      setTimeout(() => {
        setIsHighlighted(false);
      }, HIGHLIGHT_TIME_MS);
    },
    { wait: HIGHLIGHT_TIME_MS }
  );

  useEffect(() => {
    if (!isInitialRenderRef.current) {
      onUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onUpdate, ...valuesToWatch]);

  useEffect(() => {
    setTimeout(() => {
      isInitialRenderRef.current = false;
    }, INITIAL_RENDER_TIMEOUT);
  }, []);

  return isHighlighted;
};
