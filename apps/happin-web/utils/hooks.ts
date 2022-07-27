import { useCallback, useEffect, useState, useRef } from 'react';

export function useResize() {
  const [width, setWidth] = useState<number>(0);
  const onResize = useCallback(() => {
    return setWidth(document.documentElement.clientWidth);
  }, []);
  useEffect(() => {
    if (width === 0) {
      setWidth(document.documentElement.clientWidth);
    }
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize, width]);
  return width;
}

export function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
}
