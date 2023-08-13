import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route } from 'react-router-dom';


import Newtab from './Newtab';
import './index.css';

const App = () => {
    return (
      <Router>
        <Route path="/" exact component={Newtab} />
        {/* other routes if needed */}
      </Router>
    );
  };
  

const container = document.getElementById('app-container');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Newtab />);
