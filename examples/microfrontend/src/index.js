import React  from 'react';
import fractal from '@couds/fractal-core';
import './index.css';

const Component = ({ name }) => {
  const [state, setState] = React.useState(name);
  return (
    <div className='mf-hello'>
      Hello <b>{state}</b>!
      <input value={state} onChange={(evt) => {
        setState(evt.target.value);
        console.log(evt.target.value)
      }} />
    </div>
  );
};


fractal(Component, { name: 'hello' });


