import React from 'react';
import { Outlet } from 'react-router-dom';


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