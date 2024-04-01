import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


import Signup from './Signup.jsx';
import Login from './Login.jsx';
import Home from './Home.jsx';
import Welcome from './Welcome.jsx';
import Protected from './Protected.jsx';

import { useSelector } from 'react-redux';

function App() {
    const isSignedIn = useSelector((state) => state.user);
    console.log(isSignedIn);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Protected isSignedIn={isSignedIn.isLoggedIn}><Home /></Protected>} />
            </Routes>
        </BrowserRouter>
    )
    
}

export default App
