import React, { useState, useContext } from "react";
import "../Styles/Cadastro.css";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import toastr from "toastr";
import "toastr/build/toastr.css";
import { ThemeContext } from "../contexts/ThemeContext";

function Cadastro() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  const signUp = (event) => {
    event.preventDefault();
    setIsFormInvalid(false);
    setErro("");

    if (!email || !senha) {
      setIsFormInvalid(true);
      toastr.warning("Por favor, preencha todos os campos.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        console.log(userCredential);
        navigate("/Login");
      })
      .catch((error) => {
        console.log(error);
        setIsFormInvalid(true);
        setErro(
          "Verifique se o usuário já existe ou se os dados estão corretos."
        );
        toastr.error(erro);
      });
  };

  const handleNomeChange = (event) => {
    setNome(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSenhaChange = (event) => {
    setSenha(event.target.value);
  };

  const handleLogin = (event) => {
    navigate("/Login");
  };

  const handleEsqueceuSenha = (event) => {
    navigate("/recuperarsenha");
  };

  return (
    <div className={`cadastro-body ${darkMode ? "dark-mode" : ""}`}>
      <div
        className={`cadastro-container ${darkMode ? "dark-mode-card" : ""} ${
          darkMode ? "dark-mode-element" : ""
        }`}
      >
        <div className="cadastro-title">Criar conta</div>
        <div className="form-container">
          <form onSubmit={signUp}>
            <div className="form-group">
              <input
                type="email"
                placeholder="exemplo@email.com"
                id="email"
                value={email}
                className={`input ${darkMode ? "dark-mode-element" : ""}`}
                onChange={handleEmailChange}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className={`input ${darkMode ? "dark-mode-element" : ""}`}
                placeholder="Digite sua senha"
                id="senha"
                value={senha}
                onChange={handleSenhaChange}
              />
              {erro && <div className="error-message">{erro}</div>}
            </div>
            <div className="button-group">
              <button
                className={`btn-cadastrar ${
                  darkMode ? "dark-mode-element" : ""
                }`}
                type="submit"
              >
                Cadastrar
              </button>
              <button
                className={`btn-voltar ${darkMode ? "dark-mode-element" : ""}`}
                onClick={handleLogin}
              >
                Voltar
              </button>
            </div>
          </form>
          <div>
            <button
              className={`btn-recuperar-senha ${
                darkMode ? "dark-mode-element" : ""
              }`}
              onClick={handleEsqueceuSenha}
            >
              Esqueceu a senha?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
