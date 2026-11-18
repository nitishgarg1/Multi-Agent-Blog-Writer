import { useCallback, useReducer, useRef } from 'react';
import { streamRun } from '../api/streamRun.js';
import { API_URL } from '../config.js';
import { initialState, runReducer } from '../state/runReducer.js';

export function useBlogRun() {
  const [state, dispatch] = useReducer(runReducer, initialState);
  const controller = useRef(null);

  const start = useCallback(async (topic) => {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    dispatch({ type: 'start', topic });

    try {
      await streamRun(topic, {
        signal: current.signal,
        onEvent: (event) => dispatch({ type: 'event', event }),
      });
      dispatch({ type: 'stream_end' });
    } catch (err) {
      if (err.name === 'AbortError') return;
      const message =
        err instanceof TypeError
          ? `Can't reach the backend at ${API_URL}. Check that uvicorn is running.`
          : err.message || 'Something went wrong.';
      dispatch({ type: 'fail', message });
    }
  }, []);

  const stop = useCallback(() => {
    controller.current?.abort();
    dispatch({ type: 'stopped' });
  }, []);

  return { state, start, stop };
}
