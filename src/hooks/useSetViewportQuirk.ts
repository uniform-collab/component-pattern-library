/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUniformContext } from '@uniformdev/context-react';
import { Context } from '@uniformdev/context/*';
import { useEffect } from 'react';

/**
 * Example hook demonstrating how to live-set a quirk value based on viewport width
 * Which can then be fed into visibility control to show or hide components based on viewport
 */

const BREAKPOINTS = {
  mobile: 512,
  tablet: 768,
};

export function useSetViewportQuirk() {
  const { context } = useUniformContext();
  useEffect(() => {
    const debounce = (func: any, delay: any) => {
      let debounceTimer: any;
      return function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          func();
        }, delay);
      };
    };

    const debouncedHandler = debounce(() => {
      doUpdateQuirk(context);
    }, 50);

    debouncedHandler();
    window.addEventListener('resize', debouncedHandler);
    return () => {
      window.removeEventListener('resize', debouncedHandler);
    };
  }, [context]);

  // default viewport
}

const doUpdateQuirk = (context: Context) => {
  const viewport =
    window.innerWidth < BREAKPOINTS.mobile ? 'mobile' : window.innerWidth < BREAKPOINTS.tablet ? 'tablet' : 'desktop';
  context?.update({
    quirks: {
      viewport,
    },
  });
};
