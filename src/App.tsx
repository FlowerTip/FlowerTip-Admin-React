import React from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './router';

const App: React.FC = () => {
  const element = useRoutes(routes);
  return (
    <div>
      {element}
    </div>
  );
};

export default App;