import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Login.css';

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRecSenha = (event) => {
    navigate("/RecuperarSenha");
  };

  const handleRegister = (event) => {
    navigate("/Cadastro");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.onLogin(email, password);
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-title">Bem vindo(a)!</div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="digite sua senha"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>

        <div className="button-group">
          <button className="log-in-btn-pass" onClick={handleRecSenha}>
            Recuperar senha
          </button>
          <button className="log-in-btn-register" onClick={handleRegister}>
            Cadastre-se
          </button>
          <button className="log-in-btn-enter" onClick={handleSubmit}>
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;