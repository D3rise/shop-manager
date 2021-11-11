import React from "react";
import { Routes, Route } from "react-router-dom";
import { About } from "./pages/about/about.component";
import { Header } from "./components/header/header.component";
import { Home } from "./pages/home/home.component";
import { Login } from "./pages/login/login.component";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </div>
  );
}

export default App;
