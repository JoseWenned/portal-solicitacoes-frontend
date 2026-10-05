import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { solicitacoes } from '../../infrastructure/repositories/solicitacoes';
import { mensagemErro } from '../../infrastructure/http/clients';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { usuario } = useAuth();
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    solicitacoes.dashboard(controller.signal)
      .then(setDados)
      .catch((error) => {
        if (!controller.signal.aborted) {
          setErro(mensagemErro(error));
        }
      });

    return () => controller.abort();
  }, [tentativa]);

  const cards = dados ? [
    ['Total de solicitações', dados.total, 'total'],
    ['Abertas', dados.abertas, 'aberto'],
    ['Em atendimento', dados.emAtendimento, 'atendimento'],
    ['Concluídas', dados.concluidas, 'concluido'],
  ] : [];

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Visão geral</span>
          <h1>Olá, {usuario.name}!</h1>
          <p>Acompanhe o andamento das suas demandas internas.</p>
        </div>
        <Link className="button primary" to="/solicitacoes/nova">
          Nova solicitação
        </Link>
      </div>

      {erro ? (
        <div className="alert error" role="alert">
          <p>{erro}</p>
          <button
            className="button secondary"
            onClick={() => {
              setErro('');
              setTentativa((value) => value + 1);
            }}
          >
            Tentar novamente
          </button>
        </div>
      ) : !dados ? (
        <p role="status">Carregando indicadores…</p>
      ) : (
        <section className="dashboard-grid" aria-label="Indicadores">
          {cards.map(([label, value, classe]) => (
            <article className={`metric-card ${classe}`} key={label}>
              <h2>{label}</h2>
              <strong>{value}</strong>
              <span>Das suas solicitações</span>
            </article>
          ))}
        </section>
      )}

      <section className="content-card">
        <h2>Suas solicitações em um só lugar</h2>
        <p>
          Consulte detalhes, filtre demandas e acompanhe o fluxo
          de aberto até concluído.
        </p>
        <Link to="/solicitacoes">Consultar minhas solicitações →</Link>
      </section>
    </>
  );
}