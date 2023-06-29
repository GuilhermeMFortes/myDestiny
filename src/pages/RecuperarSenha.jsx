import React, { useState } from 'react';
import '../Styles/RecuperarSenha.css';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from "../firebase";
import toastr from "toastr";
import "toastr/build/toastr.css";

function RecuperarSenha(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
        setSuccessMessage("E-mail de recuperação de senha enviado com sucesso.");
      })
      .catch((error) => {
        console.log(error);
        toastr.error("Ocorreu um erro ao enviar o e-mail de recuperação de senha.");
        setError("Ocorreu um erro ao enviar o e-mail de recuperação de senha.");
      });
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="recuperar-senha-container">
      <div className="card">
        <div className="rec-title">Recuperação de senha</div>
        <form>
          <div className="form-group">
            <label htmlFor="email">E-mail:</label>
            <input type="email" placeholder="example@email.com" id="email" name="email" value={email} onChange={handleEmailChange} />
          </div>
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          <div className="button-group">
          <button className="btn-voltar" onClick={handleLogin}>
              Voltar
            </button>
            <button className="btn-enviar-senha" onClick={handleEnviarSenha}>
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecuperarSenha;