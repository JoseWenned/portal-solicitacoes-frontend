import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  categorias,
  categoriaLabels,
} from '../../domain/solicitacoes/solicitacao';
import { solicitacaoSchema } from '../../application/validation/solicitacaoSchema';
import { solicitacoes } from '../../infrastructure/repositories/solicitacoes';
import { mensagemErro } from '../../infrastructure/http/clients';

export default function SolicitacaoForm({ solicitacao = null }) {
  const navigate = useNavigate();
  const [erro, setErro] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(solicitacaoSchema),
    defaultValues: {
      titulo: solicitacao?.titulo ?? '',
      descricao: solicitacao?.descricao ?? '',
      categoria: solicitacao?.categoria ?? '',
    },
  });

  async function salvar(dados) {
    setErro('');

    try {
      if (solicitacao) {
        await solicitacoes.editar(solicitacao, dados);
        navigate(`/solicitacoes/${solicitacao.id}`);
      } else {
        const criada = await solicitacoes.criar(dados);
        navigate(`/solicitacoes/${criada.id}`, {
          state: { mensagem: 'Solicitação criada com sucesso.' },
        });
      }
    } catch (error) {
      setErro(
        error.response
          ? mensagemErro(error)
          : error.message || 'Não foi possível salvar a solicitação.',
      );
    }
  }

  return (
    <form className="content-card request-form" onSubmit={handleSubmit(salvar)}>
      {erro && <div className="alert error" role="alert">{erro}</div>}

      <div className="field">
        <label htmlFor="titulo">Título</label>
        <input
          id="titulo"
          aria-invalid={Boolean(errors.titulo)}
          aria-describedby={errors.titulo ? 'titulo-error' : undefined}
          {...register('titulo')}
        />
        {errors.titulo && (
          <small id="titulo-error">{errors.titulo.message}</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="categoria">Categoria</label>
        <select
          id="categoria"
          aria-invalid={Boolean(errors.categoria)}
          aria-describedby={errors.categoria ? 'categoria-error' : undefined}
          {...register('categoria')}
        >
          <option value="">Selecione</option>
          {categorias.map((value) => (
            <option key={value} value={value}>
              {categoriaLabels[value]}
            </option>
          ))}
        </select>
        {errors.categoria && (
          <small id="categoria-error">{errors.categoria.message}</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="descricao">Descrição</label>
        <textarea
          id="descricao"
          rows={7}
          aria-invalid={Boolean(errors.descricao)}
          aria-describedby={errors.descricao ? 'descricao-error' : undefined}
          {...register('descricao')}
        />
        {errors.descricao && (
          <small id="descricao-error">{errors.descricao.message}</small>
        )}
      </div>

      <div className="action-row">
        <button className="button primary" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando…' : 'Salvar solicitação'}
        </button>
        <Link
          className="button secondary"
          to={solicitacao
            ? `/solicitacoes/${solicitacao.id}`
            : '/solicitacoes'}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}