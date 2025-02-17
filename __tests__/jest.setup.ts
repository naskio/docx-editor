import React from 'react';
import { setConfig } from 'next/config';
import '@testing-library/jest-dom';
import config from '../next.config';

// extends jest expect with jest-dom matchers

// Mock lucide-react icons to avoid jest compilation error
jest.mock('lucide-react', () => {
  return new Proxy(
    {},
    {
      get: (target, prop) => {
        return (props) =>
          React.createElement('svg', { ...props, 'data-icon': prop });
      },
    }
  );
});

// Make sure you can use "publicRuntimeConfig" within tests.
setConfig(config);
