import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import {
  categoriaLabels,
  podeEditarOuExcluir,
  proximoStatus,
  statusLabels,
} from '../../domain/solicitacoes/solicitacao';
import { solicitacoes } from '../../infrastructure/repositories/solicitacoes';
import { mensagemErro } from '../../infrastructure/http/clients';
import { useAuth } from '../context/AuthContext';

function formatarData(value) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(value));
}

export default function SolicitacaoDetalhePage() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [item, setItem] = useState(null);
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [mensagem, setMensagem] = useState(location.state?.mensagem ?? '');

  useEffect(() => {
    const controller = new AbortController();

    solicitacoes.consultar(id, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setItem(data);
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setErro(mensagemErro(error));
        }
      });

    return () => controller.abort();
  }, [id]);

  async function avancar() {
    if (!window.confirm('Deseja avançar para o próximo status?')) {
      return;
    }

    setOcupado(true);
    setErro('');
    setMensagem('');

    try {
      await solicitacoes.avancar(item);
      const atualizado = await solicitacoes.consultar(id);
      setItem(atualizado);
      setMensagem('Status atualizado com sucesso.');
    } catch (error) {
      setErro(error.response ? mensagemErro(error) : error.message);
    } finally {
      setOcupado(false);
    }
  }

  async function excluir() {
    if (!window.confirm(
      'Excluir esta solicitação definitivamente? Esta ação não pode ser desfeita.',
    )) {
      return;
    }

    setOcupado(true);
    setErro('');

    try {
      await solicitacoes.excluir(item);
      navigate('/solicitacoes');
    } catch (error) {
      setErro(error.response ? mensagemErro(error) : error.message);
      setOcupado(false);
    }
  }

  if (!item) {
    return erro ? (
      <section className="content-card">
        <div className="alert error" role="alert">{erro}</div>
        <Link to="/solicitacoes">Voltar às solicitações</Link>
      </section>
    ) : <p role="status">Carregando detalhes…</p>;
  }

  const seguinte = proximoStatus(item.status);

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Solicitação #{item.codigo}</span>
          <h1>{item.titulo}</h1>
        </div>
        <Link className="button secondary" to="/solicitacoes">
          Voltar
        </Link>
      </div>

      {erro && <div className="alert error" role="alert">{erro}</div>}
      {mensagem && (
        <div className="alert success" role="status">{mensagem}</div>
      )}

      <section className="content-card">
        <dl className="detail-grid">
          <div>
            <dt>Status</dt>
            <dd>
              <span className={`badge ${item.status.toLowerCase()}`}>
                {statusLabels[item.status]}
              </span>
            </dd>
          </div>
          <div>
            <dt>Categoria</dt>
            <dd>{categoriaLabels[item.categoria]}</dd>
          </div>
          <div>
            <dt>Solicitante</dt>
            <dd>{usuario.name}</dd>
          </div>
          <div>
            <dt>Data de abertura</dt>
            <dd>{formatarData(item.createdAt)}</dd>
          </div>
          <div>
            <dt>Última atualização</dt>
            <dd>{formatarData(item.updatedAt)}</dd>
          </div>
        </dl>

        <h2>Descrição</h2>
        <p className="request-description">{item.descricao}</p>

        <div className="action-row">
          {podeEditarOuExcluir(item) && (
            <>
              {!ocupado && (
                <Link
                  className="button secondary"
                  to={`/solicitacoes/${id}/editar`}
                >
                  Editar
                </Link>
              )}
              <button
                className="button danger"
                onClick={excluir}
                disabled={ocupado}
              >
                Excluir
              </button>
            </>
          )}

          {seguinte && (
            <button
              className="button primary"
              onClick={avancar}
              disabled={ocupado}
            >
              {ocupado
                ? 'Aguarde…'
                : `Avançar para ${statusLabels[seguinte].toLowerCase()}`}
            </button>
          )}
        </div>
      </section>
    </>
  );
}