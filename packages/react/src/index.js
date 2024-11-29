/* eslint-disable react/no-danger */
/* eslint-disable react/destructuring-assignment */
import React, { forwardRef, useEffect, useRef, useState } from 'react';

const dummyFunc = () => {
  return null;
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidCatch(error) {
    this.props.onError(error);
  }

  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return <h1>{this.state.error.message}</h1>;
    }

    return this.props.children;
  }
}

/**
 * Used as fallback for id and name if not defined on the fractal component
 * @param {string} script Script URL
 * @returns {string} Name of the script
 */
const getFallbackFromScript = (script) => {
  return script.split('/').pop().split('.').shift();
};

/**
 * @type {import('.').fractalComponentType}
 */
const fractal = forwardRef(({ _setup, ...initialState }, ref) => {
  const {
    script,
    id = getFallbackFromScript(script),
    name = getFallbackFromScript(script),
    markup,
    onLoad = dummyFunc,
    onError = dummyFunc,
    mount,
  } = _setup;
  const selectorId = `container-${name}`;
  const [instance, setInstance] = useState(undefined);
  const [scriptLoaded, setScriptLoader] = useState(false);

  // We need this to startup the MF only once due the initial state object change on every render
  const staticState = useRef(initialState);

  // infer css filename
  const styleHref = script.replace(/(-frameworkless)?\.js$/, '.css');

  // Load remote script if need it (when SSR is enabled the styles need to be load by the main app server to avoid CLS)
  useEffect(() => {
    const src = `${script}?id=${id}`;
    let elem = document.querySelector(`script[src="${src}"]`);
    if (!elem) {
      elem = document.createElement('script');
      elem.setAttribute('src', src);
      elem.setAttribute('async', '');
      document.head.appendChild(elem);
    }

    if (!document.querySelector(`link[href="${styleHref}"]`)) {
      const styles = document.createElement('link');
      styles.href = styleHref;
      styles.rel = 'stylesheet';
      document.head.appendChild(styles);
    }
  }, [script, id, styleHref]);

  // once the script is loaded instance MF
  useEffect(() => {
    window._FRACTAL = window._FRACTAL || {};
    const initMF = () => {
      setScriptLoader(true);
    };
    if (window._FRACTAL[id]) {
      initMF();
      return undefined;
    }
    window.addEventListener(`mf-${id}`, initMF);
    return () => {
      window.removeEventListener(`mf-${id}`, initMF);
    };
  }, [id]);

  useEffect(() => {
    if (instance || !scriptLoaded || mount) {
      return;
    }
    const selector = `#${selectorId}`;
    const container = document.querySelector(selector);
    window._FRACTAL[id]({
      container,
      initialState: staticState.current,
    }).then(setInstance);
  }, [selectorId, id, scriptLoaded, mount, instance]);

  // when MF instanciated store it on window and call onLoad
  useEffect(() => {
    if (!instance) {
      return;
    }
    window._FRACTAL_INSTANCES = window._FRACTAL_INSTANCES || {};
    window._FRACTAL_INSTANCES[name || id] = instance;
    onLoad(instance);
  }, [name, id, onLoad, instance]);

  // when props change, update the props of MF using the update event
  useEffect(() => {
    if (!instance || mount) {
      return;
    }
    instance.update(initialState);
  }, [instance, initialState, mount]);

  let Component;
  if (mount && scriptLoaded) {
    Component = window._FRACTAL[id].Component;
  }

  useEffect(() => {
    if (!Component) {
      return;
    }
    onLoad?.(null);
  }, [Component, onLoad]);

  return (
    <ErrorBoundary onError={onError}>
      <div ref={ref} id={selectorId} dangerouslySetInnerHTML={markup && !Component ? { __html: markup } : undefined}>
        {Component ? <Component {...initialState} root={ref} /> : undefined}
      </div>
    </ErrorBoundary>
  );
});

fractal.displayName = 'fractal';
fractal.polyfill = (poly) => {
  if (typeof window !== 'undefined') {
    Object.entries(poly).forEach(([key, value]) => {
      window[key] = window[key] || value;
    });
  }
};

export default fractal;
