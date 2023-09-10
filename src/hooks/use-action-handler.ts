import { Dispatch, SetStateAction } from "react";

import { useStateIfMounted } from "./use-state-if-mounted";
import { useLatest } from "./use-latest";
import { useConstantCallback } from "./use-constant";
import { notifications } from "@mantine/notifications";

export type ActionHandlerDecorator<T = unknown> = (
  handleAction: Promise<T | undefined>
) => Promise<T>;

export type HandleAsync = <T = unknown, TSource extends string = string>(
  action: () => Promise<T>,
  options?: UseHandleActionOptions<T, TSource>
) => Promise<T>;

interface InitOptions {
  isHandlingDefault?: boolean;
  isHandlingDefaultSource?: string;
  decorator?: ActionHandlerDecorator<any>;
}

export interface UseHandleActionOptions<
  TResponse = unknown,
  TSource extends string = string
> extends HandleActionOptions<TResponse> {
  errorOptions?: {
    throw?: boolean;
    skipLog?: boolean;
    resolveToastMessage?: (error: any) => string;
  };
  source?: TSource;
}

export interface AsyncHandlingState<TSource extends string = string> {
  isHandling: boolean;
  handlingSource?: TSource;
}

export type AsyncActionHandler<TSource extends string = string> = <
  TResponse = unknown
>(
  action: () => Promise<TResponse>,
  options?: UseHandleActionOptions<TResponse, TSource>
) => Promise<TResponse>;

export type UseActionHandlerResponse<TSource extends string = string> = [
  AsyncActionHandler<TSource>,
  AsyncHandlingState<TSource>,
  Dispatch<SetStateAction<AsyncHandlingState<TSource>>>
];

const unknownSource = "Unknown";
export function useActionHandler<TSource extends string = string>(
  options?: InitOptions
) {
  const decoratorRef = useLatest(options?.decorator);
  const [handling, setHandling] = useStateIfMounted<
    AsyncHandlingState<TSource>
  >({
    isHandling: options?.isHandlingDefault || false,
    handlingSource: options?.isHandlingDefaultSource || (unknownSource as any),
  });

  const handleAsync = useConstantCallback(
    <TResponse>(
      action: () => Promise<TResponse>,
      options: UseHandleActionOptions<TResponse, TSource> | undefined
    ) => {
      return handleHookActionAsync<TSource, TResponse>(
        action,
        setHandling,
        options,
        decoratorRef.current
      );
    }
  );

  return [
    handleAsync,
    handling,
    setHandling,
  ] as UseActionHandlerResponse<TSource>;
}

function handleHookActionAsync<
  TSource extends string = string,
  TResponse = unknown
>(
  action: () => Promise<TResponse>,
  setHandling: Dispatch<SetStateAction<AsyncHandlingState<TSource>>>,
  options?: UseHandleActionOptions<TResponse, TSource>,
  decorator?: ActionHandlerDecorator<TResponse>
) {
  return handleActionAsync(
    action,
    {
      onStart: () => {
        setHandling({
          isHandling: true,
          handlingSource: options?.source || (unknownSource as any),
        });
        options?.onStart?.();
      },
      onSettled: options?.onSettled,
      onSuccess: (r) => {
        options?.onSuccess?.(r);
        setHandling({
          isHandling: false,
          handlingSource: unknownSource as any,
        });
      },
      skipLog: options?.errorOptions?.skipLog,
      onError: (e) => {
        const resolveToast = options?.errorOptions?.resolveToastMessage;
        if (resolveToast) {
          notifications.show({
            title: "Error",
            message: resolveToast(e),
            color: "red",
          });
        }
        setHandling({
          isHandling: false,
          handlingSource: unknownSource as any,
        });
        options?.onError?.(e);

        if (options?.errorOptions?.throw) {
          throw e;
        }
      },
    },
    decorator
  );
}

export interface HandleActionOptions<TResponse = unknown> {
  onStart?: () => void;
  onSuccess?: (response?: TResponse) => void;
  onError?: (error?: any) => void;
  skipLog?: boolean;
  onSettled?: () => void;
}

export async function handleActionAsync<TResponse = unknown>(
  action: () => Promise<TResponse>,
  options?: HandleActionOptions<TResponse>,
  decorator?: ActionHandlerDecorator<TResponse>
) {
  return !!decorator
    ? decorator(baseHandleActionAsync(action, options))
    : baseHandleActionAsync(action, options);
}

async function baseHandleActionAsync<TResponse = unknown>(
  action: () => Promise<TResponse>,
  options?: HandleActionOptions<TResponse>
) {
  options?.onStart?.();
  try {
    const response = await action();
    options?.onSettled?.();
    if (options?.onSuccess) options.onSuccess(response);
    return response;
  } catch (e) {
    if (!options?.skipLog) {
      console.error(e);
    }
    options?.onSettled?.();
    options?.onError?.(e);
  }
}
