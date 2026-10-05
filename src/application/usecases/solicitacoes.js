import {
  podeEditarOuExcluir,
  proximoStatus,
} from '../../domain/solicitacoes/solicitacao';
import { solicitacaoSchema } from '../validation/solicitacaoSchema';

export function criarCasosDeUsoSolicitacoes(repository) {
  return {
    listar: (filtros, signal) => repository.listar(filtros, signal),

    consultar: (id, signal) => repository.consultar(id, signal),

    dashboard: (signal) => repository.dashboard(signal),

    criar(dados) {
      return repository.criar(solicitacaoSchema.parse(dados));
    },

    editar(solicitacao, dados) {
      if (!podeEditarOuExcluir(solicitacao)) {
        throw new Error('Somente solicitações abertas podem ser editadas.');
      }

      return repository.editar(
        solicitacao.id,
        solicitacaoSchema.parse(dados),
      );
    },

    excluir(solicitacao) {
      if (!podeEditarOuExcluir(solicitacao)) {
        throw new Error('Somente solicitações abertas podem ser excluídas.');
      }

      return repository.excluir(solicitacao.id);
    },

    avancar(solicitacao) {
      const status = proximoStatus(solicitacao.status);

      if (!status) {
        throw new Error('Esta solicitação já foi concluída.');
      }

      return repository.alterarStatus(solicitacao.id, status);
    },
  };
}