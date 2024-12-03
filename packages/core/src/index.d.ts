import * as React from 'react';
declare global {
  interface Window {
    _FRACTAL: Record<string, {
      Component: any;
    } & (({ container: HTMLElement, initialState: Object }) => Promise<{ container: HTMLElement; update: (props: any) => any; name: string }>)>;
  }
}

declare const fractal: (Component: React.FunctionComponent<any>, options: { name: string }) => void;

export default fractal;
