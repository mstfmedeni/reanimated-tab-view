import { useEffect, useRef } from 'react';

export const useStateUpdatesListener = (state: any, callback: () => void) => {
  const prevStateRef = useRef(null);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      prevStateRef.current = state;
      // Only skip callback on first render if state is 0 (first tab)
      if (state !== 0) {
        callback();
      }
      return;
    }

    if (state !== prevStateRef.current) {
      callback();
      prevStateRef.current = state;
    }
  }, [callback, state]);
};
