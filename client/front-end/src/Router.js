import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/layout/Navbar';
import Register from './components/auth/Register';

export default function Router() {
  return (
    <BrowserRouter>
        <Navbar />
        <Routes>
            <Route exact path='/' />
            <Route exact path='/register' Component={Register} />
            <Route exact  path='/login' />
            <Route exact path='/customer' />
        </Routes>
    </BrowserRouter>
  );
}
