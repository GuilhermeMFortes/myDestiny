import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "../Styles/CatalogoViagens.css";
import "react-datepicker/dist/react-datepicker.css";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc as docRef,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

function CatalogoViagens() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [numQuartos, setNumQuartos] = useState(1);
  const [numHospedes, setNumHospedes] = useState(1);
  const [imageUrls, setImageUrls] = useState([]);
  const [users, setUsers] = useState([]);
  const storage = getStorage();
  const navigate = useNavigate();

  useEffect(() => {
    const getPacotesData = async () => {
      try {
        const pacotesCollectionRef = collection(db, "pacotes");
        const pacotesData = await getDocs(pacotesCollectionRef);
        const pacotes = pacotesData.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setUsers(pacotes);
      } catch (error) {
        console.error("Erro ao buscar os pacotes:", error);
      }
    };

    const getImageUrls = async () => {
      try {
        const imagens = [
          "buenos-aires.jpg",
          "canela.jpg",
          "santiago.jpg",
          "praia-do-rosa.jpg",
        ];
        const urls = await Promise.all(
          imagens.map(async (imagem) => {
            const imagemRef = ref(storage, `imagem/${imagem}`);
            return await getDownloadURL(imagemRef);
          })
        );

        setImageUrls(urls);
      } catch (error) {
        console.error("Erro ao buscar as imagens:", error);
      }
    };

    getPacotesData();
    getImageUrls();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleNumQuartosChange = (event) => {
    setNumQuartos(event.target.value);
  };

  const handleNumHospedesChange = (event) => {
    setNumHospedes(event.target.value);
  };

  const handleSearchSubmit = async () => {
    try {
      const pacotesCollectionRef = collection(db, "pacotes");
      let q;
      if (searchTerm === "") {
        q = query(pacotesCollectionRef);
      } else {
        q = query(
          pacotesCollectionRef,
          where("keywords", "array-contains", searchTerm)
        );
      }
      const pacotesData = await getDocs(q);
      const pacotes = pacotesData.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setUsers(pacotes);
    } catch (error) {
      console.error("Erro ao buscar os pacotes:", error);
    }
  };

  const handleBuyPackage = async (id) => {
    try {
      // Redirecionar para a página de pagamento com o ID da compra como parâmetro na URL
      navigate(`/pagamento?compraId=${id}`);
    } catch (error) {
      console.error("Erro ao comprar o pacote:", error);
    }
  };

  const updateKeywords = async () => {
    try {
      const pacotesCollectionRef = collection(db, "pacotes");
      const pacotesData = await getDocs(pacotesCollectionRef);
      pacotesData.docs.forEach(async (doc) => {
        const data = doc.data();
        const nome = data.Nome;
        const keywords = nome.split(" ");
        await updateDoc(docRef(db, "pacotes", doc.id), {
          keywords: keywords,
        });
      });
    } catch (error) {
      console.error("Erro ao atualizar as palavras-chave:", error);
    }
  };

  useEffect(() => {
    updateKeywords();
  }, []);

  return (
    <div className="container border-catalogo">
      <div className="catalogo-title">Catálogo de Viagens</div>
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Vai para onde?"
          value={searchTerm}
          onChange={handleSearch}
        />
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          placeholderText="Selecione a data"
          dateFormat="dd/MM/yyyy"
          className="datepicker-input"
        />
        <select
          value={numQuartos}
          onChange={handleNumQuartosChange}
          className="select-input"
        >
          <option value={1}>1 quarto</option>
          <option value={2}>2 quartos</option>
          <option value={3}>3 quartos</option>
        </select>
        <select
          value={numHospedes}
          onChange={handleNumHospedesChange}
          className="select-input"
        >
          <option value={1}>1 hóspede</option>
          <option value={2}>2 hóspedes</option>
          <option value={3}>3 hóspedes</option>
        </select>
        <button
          className="search-button"
          onClick={handleSearchSubmit}
          style={{ backgroundColor: "#023e73" }}
        >
          Pesquisar
        </button>
      </div>
      <div className="destinos-container">
        {users.map((user, index) => (
          <div className="destino-card" key={user.id}>
            <img
              className="destino-card-img"
              src={imageUrls[index]}
              alt={`Imagem ${index}`}
            />
            <h2 className="destino-card-title">Nome: {user.Nome}</h2>
            <p className="destino-card-desc">Descrição: {user.Descricao}</p>
            <p className="destino-card-price">Preço: R$ {user.Preco}</p>
            <button
              className="destino-card-btn"
              onClick={() => handleBuyPackage(user.id)}
            >
              Comprar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CatalogoViagens;
