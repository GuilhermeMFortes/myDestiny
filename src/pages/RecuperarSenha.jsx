import React from 'react';
import '../Styles/RecuperarSenha.css';
import { useNavigate } from 'react-router-dom';

function RecuperarSenha(props) {
  const navigate = useNavigate();

  const handleLogin = (event) => {
    navigate("/Login");
  };

  return (
    <div className="recuperar-senha-container">
      <div className="rec-title">Recuperação de senha</div>
      <form>
        <div className="form-group">
          <label htmlFor="email">E-mail:</label>
          <input type="email" placeholder="example@email.com" id="email" name="email" />
        </div>
        <div className="button-group">
          <button className="btn-enviar-senha" onClick={handleLogin}>
            Enviar
          </button>
          <button className="btn-voltar" onClick={handleLogin}>
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}

export default RecuperarSenha;
