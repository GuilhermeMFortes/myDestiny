import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CatalogoViagens from "./pages/CatalogoViagens";
import { Login, UserContext } from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Erro from "./pages/Erro";
import MeusPacotes from "./pages/MeusPacotes";
import Pagamento from "./pages/Pagamento";
import { ThemeProvider } from "../src/contexts/ThemeContext";

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
    <ThemeProvider>
      <BrowserRouter>
        <Navbar logado={logado} onLogout={handleLogout} />
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperarsenha" element={<RecuperarSenha />} />
          <Route
            path="/"
            element={<CatalogoViagens onLogout={handleLogout} />}
          />
          <Route
            path="/meus-pacotes"
            element={
              logado ? (
                <UserContext.Provider value={userEmail}>
                  <MeusPacotes userId={localId} />
                </UserContext.Provider>
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route path="/pagamento" element={<Pagamento />} />
          <Route path="/*" element={<Erro />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
