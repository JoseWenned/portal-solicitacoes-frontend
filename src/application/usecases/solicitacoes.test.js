import { describe, expect, it, vi } from 'vitest';
import { criarCasosDeUsoSolicitacoes } from './solicitacoes';

describe('Casos de uso de solicitações', () => {
  it('normaliza os dados antes de criar', async () => {
    const repository = {
      criar: vi.fn().mockResolvedValue({ id: 'nova' }),
    };

    const casos = criarCasosDeUsoSolicitacoes(repository);

    await casos.criar({
      titulo: '  Acesso ao sistema  ',
      descricao: '  Solicito acesso.  ',
      categoria: 'TI',
    });

    expect(repository.criar).toHaveBeenCalledWith({
      titulo: 'Acesso ao sistema',
      descricao: 'Solicito acesso.',
      categoria: 'TI',
    });
  });

  it('impede edição e exclusão após atendimento', () => {
    const repository = {
      editar: vi.fn(),
      excluir: vi.fn(),
    };

    const casos = criarCasosDeUsoSolicitacoes(repository);
    const item = { id: 'teste', status: 'EM_ATENDIMENTO' };

    expect(() => casos.editar(item, {})).toThrow(
      'Somente solicitações abertas podem ser editadas.',
    );
    expect(() => casos.excluir(item)).toThrow(
      'Somente solicitações abertas podem ser excluídas.',
    );

    expect(repository.editar).not.toHaveBeenCalled();
    expect(repository.excluir).not.toHaveBeenCalled();
  });

  it('avança somente para o próximo status', async () => {
    const repository = {
      alterarStatus: vi.fn().mockResolvedValue(undefined),
    };

    const casos = criarCasosDeUsoSolicitacoes(repository);

    await casos.avancar({ id: 'teste', status: 'ABERTO' });
    await casos.avancar({ id: 'teste', status: 'EM_ATENDIMENTO' });

    expect(repository.alterarStatus).toHaveBeenNthCalledWith(
      1, 'teste', 'EM_ATENDIMENTO',
    );
    expect(repository.alterarStatus).toHaveBeenNthCalledWith(
      2, 'teste', 'CONCLUIDO',
    );
    expect(() => casos.avancar({
      id: 'teste',
      status: 'CONCLUIDO',
    })).toThrow('Esta solicitação já foi concluída.');
  });
});