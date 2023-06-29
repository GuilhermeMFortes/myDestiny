import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CatalogoViagens from "./pages/CatalogoViagens";
import { Login, UserContext } from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Erro from "./pages/Erro";


function App() {
  const [logado, setLogado] = useState(false);
  const [localId, setLocalId] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  function handleLogin(userId, email) {
    setLogado(true);
    setLocalId(userId);
    setUserEmail(email);
  }

  function handleLogout() {
    setLogado(false);
    setLocalId(null);
    setUserEmail("");
  }

  return (
    <BrowserRouter>
      <Navbar logado={logado} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperarsenha" element={<RecuperarSenha />} />
        <Route path="/" element={<CatalogoViagens onLogout={handleLogout} />} />
        <Route
          path="/meus-pacotes"
          element={
            logado ? (
              <UserContext.Provider value={userEmail}>
              </UserContext.Provider>
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route path="/*" element={<Erro />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
