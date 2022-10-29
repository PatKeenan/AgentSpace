import { useState, useEffect } from "react";

export function useDebounce(value: string, delay: number) {

    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(
      () => {
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);
        return () => {
          clearTimeout(handler);
        };
      },
      [value, delay]
    );
    return debouncedValue;
  }

export function useDebounceState(initialState: string, delay = 700) {
    const [state, setState] = useState(initialState);
    return { state, setState, debounced: useDebounce(state, delay)};
}