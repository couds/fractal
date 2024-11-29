import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';

const fractal = (Component, { name }) => {
  let id;
  window._FRACTAL = window._FRACTAL || {};
  try {
    const params = new URLSearchParams(new URL(document.currentScript.src).search);
    id = params.get('id') || name;
  } catch {
    id = name;
  }

  if (!id) {
    console.error('The fractal MF must have a name or identifier');
    return;
  }

  if (window._FRACTAL[id]) {
    console.warn(`${id} MF already exists.`);
    return;
  }
  const factory = async ({ container, initialState = {} }) => {
    const methods = {
      name,
      container,
      update: (detail) => {
        container.dispatchEvent(new CustomEvent('update', { detail }));
      },
    };

    if (container.dataset.mfLoaded) {
      return methods;
    }
    const ready = () => {
      container.dispatchEvent(new CustomEvent('mf-ready', { detail: methods }));
    };

    const HoCComponent = () => {
      const [props, setProps] = useState(initialState);
      const ref = useRef(container);
      useEffect(() => {
        const updateProps = ({ detail }) => {
          setProps(detail);
        };
        container.addEventListener('update', updateProps);
        return () => {
          container.removeEventListener('update', updateProps);
        };
      }, []);
      return <Component {...props} root={ref} />;
    };
    HoCComponent.displayName = `fractal(${Component.displayName || Component.name || 'Component'})`;

    const hasSSR = !!container.innerHTML;

    // TODO: Check react version  root >= 18 to use and for < 18 render/hydratate
    if (!hasSSR) {
      const root = ReactDOM.createRoot(container);
      root.render(<HoCComponent />);
    } else {
      ReactDOM.hydrateRoot(container, <HoCComponent />);
    }
    // eslint-disable-next-line no-param-reassign
    container.dataset.mfLoaded = true;
    ready();
    return methods;
  };

  factory.Component = Component;
  window._FRACTAL[id] = factory;

  window.dispatchEvent(new CustomEvent(`mf-${id}`, { detail: { run: window._FRACTAL[id] } }));
};

export default fractal;
