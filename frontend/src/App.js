import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';

// Components and Pages
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

// import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (

   <div style={{minHeight : "100vh",display:"flex",flexDirection:"column"}}>
      <Header/>
      <main style={{flex:"1"}}>
          <Outlet/>
      </main>
      <Footer/>
   </div>
  );
}

export default App;