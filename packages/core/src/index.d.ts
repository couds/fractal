import * as React from 'react';
import { fractalComponentType } from '../react';
declare global {
  interface Window {
    _FRACTAL: Record<string, {
      Component: any;
    } & (({ container: HTMLElement, initialState: Object }) => fractalComponentType)>;
  }
}

declare const fractal: (Component: React.FunctionComponent<any>, options: { name: string }) => void;

export default fractal;
