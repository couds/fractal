import React from 'react';
import * as ReactDOM from 'react-dom/client';
import axios from 'axios';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import fractal from '@couds/fractal-react';

fractal.polyfill({ React, ReactDOM })

export default function App({ Component, pageProps, ssr }: AppProps & { ssr: any }) {
  return <Component {...pageProps} ssr={ssr} />
}


App.getInitialProps = async () => {
  try {
    const { data: ssr } = await axios.post(
      'http://localhost:3003/',
      {
        name: 'John',
        text: 'I was server side rendered'
      }
    );
    return { ssr };
  } catch (e) {
    console.error(e);
    return {};
  }
};