import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Seat from "../../components/Seat";
import FormPurchase from "../../components/FormPurchase";

export default function SeatsPage() {
  const { idSessao } = useParams();
  const [sessaoInfo, setSessaoInfo] = useState(undefined);
  const [assentosReservados, setAssentosReservados] = useState([]);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");

  useEffect(() => {
    const url = `https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idSessao}/seats`;
    const requisicao = axios.get(url);

    requisicao.then((resposta) => {
      setSessaoInfo(resposta.data);
    });
  }, [idSessao]);

  console.log(nome);
  console.log(cpf);
  function adicionarAssento(disponivel, idAssento) {
    if (assentosReservados.includes(idAssento)) {
      //Se assento estiver selecionado, remove a seleção
      const novoArray = assentosReservados.filter((value) => value !== idAssento);
      setAssentosReservados([...novoArray]);
    } else if (disponivel) {
      //Se estiver disponível
      setAssentosReservados([...assentosReservados, idAssento]);
      console.log(assentosReservados);
    } else {
      alert("Esse assento não está disponível");
    }
  }

  function reservarAssentos(){
    const url = "https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many";
    const objReserva = {
        ids: assentosReservados,
        name: nome,
        cpf: cpf
    };
    const requisicao = axios.post(url,objReserva);
    requisicao.then((resposta) => {
        console.log(resposta.data)
        alert('Sucesso!');
        //Seguir para outra página
      });
    requisicao.catch((erro)=>{
        console.log(erro);
        alert('Por favor, tente novamente.')
    });
  }

  if (sessaoInfo === undefined) {
    return <div>Carregando...</div>;
  }
  return (
    <PageContainer>
      Selecione o(s) assento(s)
      <SeatsContainer>
        {sessaoInfo.seats.map((assento) => (
          <Seat
            key={assento.id}
            idAssento={assento.id}
            numeroAssento={assento.name}
            disponivel={assento.isAvailable}
            adicionarAssento={adicionarAssento}
            assentosReservados={assentosReservados}
          />
        ))}
      </SeatsContainer>
      <CaptionContainer>
        <CaptionItem>
          <CaptionCircle id="selecionado" />
          Selecionado
        </CaptionItem>
        <CaptionItem>
          <CaptionCircle disponivel={true} />
          Disponível
        </CaptionItem>
        <CaptionItem>
          <CaptionCircle disponivel={false} />
          Indisponível
        </CaptionItem>
      </CaptionContainer>
      <FormPurchase nome={nome} setNome={setNome} cpf={cpf} setCpf={setCpf} reservarAssentos={reservarAssentos}/>      
      <FooterContainer>
        <div>
          <img src={sessaoInfo.movie.posterURL} alt="poster" />
        </div>
        <div>
          <p>{sessaoInfo.movie.title}</p>
          <p>
            {sessaoInfo.day.weekday} - {sessaoInfo.name}
          </p>
        </div>
      </FooterContainer>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Roboto";
  font-size: 24px;
  text-align: center;
  color: #293845;
  margin-top: 30px;
  padding-bottom: 120px;
  padding-top: 70px;
`;
const SeatsContainer = styled.div`
  width: 330px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const CaptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 300px;
  justify-content: space-between;
  margin: 20px;
`;
const CaptionCircle = styled.div`
  border-color: ${({ disponivel }) =>
    disponivel
      ? "#808F9D"
      : "#F7C52B"}; // cores que mudam de acordo com disponibilidade
  background-color: ${({ disponivel }) => (disponivel ? "#C3CFD9" : "#FBE192")};
  border-width: 1px;
  border-style: solid;
  height: 25px;
  width: 25px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 3px;
  //ID para selecionar assento. Poderá ser alterado
  &#selecionado {
    border-color: #0E7D71;
    background-color: #1aae9e;
  }
`;
const CaptionItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
`;
const FooterContainer = styled.div`
  width: 100%;
  height: 120px;
  background-color: #c3cfd9;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 20px;
  position: fixed;
  bottom: 0;

  div:nth-child(1) {
    box-shadow: 0px 2px 4px 2px #0000001a;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    margin: 12px;
    img {
      width: 50px;
      height: 70px;
      padding: 8px;
    }
  }

  div:nth-child(2) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    p {
      text-align: left;
      &:nth-child(2) {
        margin-top: 10px;
      }
    }
  }
`;
