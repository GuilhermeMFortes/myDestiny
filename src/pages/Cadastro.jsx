import React, { useState } from 'react';
import '../Styles/Cadastro.css';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../firebase";
import toastr from "toastr";
import "toastr/build/toastr.css";

function Cadastro(props) {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [isFormInvalid, setIsFormInvalid] = useState(false); // Add isFormInvalid state

  const signUp = (event) => {
    event.preventDefault();
    setIsFormInvalid(false); // Reset isFormInvalid state
    setErro(''); // Limpar mensagem de erro ao tentar cadastrar novamente

    if (!email || !senha) {
      // Check if any field is empty
      setIsFormInvalid(true);
      toastr.warning("Por favor, preencha todos os campos."); // Show toastr warning
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
        setErro('Verifique se o usuário já existe ou se os dados estão corretos.');
        toastr.error(erro); // Show toastr error
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
    <div className="cadastro-body">
      <div className="cadastro-container">
        <div className="cadastro-title">Criar conta</div>
        <div className="form-container">
          <form onSubmit={signUp}>
            <div className="form-group">
              <label htmlFor="email">E-mail:</label>
              <input type="email" placeholder="exemplo@email.com" id="email" value={email} onChange={handleEmailChange} />
            </div>
            <div className="form-group">
              <label htmlFor="senha">Senha:</label>
              <input type="password" placeholder="Digite sua senha" id="senha" value={senha} onChange={handleSenhaChange} />
              {erro && <div className="error-message">{erro}</div>}
            </div>
            <div className="button-group">
            <button className="btn-voltar" onClick={handleLogin}>
                Voltar
              </button>
              <button className="btn-cadastrar" type="submit">
                Cadastrar
              </button>
            </div>
          </form>
          <div>
            <button className="btn-recuperar-senha" onClick={handleEsqueceuSenha}>
              Esqueceu a senha?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
