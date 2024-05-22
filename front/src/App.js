import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from './pages/Home';
import Dashboard from "./pages/Dashboard";
import Edit from "./pages/Edit";
import Settings from "./pages/Settings";
import Statistics from "./pages/Statistics";
import Portfolio from "./pages/Portfolio";
import './styles/index.css';
import './styles/normalize.css'
import {  } from "./common";
import ErrorPage from "./pages/Error";
import ResetPassword from "./pages/ResetPassword";

function App() {  

  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
        <Route path='/edit' element={<Edit/>}></Route>
        <Route path='/portfolio/:id' element={<Portfolio/>}></Route>
        <Route path='/portfolio' element={<Portfolio/>}></Route>
        <Route path='/settings' element={<Settings/>}></Route>
        <Route path='/statistics' element={<Statistics/>}></Route>
        <Route path='*' element={<ErrorPage/>}></Route>
        <Route path='/reset-password/:token' element={<ResetPassword/>}></Route> 
      </Routes>
    </BrowserRouter>
  );
}
export default App;
