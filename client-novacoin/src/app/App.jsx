import { useState } from 'react'
import heroImg from '../assets/img/hero.png'

// ❌ NO importar BrowserRouter aquí
import { Routes, Route } from "react-router-dom";

import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";
import Recover from "../features/auth/pages/Recover.jsx";

function App() {
  const [count, setCount] = useState(0)

  const Home = () => (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} width="170" height="179" alt="" />
        </div>
        <h1>Home</h1>
      </section>
    </>
  );

  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recover" element={<Recover />} />
      <Route path="/home" element={<Home />} />

    </Routes>
  )
}

export default App