import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { solicitacoes } from '../../infrastructure/repositories/solicitacoes';
import { mensagemErro } from '../../infrastructure/http/clients';
import { podeEditarOuExcluir } from '../../domain/solicitacoes/solicitacao';
import SolicitacaoForm from '../components/SolicitacaoForm';

export default function SolicitacaoFormPage() {
  const { id } = useParams();
  const [solicitacao, setSolicitacao] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!id) {
      return undefined;
    }

    const controller = new AbortController();

    solicitacoes.consultar(id, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setSolicitacao(data);
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setErro(mensagemErro(error));
        }
      });

    return () => controller.abort();
  }, [id]);

  if (erro) {
    return (
      <section className="content-card">
        <div className="alert error" role="alert">{erro}</div>
        <Link to="/solicitacoes">Voltar às solicitações</Link>
      </section>
    );
  }

  if (id && !solicitacao) {
    return <p role="status">Carregando solicitação…</p>;
  }

  if (solicitacao && !podeEditarOuExcluir(solicitacao)) {
    return (
      <section className="content-card">
        <h1>Edição indisponível</h1>
        <p>Somente solicitações abertas podem ser editadas.</p>
        <Link to={`/solicitacoes/${id}`}>Voltar aos detalhes</Link>
      </section>
    );
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Sua demanda</span>
          <h1>{id ? 'Editar solicitação' : 'Nova solicitação'}</h1>
          <p>Informe o título, a categoria e os detalhes da demanda.</p>
        </div>
      </div>
      <SolicitacaoForm key={id ?? 'nova'} solicitacao={solicitacao} />
    </>
  );
}