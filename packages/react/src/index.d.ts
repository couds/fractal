import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

declare global {
  interface Window {
    _FRACTAL: Record<string, {
      Component: any;
    } & (({ container: HTMLElement, initialState: any }) => Promise<fractalComponentType>)>;
    _FRACTAL_INSTANCES: Record<string, fractalInstanceType>;
  }
}

export type fractalInstanceType = {
  name: string;
  container: HTMLElement;
  update: (obj: any) => any;
};

export type PolyfillType = (poly?: { React?: typeof React, ReactDOM?: typeof ReactDOM, [x: string]: any }) => void;

export type fractalComponentType = React.ForwardRefExoticComponent<{
  _setup: {
    /**
     * URL where the MF script is
     */
    script: string;
    /**
     * Name of the MF instance
     */
    name?: string;
    /**
     * If set will use this id for the MF identifier (not the instance but the script itself)
     */
    id?: string;
    /**
     * In case the component has SSR the initial markup
     */
    markup?: string;
    /**
     * Callback when the MF instance is initialized
     * @param {fractalInstanceType} mfInstance
     */
    onLoad?: (pfInstance: fractalInstanceType) => void;
    onError?: (error: Error) => any;
    /**
     * If true, will mount the component on the current React tree instead
     */
    mount?: boolean;
  };
  [x: string]: any;
}> & {
  polyfill?: PolyfillType;
};

declare const fractal: fractalComponentType & {
  polyfill: PolyfillType;
};


export default fractal;