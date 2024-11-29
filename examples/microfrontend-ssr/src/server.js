import fractal from '@couds/fractal-core/server';
import Component from './component';

fractal(Component, {
  publicPath: true,
  transformProps: async (props) => {
    return {
      ...props,
      name: props.name ? `${props.name} Doe` : 'visitor',
    };
  }
})