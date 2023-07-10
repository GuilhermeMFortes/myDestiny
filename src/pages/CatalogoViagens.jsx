import React, { useState, useEffect, useContext } from "react";
import toastr from "toastr";
import "toastr/build/toastr.css";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
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
import { ThemeContext } from "../contexts/ThemeContext";
import { LoginContext } from "../contexts/LoginContext";

function CatalogoViagens() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [numQuartos, setNumQuartos] = useState(1);
  const [numHospedes, setNumHospedes] = useState(1);
  const [imageUrls, setImageUrls] = useState([]);
  const [users, setUsers] = useState([]);
  const storage = getStorage();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(LoginContext);

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

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
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
      let q = query(pacotesCollectionRef);

      if (searchTerm !== "") {
        q = query(
          pacotesCollectionRef,
          where("keywords", "array-contains", searchTerm)
        );
      }

      if (dateRange[0] && dateRange[1]) {
        const startDate = dateRange[0];
        const endDate = dateRange[1];

        q = query(
          pacotesCollectionRef,
          where("DataViagem", ">=", startDate),
          where("DataViagem", "<=", endDate)
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
    if (!user) {
      // Redirecionar para a página de login se o usuário não estiver logado
      navigate("/login");
      return;
    }
  
    try {
      const userEmail = user.email;
  
      // Verificar se o usuário já possui o pacote com o ID especificado
      const pagamentosRef = collection(db, "pagamentos");
      const q = query(
        pagamentosRef,
        where("pacoteId", "==", id),
        where("email", "==", userEmail)
      );
      const pagamentosDocs = await getDocs(q);
  
      if (!pagamentosDocs.empty) {
        toastr.warning("Esse pacote já foi adquirido pelo usuário.");
        console.log("Esse pacote já foi adquirido pelo usuário.");
        return;
      }
  
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
    <div className={`catalogo-container ${darkMode ? "dark-mode" : ""}`}>
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
          <div className="date-range-container">
            <DatePicker
              className="date-picker"
              selected={dateRange[0]}
              onChange={(date) => handleDateRangeChange([date, dateRange[1]])}
              selectsStart
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              placeholderText="Data inicial"
              dateFormat="dd/MM/yyyy"
              isClearable
            />
            <DatePicker
              className="date-picker"
              selected={dateRange[1]}
              onChange={(date) => handleDateRangeChange([dateRange[0], date])}
              selectsEnd
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              minDate={dateRange[0]}
              placeholderText="Data final"
              dateFormat="dd/MM/yyyy"
              isClearable
            />
          </div>
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
              <h2
                className={`destino-card-title ${darkMode ? "dark-mode" : ""}`}
              >
                {user.Nome}
              </h2>
              <p className={`destino-card-desc ${darkMode ? "dark-mode" : ""}`}>
                {user.Descricao}
              </p>
              <p
                className={`destino-card-price ${darkMode ? "dark-mode" : ""}`}
              >
                Preço: R$ {user.Preco}
              </p>
              <p className={`destino-card-date ${darkMode ? "dark-mode" : ""}`}>
                Data:{" "}
                {format(new Date(user.DataViagem.seconds * 1000), "dd/MM/yyyy")}
              </p>
              <button
                className={`destino-card-btn ${darkMode ? "dark-mode" : ""}`}
                onClick={() => handleBuyPackage(user.id)}
              >
                Comprar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CatalogoViagens;
