import React, { useState } from 'react';
import '../Styles/CatalogoViagens.css';
import { useNavigate } from 'react-router-dom';

const DESTINOS = [
  {
    id: 1,
    nome: 'Praia do Rosa',
    descricao: 'Lugar paradisíaco para relaxar e curtir o mar',
    preco: 1000,
    imagem: 'https://th.bing.com/th/id/OIP.ufzRgn_XU938LrGgnKJJ-QHaE7?pid=ImgDet&rs=1https://th.bing.com/th/id/OIP.ufzRgn_XU938LrGgnKJJ-QHaE7?pid=ImgDet&rs=1'
  },
  {
    id: 2,
    nome: 'Canela',
    descricao: 'Cidade encantadora com belas paisagens naturais',
    preco: 800,
    imagem: 'https://i1.wp.com/www.destinosimperdiveis.com.br/wp-content/uploads/2019/06/di_catedral_de_pedra01.jpg?resize=1194%2C896'
  },
  {
    id: 3,
    nome: 'Buenos Aires',
    descricao: 'Capital argentina com muita história e cultura',
    preco: 1200,
    imagem: 'https://th.bing.com/th/id/R.4f39bcd4e4e1b363d0d7b9169776091b?rik=lr0xsBRfOXVsdg&pid=ImgRaw&r=0'
  },
  {
    id: 4,
    nome: 'Santiago',
    descricao: 'Capital chilena com muitos atrativos turísticos',
    preco: 1500,
    imagem: 'https://th.bing.com/th/id/R.d6b76a90877a13d6a13d86075e302025?rik=oO1V%2fBBbMgLNOg&pid=ImgRaw&r=0'
  }
];

function CatalogoViagens(props) {
  const [destinos] = useState(DESTINOS);
  const navigate = useNavigate()
  function handleClick(event) {
    props.onLogout(event)
    navigate('/login')
  }

  return (
    <div>
    <div>
    <div className='logout-container'><button className='logout-button' onClick={handleClick}>Sair</button></div>
      <div className='catalogo-title'>Catalogo de Viagens</div>
      </div>
      <div className="destinos-container">
        {destinos.map((destino) => (
          <div className="destino-card" key={destino.id}>
            <img className="destino-card-img" src={destino.imagem} alt={destino.nome} />
            <h2 className="destino-card-title">{destino.nome}</h2>
            <p className="destino-card-desc">{destino.descricao}</p>
            <p className="destino-card-price">Preço: R$ {destino.preco}</p>
            <button className="destino-card-btn">Comprar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CatalogoViagens;
