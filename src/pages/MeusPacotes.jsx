import React, { useEffect, useState, useContext } from "react";
import { format } from "date-fns";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { LoginContext } from "../contexts/LoginContext";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import "../Styles/MeusPacotes.css";

function MyPackagesPage() {
  const [pacotesComprados, setPacotesComprados] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const { user } = useContext(LoginContext); // Acessar o valor 'user' do contexto
  const storage = getStorage();

  useEffect(() => {
    const getPacotesComprados = async () => {
      try {
        const pacotesCompradosCollectionRef = collection(db, "pagamentos");

        const q = query(
          pacotesCompradosCollectionRef,
          where("email", "==", user.email) // Acessar a propriedade 'email' do usuário
        );
        const pacotesCompradosData = await getDocs(q);
        const pacotesComprados = [];

        for (const docSnap of pacotesCompradosData.docs) {
          const pacoteId = docSnap.data().pacoteId;
          const pacoteDocRef = doc(db, "pacotes", pacoteId);
          const pacoteDocSnap = await getDoc(pacoteDocRef);
          if (pacoteDocSnap.exists()) {
            pacotesComprados.push(pacoteDocSnap.data());
          }
        }

        setPacotesComprados(pacotesComprados);
      } catch (error) {
        console.error("Erro ao buscar os pacotes comprados:", error);
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

    getPacotesComprados();
    getImageUrls();
  }, [user, storage]);

  return (
    <div className="meus-pacotes-container">
      <h2 className="meus-pacotes-title">Meus Pacotes</h2>
      {pacotesComprados.length === 0 ? (
        <div className="message-container message-border">
          <div className="meus-pacotes-message">
            <p>Nenhum pacote comprado encontrado.</p>
            <p>Confira nossos pacotes disponíveis e aproveite!</p>
            <p>Explore destinos incríveis pelo melhor preço.</p>
          </div>
        </div>
      ) : (
        <div className="container border">
          <div className="my-packages-container">
            <div className="destinos-container">
              {pacotesComprados.map((pacote, index) => (
                <div className="destino-card" key={index}>
                  <img
                    className="destino-img"
                    src={imageUrls[index]}
                    alt="Destino"
                  />
                  <div className="destino-info">
                    <h3 className="destino-title">{pacote.Nome}</h3>
                    <p className="destino-description">{pacote.Descricao}</p>
                    <p className="destino-preco">Preço: R$ {pacote.Preco}</p>
                    <p className="destino-date">
                      Data:{" "}
                      {format(
                        new Date(pacote.DataViagem.seconds * 1000),
                        "dd/MM/yyyy"
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPackagesPage;
