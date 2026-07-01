import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoadingBar from "react-top-loading-bar";
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Products from './components/Products';
import Transaction from './components/Transaction';
import "./style.css"

function App() {
  
  const [prog, setProg] = useState(0);

  const updateProgress = (value) => {
    setProg(value);
  };

  return (
    <>
      <Navbar />
      <LoadingBar color="#98b8d8ff" progress={prog} height={3}/>

      <Routes>
        <Route path="/" element={<Dashboard progress={updateProgress} />} />
        <Route path="/products" element={<Products progress={updateProgress} />} />
        <Route path="/transaction" element={<Transaction progress={updateProgress} />} />


        <Route path='*' element={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><p>404 Page not found</p></div>} />
      </Routes>
    </>
  );
}

export default App;
