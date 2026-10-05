import { criarCasosDeUsoSolicitacoes } from '../../application/usecases/solicitacoes';
import { solicitacaoRepository } from './solicitacaoRepository';

export const solicitacoes = criarCasosDeUsoSolicitacoes(
  solicitacaoRepository,
);