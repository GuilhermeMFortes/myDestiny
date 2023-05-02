import React, { useState } from 'react';
import '../Styles/Cadastro.css'
import { useNavigate } from 'react-router-dom';

function Cadastro(props) {
  const navigate = useNavigate()
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

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
    navigate("/Login")
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aqui você pode enviar os dados do formulário para a API, por exemplo.
    console.log('Nome: ', nome);
    console.log('Email: ', email);
    console.log('Senha: ', senha);
  };

  return (
    <div className='body'>
    <div className='register-title'>Cadastro</div>
    <div>
       <form onSubmit={handleSubmit}>
    <div className='form-group'>        
      <label htmlFor="nome">Nome:</label>
      <input type="text" placeholder='digite seu nome' id="nome" value={nome} onChange={handleNomeChange} />
    </div>    
    <div className='form-group'>
        <label htmlFor="email">E-mail:</label>
        <input type="email" placeholder='example@email.com' id="email" value={email} onChange={handleEmailChange} />
    </div>
    <div  className='form-group'>
        <label htmlFor="senha">Senha:</label>
        <input type="password" placeholder='digite sua senha' id="senha" value={senha} onChange={handleSenhaChange} />
    </div>
        </form>
    </div>

    <div>
        <button className='btn-cadastrar' onClick={handleLogin}>Cadastrar</button>
        <button className="btn-voltar" onClick={handleLogin}>Voltar</button>
    </div>

    </div>
  );
}

export default Cadastro;
