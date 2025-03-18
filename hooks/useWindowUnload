import { useEffect, useRef } from 'react';

const useWindowUnload = (fn: (e: BeforeUnloadEvent) => void): void => {
  const cb = useRef(fn);

  useEffect(() => {
    cb.current = fn;
  }, [fn]);

  useEffect(() => {
    const onUnload = (e: BeforeUnloadEvent) => {
      if (cb.current) {
        cb.current(e);
      }
    };

    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener('beforeunload', onUnload);
    };
  }, []);
};

export default useWindowUnload;
