import React from 'react';
import '../Styles/Erro.css';

function Erro() {
  return (
    <div className="error-container">
      <h1 className="error-title">Página não encontrada</h1>
      <p className="error-message">
        Desculpe, a página que você solicitou não pode ser encontrada.
        Verifique o URL ou visite nossa página inicial.
      </p>
      <a href="/" className="error-link">Voltar para a página inicial</a>
    </div>
  );
}

export default Erro;
