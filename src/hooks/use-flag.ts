import { useEvent } from "./use-event";
import { useStateIfMounted } from "./use-state-if-mounted";

export const useFlag = (initial?: boolean) => {
  const [value, set] = useStateIfMounted<boolean>(initial || false);

  const setTrue = useEvent(() => set(true));
  const setFalse = useEvent(() => set(false));
  const toggle = useEvent(() => set((x) => !x));

  return [value, { set, setTrue, setFalse, toggle }] as const;
};
