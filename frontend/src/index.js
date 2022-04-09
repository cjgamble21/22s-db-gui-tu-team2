import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
    <BrowserRouter>
        <AuthProvider>
            <App />
        </AuthProvider>,
    </BrowserRouter>,
    document.getElementById('root'));
