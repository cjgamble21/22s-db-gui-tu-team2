import './App.css';
import Login from './components/Login/Login'
import Register from './components/Registration/Register'
import Profile from './components/Profile'
import { Outlet, Routes, Route } from 'react-router-dom';
import { RequireAuth } from './RequireAuth';

// React functional component
const App = () => {
  // ENTER YOUR EC2 PUBLIC IP/URL HERE
  const ec2_url = ''
  // CHANGE THIS TO TRUE IF HOSTING ON EC2, MAKE SURE TO ADD IP/URL ABOVE
  const ec2 = false;
  // USE localhost OR ec2_url ACCORDING TO ENVIRONMENT
  const url = ec2 ? ec2_url : 'localhost';

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Outlet />}>

          {/* Protected routes */}
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Profile />} />
          </Route>

          {/* Public routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </div >
  );
}

export default App;
