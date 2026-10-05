import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  categorias,
  categoriaLabels,
  statusLabels,
} from '../../domain/solicitacoes/solicitacao';
import { solicitacoes } from '../../infrastructure/repositories/solicitacoes';
import { mensagemErro } from '../../infrastructure/http/clients';
import { useAuth } from '../context/AuthContext';

const filtrosIniciais = {
  titulo: '',
  categoria: '',
  status: '',
  dataInicial: '',
  dataFinal: '',
};

function formatarData(value) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(value));
}

export default function SolicitacoesPage() {
  const { usuario } = useAuth();
  const [form, setForm] = useState(filtrosIniciais);
  const [consulta, setConsulta] = useState({
    ...filtrosIniciais,
    page: 0,
    size: 10,
  });
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    solicitacoes.listar(consulta, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setResultado(data);
          setErro('');
          setCarregando(false);
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setErro(mensagemErro(error));
          setCarregando(false);
        }
      });

    return () => controller.abort();
  }, [consulta]);

  function alterar(event) {
    const { name, value } = event.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  function pesquisar(event) {
    event.preventDefault();

    if (
      form.dataInicial
      && form.dataFinal
      && form.dataInicial > form.dataFinal
    ) {
      setErro('A data inicial não pode ser posterior à data final.');
      return;
    }

    setCarregando(true);
    setErro('');
    setConsulta({ ...form, page: 0, size: consulta.size });
  }

  function limpar() {
    setForm(filtrosIniciais);
    setCarregando(true);
    setErro('');
    setConsulta({ ...filtrosIniciais, page: 0, size: consulta.size });
  }

  function mudarPagina(page) {
    setCarregando(true);
    setConsulta((atual) => ({ ...atual, page }));
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Minhas demandas</span>
          <h1>Solicitações</h1>
          <p>Pesquise e acompanhe suas solicitações.</p>
        </div>
        <Link className="button primary" to="/solicitacoes/nova">
          Nova solicitação
        </Link>
      </div>

      <form className="content-card filters" onSubmit={pesquisar}>
        <div className="field">
          <label htmlFor="filtro-titulo">Título</label>
          <input
            id="filtro-titulo"
            name="titulo"
            value={form.titulo}
            onChange={alterar}
            placeholder="Pesquisar título"
          />
        </div>

        <div className="field">
          <label htmlFor="filtro-categoria">Categoria</label>
          <select
            id="filtro-categoria"
            name="categoria"
            value={form.categoria}
            onChange={alterar}
          >
            <option value="">Todas</option>
            {categorias.map((value) => (
              <option key={value} value={value}>
                {categoriaLabels[value]}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="filtro-status">Status</label>
          <select
            id="filtro-status"
            name="status"
            value={form.status}
            onChange={alterar}
          >
            <option value="">Todos</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="data-inicial">Data inicial</label>
          <input
            id="data-inicial"
            name="dataInicial"
            type="date"
            value={form.dataInicial}
            onChange={alterar}
          />
        </div>

        <div className="field">
          <label htmlFor="data-final">Data final</label>
          <input
            id="data-final"
            name="dataFinal"
            type="date"
            value={form.dataFinal}
            onChange={alterar}
          />
        </div>

        <div className="filter-actions">
          <button className="button primary" disabled={carregando}>
            Filtrar
          </button>
          <button
            className="button secondary"
            type="button"
            onClick={limpar}
            disabled={carregando}
          >
            Limpar
          </button>
        </div>
      </form>

      {erro && <div className="alert error" role="alert">{erro}</div>}

      <section className="content-card" aria-label="Resultado da consulta">
        {carregando ? (
          <p role="status">Carregando solicitações…</p>
        ) : erro ? (
          <p>Ajuste os filtros ou tente pesquisar novamente.</p>
        ) : !resultado?.content.length ? (
          <div className="empty-state">
            <h2>Nenhuma solicitação encontrada</h2>
            <p>Altere os filtros ou registre uma nova demanda.</p>
          </div>
        ) : (
          <>
            <div className="table-scroll">
              <table>
                <caption className="sr-only">Solicitações do usuário</caption>
                <thead>
                  <tr>
                    <th scope="col">Código</th>
                    <th scope="col">Título</th>
                    <th scope="col">Categoria</th>
                    <th scope="col">Solicitante</th>
                    <th scope="col">Data de abertura</th>
                    <th scope="col">Status</th>
                    <th scope="col">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.content.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.codigo}</td>
                      <td className="title-cell">{item.titulo}</td>
                      <td>{categoriaLabels[item.categoria]}</td>
                      <td>{usuario.name}</td>
                      <td>{formatarData(item.createdAt)}</td>
                      <td>
                        <span className={`badge ${item.status.toLowerCase()}`}>
                          {statusLabels[item.status]}
                        </span>
                      </td>
                      <td>
                        <Link to={`/solicitacoes/${item.id}`}>Detalhes</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <span>
                {resultado.totalElements} solicitações · Página{' '}
                {resultado.page + 1} de {resultado.totalPages}
              </span>
              <div>
                <button
                  className="button secondary"
                  disabled={resultado.page === 0}
                  onClick={() => mudarPagina(resultado.page - 1)}
                >
                  Anterior
                </button>
                <button
                  className="button secondary"
                  disabled={resultado.page + 1 >= resultado.totalPages}
                  onClick={() => mudarPagina(resultado.page + 1)}
                >
                  Próxima
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}