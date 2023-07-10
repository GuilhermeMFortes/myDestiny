import React, { useState } from "react";
import "../Styles/RecuperarSenha.css";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import toastr from "toastr";
import "toastr/build/toastr.css";

function RecuperarSenha(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleLogin = (event) => {
    navigate("/Login");
  };

  const handleEnviarSenha = (event) => {
    event.preventDefault();
    if (!email) {
      toastr.warning("Por favor, insira um e-mail válido.");
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toastr.success("E-mail de recuperação de senha enviado com sucesso.");
        setSuccessMessage(
          "E-mail de recuperação de senha enviado com sucesso."
        );
      })
      .catch((error) => {
        console.log(error);
        toastr.error(
          "Ocorreu um erro ao enviar o e-mail de recuperação de senha."
        );
        setError("Ocorreu um erro ao enviar o e-mail de recuperação de senha.");
      });
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError("");
    setSuccessMessage("");
  };

  return (
    <div className={`recuperar-senha-body ${darkMode ? "dark-mode" : ""}`}>
      <div className={`card ${darkMode ? "dark-mode-card" : ""}`}>
        <div className="rec-title">Recuperação de senha</div>
        <form>
          <div className="form-group">
            <input
              type="email"
              placeholder="example@email.com"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              className={`input ${darkMode ? "dark-mode-element" : ""}`}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          <div className="button-group">
            <button
              className={`btn-enviar-senha ${
                darkMode ? "dark-mode-element" : ""
              }`}
              onClick={handleEnviarSenha}
            >
              Enviar
            </button>
            <button
              className={`btn-voltar ${darkMode ? "dark-mode-element" : ""}`}
              onClick={handleLogin}
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecuperarSenha;
