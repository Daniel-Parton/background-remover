import isNil from "lodash/isNil";
import useEventHook from "react-use-event-hook";

const NoOp = () => {};

type AnyFunction = (...args: any[]) => any;

export function useEvent<TCallback extends AnyFunction>(
  callback: TCallback
): TCallback {
  return useEventHook(isNil(callback) ? (NoOp as TCallback) : callback);
}
