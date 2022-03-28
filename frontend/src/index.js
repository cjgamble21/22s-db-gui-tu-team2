import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route path="/*" element={<App />} />
            </Routes>
        </AuthProvider>
    </BrowserRouter>,
    document.getElementById('root'));
