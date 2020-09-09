import { useCallback, useRef } from "react";

export const usePlacesReqKey = () => {
  const reqKeyRef = useRef<string | null>(null);
  const getReqKey = useCallback(() => reqKeyRef.current, []);
  const setReqKey = useCallback((val: string | null) => {
    reqKeyRef.current = val;
  }, []);
  return { getReqKey, setReqKey };
};
