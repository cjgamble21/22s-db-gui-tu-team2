import React, { useState, useMemo } from 'react';
import './App.css';
import Login from './Login'
import Home from './Home'
import axios from 'axios';
import { ReactDOM } from 'react-dom';

// React functional component
const App = () => {
  // User object will be in the global context so every component can access it
  const [user, setUser] = useState(null);

  // This ensures that userValue will change only when the user or setUser values change
  const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  // ENTER YOUR EC2 PUBLIC IP/URL HERE
  const ec2_url = ''
  // CHANGE THIS TO TRUE IF HOSTING ON EC2, MAKE SURE TO ADD IP/URL ABOVE
  const ec2 = false;
  // USE localhost OR ec2_url ACCORDING TO ENVIRONMENT
  const url = ec2 ? ec2_url : 'localhost'

  return (
    <div className="App">
      {/* <header className="App-header"> */}
      <Login />
      {/* </header> */}
    </div>
  );
}

export default App;
