import React, { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../Styles/Login.css";
import toastr from "toastr";
import "toastr/build/toastr.css";
import { ThemeContext } from "../contexts/ThemeContext";

export const UserContext = React.createContext();

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormInvalid, setIsFormInvalid] = useState(false); // Add isFormInvalid state
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const { darkMode } = useContext(ThemeContext);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRecSenha = () => {
    navigate("/recuperarsenha");
  };

  const handleRegister = () => {
    navigate("/cadastro");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      toastr.warning("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUserEmail(userCredential.user.email);
      props.onLogin(userCredential.user.uid, userCredential.user.email);
      navigate("/");
    } catch (error) {
      const errorMessage =
        "Ocorreu um erro ao fazer login. Verifique suas credenciais.";
      setErrorMessage(errorMessage);
      toastr.error(errorMessage);
    }
  };

  return (
    <UserContext.Provider value={userEmail}>
      <div className={`login-body ${darkMode ? "dark-mode" : ""}`}>
        <div className="login-container">
          <div className="login-title">Bem-vindo(a)!</div>
          <form onSubmit={handleSubmit}>
            <div
              className={`form-group ${darkMode ? "dark-mode-element" : ""}`}
            >
              <input
                type="email"
                placeholder="example@gmail.com"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className={`input ${darkMode ? "dark-mode-element" : ""}`}
              />
            </div>
            <div
              className={`form-group ${darkMode ? "dark-mode-element" : ""}`}
            >
              <input
                type="password"
                placeholder="Digite sua senha"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className={`input ${darkMode ? "dark-mode-element" : ""}`}
              />
            </div>
            <div className="button-group">
              <button
                type="button"
                className={`log-in-btn pass ${
                  darkMode ? "dark-mode-element" : ""
                }`}
                onClick={handleRecSenha}
              >
                Recuperar senha
              </button>
              <button
                type="button"
                className={`log-in-btn register ${
                  darkMode ? "dark-mode-element" : ""
                }`}
                onClick={handleRegister}
              >
                Cadastre-se
              </button>
              <button
                type="submit"
                className={`log-in-btn enter ${
                  darkMode ? "dark-mode-element" : ""
                }`}
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </UserContext.Provider>
  );
}

export { Login };
