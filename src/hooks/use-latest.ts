import { useRef } from "react";

export function useLatest<T = any>(value: T) {
  const ref = useRef<T>();
  ref.current = value;

  return ref;
}
