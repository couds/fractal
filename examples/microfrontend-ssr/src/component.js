import React, { useContext } from 'react';
import './index.css';

const DummyContext = React.createContext({ dummy: true });

const Component = ({ name, text = '', onClick = () => alert(`Hello ${name}`), Context = DummyContext }) => {
  const context = useContext(Context);
  return (
    <div className='mf-hello-ssr '>
      Hello <b onClick={onClick}>{name}</b>, {text}
      <code style={{ textAlign: 'left' }}>
        <pre>{JSON.stringify(context, null, 2)}</pre>
      </code>
    </div>
  );
};

export default Component;
