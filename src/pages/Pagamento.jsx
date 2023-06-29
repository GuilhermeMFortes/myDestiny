import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, addDoc, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../Styles/Pagamento.css";
import toastr from "toastr";
import "toastr/build/toastr.css";

const Pagamento = () => {
  const [formValues, setFormValues] = useState({
    valor: "",
    metodoPagamento: "",
    numeroCartao: "",
    dataValidade: "",
    codigoSeguranca: "",
    email: ""
  });
  const location = useLocation();
  const navigate = useNavigate();

  const handleValorChange = (event) => {
    setFormValues({ ...formValues, valor: event.target.value });
  };

  const handleMetodoPagamentoChange = (event) => {
    setFormValues({ ...formValues, metodoPagamento: event.target.value });
  };

  const handleNumeroCartaoChange = (event) => {
    setFormValues({ ...formValues, numeroCartao: event.target.value });
  };

  const handleDataValidadeChange = (event) => {
    setFormValues({ ...formValues, dataValidade: event.target.value });
  };

  const handleCodigoSegurancaChange = (event) => {
    setFormValues({ ...formValues, codigoSeguranca: event.target.value });
  };

  const handleEmailChange = (event) => {
    setFormValues({ ...formValues, email: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const {
      valor,
      metodoPagamento,
      numeroCartao,
      dataValidade,
      codigoSeguranca,
      email
    } = formValues;

    if (!valor || Number(valor) <= 0) {
      toastr.warning("O valor do pagamento deve ser maior que zero.");
      return;
    }

    if (!metodoPagamento) {
      toastr.warning("Selecione um método de pagamento.");
      return;
    }

    if (metodoPagamento === "cartaoCredito") {
      if (!numeroCartao) {
        toastr.warning("Preencha o número do cartão.");
        return;
      }

      if (!dataValidade) {
        toastr.warning("Preencha a data de validade.");
        return;
      }

      if (!codigoSeguranca) {
        toastr.warning("Preencha o código de segurança.");
        return;
      }
    }

    if (!email) {
      toastr.warning("Preencha o e-mail.");
      return;
    }

    try {
      const pacoteId = getPacoteIdFromURL();
      const email = formValues.email;

      // Verificar se o usuário já possui o pacote com o ID especificado
      const pagamentosRef = collection(db, "pagamentos");
      const q = query(
        pagamentosRef,
        where("pacoteId", "==", pacoteId),
        where("email", "==", email)
      );
      const pagamentosDocs = await getDocs(q);

      if (!pagamentosDocs.empty) {
        toastr.warning("Esse pacote já foi adquirido pelo usuário.");
        console.log("Esse pacote já foi adquirido pelo usuário.");
        return;
      }
      const pagamento = {
        valor: Number(valor),
        metodoDePagamento: {
          codigo: 1,
          numero: numeroCartao,
          validade: dataValidade
        },
        pacoteId: pacoteId,
        email: email
      };

      const docRef = await addDoc(collection(db, "pagamentos"), pagamento);
      console.log("Pagamento salvo com sucesso. Documento ID:", docRef.id);

      setFormValues({
        valor: "",
        metodoPagamento: "",
        numeroCartao: "",
        dataValidade: "",
        codigoSeguranca: "",
        email: ""
      });

      toastr.success("Pagamento realizado com sucesso!");
      navigate("/meus-pacotes");
    } catch (error) {
      console.error("Erro ao realizar o pagamento:", error);
      toastr.error(
        "Erro ao realizar o pagamento. Por favor, tente novamente mais tarde."
      );
    }
  };

  const handleCancelar = () => {
    setFormValues({
      valor: "",
      metodoPagamento: "",
      numeroCartao: "",
      dataValidade: "",
      codigoSeguranca: "",
      email: ""
    });

    navigate("/");
  };

  useEffect(() => {
    const getPacoteValor = async () => {
      const pacoteId = getPacoteIdFromURL();
      // Use pacoteId para buscar o valor do pacote no banco de dados
      try {
        const docRef = doc(db, "pacotes", pacoteId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const pacoteData = docSnap.data();
          setFormValues({ ...formValues, valor: pacoteData.Preco });
        } else {
          console.log("Pacote não encontrado");
        }
      } catch (error) {
        console.error("Erro ao obter o valor do pacote:", error);
      }
    };

    getPacoteValor();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getPacoteIdFromURL = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("compraId");
  };

  const isFieldEmpty = (fieldName) => {
    return formValues[fieldName].trim() === "";
  };

  return (
    <div className="pagamento-container">
      <div className="pagamento-form">
        <h2 className="pagamento-title">Pagamento</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="valor" className="pagamento-label">
            Valor:
          </label>
          <input
            type="text"
            id="valor"
            value={formValues.valor}
            onChange={handleValorChange}
            className="pagamento-valor-inputtext"
          />

          <label htmlFor="metodoPagamento" className="pagamento-label">
            Método de Pagamento:
          </label>
          <select
            id="metodoPagamento"
            value={formValues.metodoPagamento}
            onChange={handleMetodoPagamentoChange}
            className="pagamento-select"
          >
            <option value="">Selecione um método de pagamento</option>
            <option value="cartaoCredito">Cartão de Crédito</option>
          </select>

          {formValues.metodoPagamento === "cartaoCredito" && (
            <>
              <div className="cartao-credito-container">
                <div className="cartao-credito-input">
                  <label htmlFor="numeroCartao" className="pagamento-label">
                    Número do Cartão:
                  </label>
                  <input
                    type="text"
                    id="numeroCartao"
                    value={formValues.numeroCartao}
                    onChange={handleNumeroCartaoChange}
                    className={`pagamento-inputtext ${
                      isFieldEmpty("numeroCartao") ? "empty-field" : ""
                    }`}
                  />
                  {isFieldEmpty("numeroCartao") && (
                    <p className="error-message">Campo obrigatório</p>
                  )}
                </div>
                <div className="cartao-credito-input">
                  <label htmlFor="dataValidade" className="pagamento-label">
                    Data de Validade:
                  </label>
                  <input
                    type="text"
                    id="dataValidade"
                    value={formValues.dataValidade}
                    onChange={handleDataValidadeChange}
                    className={`pagamento-inputtext ${
                      isFieldEmpty("dataValidade") ? "empty-field" : ""
                    }`}
                  />
                  {isFieldEmpty("dataValidade") && (
                    <p className="error-message">Campo obrigatório</p>
                  )}
                </div>
                <div className="cartao-credito-input">
                  <label htmlFor="codigoSeguranca" className="pagamento-label">
                    Código de Segurança:
                  </label>
                  <input
                    type="text"
                    id="codigoSeguranca"
                    value={formValues.codigoSeguranca}
                    onChange={handleCodigoSegurancaChange}
                    className={`pagamento-inputtext ${
                      isFieldEmpty("codigoSeguranca") ? "empty-field" : ""
                    }`}
                  />
                  {isFieldEmpty("codigoSeguranca") && (
                    <p className="error-message">Campo obrigatório</p>
                  )}
                </div>
              </div>
            </>
          )}

          <label htmlFor="email" className="pagamento-label">
            E-mail:
          </label>
          <input
            type="email"
            id="email"
            value={formValues.email}
            onChange={handleEmailChange}
            className={`pagamento-inputtext pagamento-inputtext-small empty-field ${
              isFieldEmpty("email") ? "empty-field" : ""
            }`}
            style={{ maxHeight: "35px" }}
          />
          {isFieldEmpty("email") && (
            <p className="error-message">Campo obrigatório</p>
          )}

          <div className="pagamento-button-container">
            <button type="submit" className="pagamento-btn-pagar">
              Pagar
            </button>
            <button
              type="button"
              onClick={handleCancelar}
              className="pagamento-btn-cancelar"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Pagamento;
