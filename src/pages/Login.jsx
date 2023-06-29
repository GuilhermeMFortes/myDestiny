import React, { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../Styles/Login.css";
import toastr from "toastr";
import "toastr/build/toastr.css";

export const UserContext = React.createContext();

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormInvalid, setIsFormInvalid] = useState(false); // Add isFormInvalid state
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

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
    setIsFormInvalid(false); // Reset isFormInvalid state
    setErrorMessage("");

    if (!email || !password) {
      // Check if any field is empty
      setIsFormInvalid(true);
      toastr.warning("Por favor, preencha todos os campos."); // Show toastr warning
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
      setIsFormInvalid(true);
      setErrorMessage("Ocorreu um erro ao fazer login. Verifique suas credenciais.");
      toastr.error(errorMessage); // Show toastr error
    }
  };

  return (
    <UserContext.Provider value={userEmail}>
      <div className="login-body">
        <div className="login-container">
          <div className="login-title">Bem-vindo(a)!</div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className="input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                placeholder="Digite sua senha"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="input"
              />
            </div>

            <div className="button-group">
              <button
                type="button"
                className="log-in-btn pass"
                onClick={handleRecSenha}
              >
                Recuperar senha
              </button>
              <button
                type="button"
                className="log-in-btn register"
                onClick={handleRegister}
              >
                Cadastre-se
              </button>
              <button type="submit" className="log-in-btn enter">
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