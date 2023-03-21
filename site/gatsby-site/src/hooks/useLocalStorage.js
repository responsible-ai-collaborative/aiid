import { useCallback } from 'react';
import useLocalStorageState from 'use-local-storage-state';

// function useHasHydrated(beforePaint = true) {
//   const [hasHydrated, setHasHydrated] = useState(false);

//   // To reduce flicker, we use `useLayoutEffect` so that we return value
//   // before React has painted to the browser.
//   // React currently throws a warning when using useLayoutEffect on the server so
//   // we use useEffect on the server (no-op) and useLayoutEffect in the browser.
//   const isServer = typeof window === 'undefined';

//   const useEffectFn = beforePaint && !isServer ? useLayoutEffect : useEffect;

//   useEffectFn(() => {
//     setHasHydrated(true);
//   }, []);

//   return hasHydrated;
// }

export const useLocalStorageState2 = ({ key, value }) => {
  const [parsedLocalStorage, setParsedLocalStorage] = useLocalStorageState(key, {
    defaultValue: value,
  });

  const handleUpdateLocalStorageState = useCallback(
    (x) => {
      setParsedLocalStorage(x);
    },
    [key]
  );

  return [parsedLocalStorage, handleUpdateLocalStorageState];
};
