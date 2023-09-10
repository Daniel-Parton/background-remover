import { Dispatch, SetStateAction, useCallback, useState } from "react";

import { useHasMountedRef } from "./use-has-mounted";

/**
 * Like React's [useState](https://reactjs.org/docs/hooks-reference.html#usestate)
 * but it makes sure the component that uses this hook is mounted when updating state
 *
 * @see https://reactjs.org/docs/hooks-reference.html#usestate
 * @export
 * @param {any} initialValue
 * @returns {[any, Diapatch<any>]} an array of 2 items
 * the first is the current state, the second is a state update function
 * that does nothing if the component is not mounted
 */
export function useStateIfMounted<T = unknown>(initialState: T | (() => T)) {
  const hasMountedRef = useHasMountedRef();
  const [state, setState] = useState(initialState);
  const handleSetState = useCallback((value: SetStateAction<T>) => {
    if (hasMountedRef.current) {
      setState(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [state, handleSetState] as [T, Dispatch<SetStateAction<T>>];
}
